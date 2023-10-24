import {
  Observable,
  Subscription,
  Subject,
  exhaustMap,
  share,
  withLatestFrom,
} from 'rxjs';

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const calculate = async () => {
  await timeout(5000);

  return "done here";
};

class BusStation {
  private config: any;

  private subcriptions?: Subscription;
  private resultListeners?: Subject<any>;

  constructor(confg: any, observable?: Observable<any>) {
    this.config = confg;

    this.resultListeners = new Subject<any>();

    const sharedObservable  = observable?.pipe(share());
    this.subcriptions = new Subscription();

    const ticktackSubcription = sharedObservable?.subscribe(this.ticktack.bind(this));
    this.subcriptions.add(ticktackSubcription);

    const resultObservable = sharedObservable
      ?.pipe(
        exhaustMap(async () => {
          const result = await calculate();

          return result;
        })
      );

    if (resultObservable && sharedObservable) {
      const mergedObservable = resultObservable.pipe(withLatestFrom(sharedObservable));

      const resultSubcription = mergedObservable.subscribe(this.onCalculated.bind(this));
      this.subcriptions.add(resultSubcription);
    }
  }

  private onCalculated([ result, latestData ]: any) {
    console.log("onCalculated", result, latestData);

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
