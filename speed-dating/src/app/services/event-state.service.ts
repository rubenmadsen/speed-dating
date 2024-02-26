import { Injectable } from '@angular/core';
import {DateModel} from "../models/dateModel";
import {BehaviorSubject} from "rxjs";
import {UserModel} from "../models/userModel";

@Injectable({
  providedIn: 'root'
})
export class EventStateService {


  private datesSubject = new BehaviorSubject<DateModel[]>([]);
  public dates$ = this.datesSubject.asObservable();

  constructor() { }

  updateDates(dates: DateModel[]) {
    this.datesSubject.next(dates);
  }

  clearDates(){
    this.datesSubject.next([])
  }
  addEvent(date: DateModel){
    const currentDates = this.datesSubject.value;
    const updatedDates = [...currentDates, date];
    this.datesSubject.next(updatedDates);
  }
  removeDate(user: UserModel){
    const currentDates = this.datesSubject.value;
    const updatedDates = currentDates.filter(date => date.personOne !== user);
    this.datesSubject.next(updatedDates);

  }
}
