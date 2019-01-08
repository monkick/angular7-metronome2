import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private _mode: Subject<any>;
  private _modeSP: Subject<any>;
  public mode: Observable<any>;
  public modeSP: Observable<any>;

  constructor() {
    this._mode = new Subject();
    this._modeSP = new Subject();
    this.mode = this._mode.asObservable();
    this.modeSP = this._modeSP.asObservable();
  }

  setMode (value: string) {
    this._mode.next(value);
  }

  setModeSP(value: string) {
    this._modeSP.next(value);
  }
}
