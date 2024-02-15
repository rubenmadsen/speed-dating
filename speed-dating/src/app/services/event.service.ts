import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {EventModel} from "../models/eventModel";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventSource: BehaviorSubject<EventModel | null>;

  constructor() {
    const storedEvent = localStorage.getItem('currentEvent');
    const initialEvent = storedEvent ? JSON.parse(storedEvent) : null;
    this.eventSource = new BehaviorSubject<EventModel | null>(initialEvent);
  }

  get currentEvent() {
    return this.eventSource.asObservable();
  }
  changeEvent(event: EventModel) {
    localStorage.setItem('currentEvent', JSON.stringify(event));
    this.eventSource.next(event);
  }
}
