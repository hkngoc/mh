import {
  Observable,
  Subscription,
  Subject,
  exhaustMap,
  share,
  withLatestFrom,
  map,
} from 'rxjs';

import { cloneDeep } from 'lodash';

import calculator from './calculator';

class BusStation {
  private config: any;

  private subcriptions?: Subscription;
  private resultListeners?: Subject<any>;

  private resultObservable?: Observable<any>;
  private pingObservable?: Observable<any>;

  constructor(confg: any, observable?: Observable<any>) {
    this.config = confg;

    const sharedObservable  = observable?.pipe(share());

    this.subcriptions = new Subscription();

    this.resultListeners = new Subject<any>();

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

    this.pingObservable = new Observable((subscriber) => {
      // just for inital
      subscriber.next(null);

      
    });

    // debug
    // const ticktackSubcription = sharedObservable?.subscribe(this.ticktack.bind(this));
    // this.subcriptions.add(ticktackSubcription);

    const calculateObservable = sharedObservable
      ?.pipe(
        map((state) => [
          cloneDeep({ ...state }),
          { config: this.config }
        ]),
        withLatestFrom(this.resultObservable),
        exhaustMap(calculator)
      );

    if (calculateObservable && sharedObservable) {
      const mergedObservable = calculateObservable.pipe(withLatestFrom(sharedObservable));

      const calculatedSubcription = mergedObservable.subscribe(this.onCalculated.bind(this));
      this.subcriptions.add(calculatedSubcription);
    }
  }

  private onCalculated([ result, latestData ]: any) {
    // check result and latestData can working together
    this.resultListeners?.next(result);
  }

  private ticktack(json: any) {
    console.log("bustation ticktack", json);
  }

  public registerResultListener(listener: (value: any) => void) {
    return this.resultListeners?.subscribe({
      next: listener,
    });
  }

  public dispose() {
    this.resultListeners?.unsubscribe();
    this.subcriptions?.unsubscribe();
  }
}

export default BusStation;
