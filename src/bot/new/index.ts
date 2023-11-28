import {
  Observable,
  Subscription,
  BehaviorSubject,

  exhaustMap,
  withLatestFrom,
  map,
  pairwise,
  filter,
  window,
  first,
  mergeAll,
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

  private ticktackObserable?: Observable<any>; 

  private resultObservable?: BehaviorSubject<any>;
  private pingObservable?: BehaviorSubject<any>; 
  private positionObservable?: BehaviorSubject<any>;

  private calculateObservable?: Observable<any>;

  constructor(confg: any, observable?: Observable<any>) {
    this.config = confg;

    this.subcriptions = new Subscription();
    this.resultObservable = new BehaviorSubject(null);

    this.ticktackObserable = observable;

    this.setupPositionObservable();
    this.setupPingObserable();
    this.setupCalculateObservable();

    this.setupListener();
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

    this.positionObservable = new BehaviorSubject(null);

    const subcription = this.ticktackObserable?.pipe(
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
    ).subscribe(this.positionObservable?.next.bind(this.positionObservable));

    this.subcriptions?.add(subcription);
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

    this.pingObservable = new BehaviorSubject(null);

    const subcription = this.ticktackObserable?.pipe(
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
      mergeAll(),
      map(([event, result]) => {
        const {
          timestamp: timestampS,
        } = result;
        const {
          timestamp: timestampE,
          now,
        } = event;

        // start + diff + ping = end
        // now + diff - ping = end

        const ping = (now - timestampS) / 2;
        const diff = timestampE - (timestampS + now) / 2;

        return {
          ping,
          diff,
        };
      })
    ).subscribe(this.pingObservable?.next.bind(this.pingObservable));

    this.subcriptions?.add(subcription);
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
    this.resultObservable?.next({
      ...result,
      timestamp: Date.now(),
    });
  }

  public registerResultListener(listener: (value: any) => void) {
    return this.resultObservable?.subscribe(listener);
  }

  public registerPingResult(listener: (value: any) => void) {
    return this.pingObservable?.subscribe(listener);
  }

  public dispose() {
    this.subcriptions?.unsubscribe();
  }
}

export default BotManager;
