import { defer } from 'rxjs/observable/defer';
import { Injectable, Component } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs/Subject';

/** Create async observable that emits-once and completes
 *  after a JS engine turn */
export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

/** Create async observable error that errors
 *  after a JS engine turn */
export function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

@Injectable()
export class RouterStub {
  public url;
  private subject = new Subject();
  public events = this.subject.asObservable();

  navigate(url: string) {
    this.url = url;
    this.triggerNavEvents(url);
  }

  triggerNavEvents(url) {
    const ne = new NavigationEnd(0, url, null);
    this.subject.next(ne);
  }
}

@Component({
  template: ''
})
export class DummyComponent { }
