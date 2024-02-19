import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {StatusMessage} from "../interfaces/statusMessage";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private subject:Subject<StatusMessage> = new Subject<StatusMessage>();
  constructor() {

  }

  setGlobalStatus(message:StatusMessage){
    this.subject.next(message);
  }
  getGlobalStatusSubject():Subject<StatusMessage>{
    return this.subject;
  }
}
