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
  private lastResult?: any;

  constructor(confg: any, observable?: Observable<any>) {
    this.config = confg;

    this.resultListeners = new Subject<any>();

    const sharedObservable  = observable?.pipe(share());
    this.subcriptions = new Subscription();

    // debug
    // const ticktackSubcription = sharedObservable?.subscribe(this.ticktack.bind(this));
    // this.subcriptions.add(ticktackSubcription);

    const resultObservable = sharedObservable
      ?.pipe(
        map(this.mapStateWithLatestResult.bind(this)),
        exhaustMap(calculator)
      );

    if (resultObservable && sharedObservable) {
      const mergedObservable = resultObservable.pipe(withLatestFrom(sharedObservable));

      const resultSubcription = mergedObservable.subscribe(this.onCalculated.bind(this));
      this.subcriptions.add(resultSubcription);
    }
  }

  private mapStateWithLatestResult(state: any) {
    return [
      cloneDeep({ ...state }),
      {
        config: this.config,
        lastResult: this.lastResult,
      }
    ];
  }

  private onCalculated([ result, latestData ]: any) {
    // console.log("onCalculated", result, latestData);
    this.lastResult = result;

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
