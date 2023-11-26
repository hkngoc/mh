import {
  Observable,
  Subscription,
  Subject,

  exhaustMap,
  share,
  withLatestFrom,
  map,
  pairwise,
  filter,
  window,
  first,
  catchError,
} from 'rxjs';

import {
  cloneDeep,
  get,
  find,
} from 'lodash';

import calculator from './calculator';

const TAG_BOM_SETUP = "bomb:setup";
const TAG_START_MOVE = "player:start-moving";
const TAG_STOP_MOVE = "player:stop-moving";

const DIRECT_BOMB = "b";
const DIRECT_STOP = "x";

class BotManager {
  private config: any;

  private subcriptions?: Subscription;
  private resultListeners?: Subject<any>;

  private ticktackObserable?: Observable<any>; 

  private resultObservable?: Observable<any>;
  private calculateObservable?: Observable<any>;
  private pingObservable?: Observable<any>;
  private positionObservable?: Observable<any>;

  constructor(confg: any, observable?: Observable<any>) {
    this.config = confg;

    this.subcriptions = new Subscription();
    this.resultListeners = new Subject<any>();

    this.ticktackObserable = observable?.pipe(share());

    this.setupResultObservable();
    this.setupPositionObservable();
    this.setupPingObserable();
    this.setupCalculateObservable();

    // collect direct after emit result
    // from positionObservable
    // pipe 
    // window by filter resultObservable watch = false
    ///

    this.setupListener();
  }

  private setupResultObservable() {
    this.resultObservable = new Observable((subscriber) => {
      // just for inital
      subscriber.next(null);

      const unsubcrible = this.resultListeners?.subscribe((result) => {
        subscriber.next(result);
      });

      return () => {
        unsubcrible?.unsubscribe();
      }
    });
  }

  private setupPositionObservable() {
    const matchKey = (id = "") =>  {
      const { playerId } = this.config;
  
      return playerId.includes(id) || id.includes(playerId);
    }
  
    const findMe = (mapState: any) => {
      return find(get(mapState, "map_info.players", []), (p) => matchKey(p.id));
    }
  
    const getMyPosition = (player: any) => {
      return get(player, "currentPosition");
    }
  
    const isNewPosition = ([prev, curr]: any) => {
      const prevO = findMe(prev);
      const currO = findMe(curr);
  
      if (prevO && currO) {
        const prevPos = getMyPosition(prevO);
        const currPos = getMyPosition(currO);
  
        if (prevPos.col !== currPos.col || prevPos.row !== currPos.row) {
          return true;
        }
      }
  
      return false;
    }

    this.positionObservable = new Observable((subscriber) => {
      subscriber.next(null);

      const unsubcrible = this.ticktackObserable?.pipe(
        pairwise(),
        filter(isNewPosition.bind(this)),
        map(([_prev, curr]) => {
          const {
            tag,
            timestamp,
          } = curr;

          const position = getMyPosition(findMe(curr))

          return {
            tag,
            timestamp,
            position,
          }
        })
      ).subscribe((pos) => {
        subscriber.next(pos);
      });

      return () => {
        unsubcrible?.unsubscribe();  
      }
    });
  }

  private setupPingObserable() {
    const matchKey = (id = "") =>  {
      const { playerId } = this.config;
  
      return playerId.includes(id) || id.includes(playerId);
    }

    if (!this.resultObservable) {
      return;
    }

    const originResultObservable = this.resultObservable.pipe(
      filter((result) => {
        if (!result) {
          return false;
        }

        const { watch, directs } = result;

        if (!watch && directs) {
          return true;
        }

        return false;
      })
    );

    this.pingObservable = new Observable((subscriber) => {
      // just for inital
      subscriber.next(null);

      const unsubcrible = this.ticktackObserable?.pipe(
        // filter my event
        map((event) => {
          return {
            ...event,
            now: Date.now(),
          }
        }),
        filter((event) => {
          const { player_id } = event;

          return matchKey(player_id);
        }),
        withLatestFrom(originResultObservable),
        // window by filter resultObservable watch = false
        window(originResultObservable),
        map((win) => {
          return win.pipe(
            filter(([event, result]) => {
              const { tag } = event;
              const { directs } = result;

              if (directs.startsWith(DIRECT_BOMB)) {
                return tag === TAG_BOM_SETUP;
              } if (directs.startsWith(DIRECT_STOP)) {
                return tag === TAG_STOP_MOVE;
              } else {
                return tag === TAG_START_MOVE;
              }
            }),
            // filter(([event, result]) => {
            //   const { timestamp: timestampS } = result;
            //   const { timestamp: timestampE } = event;

            //   return timestampE >= timestampS;
            // }),
            first(),
            catchError(() => []),
          );
        }),
      ).subscribe((o) => {
        o.subscribe(([event, result]) => {
          const {
            timestamp: timestampS
          } = result;
          const {
            // timestamp: timestampE,
            now,
          } = event;

          // const now = Date.now();
          // start + diff + ping = end
          // now + diff - ping = end

          // const ping = timestampE - timestampS;
          const ping = (now - timestampS) / 2;

          subscriber.next(ping);
        });
      });


      return () => {
        unsubcrible?.unsubscribe();
      }
    }).pipe(share());
  }

  private setupCalculateObservable() {
    if (!this.resultObservable) {
      return;
    }

    this.calculateObservable = this.ticktackObserable
      ?.pipe(
        map((state) => [
          cloneDeep({ ...state }),
          { config: this.config }
        ]),
        withLatestFrom(this.resultObservable),
        exhaustMap(calculator)
      );
  }

  private setupListener() {
    // const positionSubcription = this.positionObservable?.subscribe(pos => console.log("new pos", pos));
    // this.subcriptions?.add(positionSubcription);

    // const pingSubcription = this.pingObservable?.subscribe(ping => console.log("ping", ping));
    // this.subcriptions?.add(pingSubcription);

    // debug
    // const ticktackSubcription = this.ticktackObserable?.subscribe(json => console.log("bustation ticktack", json));
    // this.subcriptions?.add(ticktackSubcription);

    if (this.calculateObservable && this.ticktackObserable) {
      const mergedObservable = this.calculateObservable.pipe(withLatestFrom(this.ticktackObserable));

      const calculatedSubcription = mergedObservable.subscribe(this.onCalculated.bind(this));
      this.subcriptions?.add(calculatedSubcription);
    }
  }

  private onCalculated([ result, latestData ]: any) {
    if (!result) {
      return;
    }

    // check result and latestData can working together
    this.resultListeners?.next({
      ...result,
      timestamp: Date.now(),
    });
  }

  public registerResultListener(listener: (value: any) => void) {
    return this.resultListeners?.subscribe(listener);
  }

  public registerPingResult(listener: (value: any) => void) {
    return this.pingObservable?.subscribe(listener);
  }

  public dispose() {
    this.resultListeners?.unsubscribe();
    this.subcriptions?.unsubscribe();
  }
}

export default BotManager;
