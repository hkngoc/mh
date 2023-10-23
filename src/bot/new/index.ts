import {
  Observable,
  Subscription,
  Subject,
} from 'rxjs';

class BusStation {
  private config: any;

  private observer?: Subscription;
  private listeners?: Subject<any>;

  constructor(confg: any, observable?: Observable<any>) {
    this.config = confg;

    this.listeners = new Subject<any>();
    this.observer = observable?.subscribe(this.ticktack.bind(this));
  }

  private ticktack(json: any) {
    console.log("bustation ticktack", json);

    this.listeners?.next("this is result");
  }

  public registerResultListener(listener: (value: any) => void) {
    return this.listeners?.subscribe({
      next: listener,
    });
  }

  public dispose() {
    console.log("bus dispose");
    this.listeners?.unsubscribe();
    this.observer?.unsubscribe();
  }
}

export default BusStation;
