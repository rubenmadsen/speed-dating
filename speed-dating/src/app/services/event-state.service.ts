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
    this.sortDatesByTableNumber()
  }

  clearDates(){
    this.datesSubject.next([])
  }


  addEvent(date: DateModel){
    const currentDates = this.datesSubject.value;
    const highestDateRound = currentDates.reduce((max, current) => Math.max(max, current.dateRound), 0);
    const newDateWithRound = {
      ...date,
      dateRound: highestDateRound
    }
    const updatedDates = [...currentDates, newDateWithRound];
    this.datesSubject.next(updatedDates);
    this.sortDatesByTableNumber()
  }

  removeDate(user: UserModel){
    const currentDates = this.datesSubject.value;
    const updatedDates = currentDates.filter(date => date.personOne !== user);
    this.datesSubject.next(updatedDates);
    this.sortDatesByTableNumber()
  }

  resetTable(tableNumber: number){
    const currentDates = this.datesSubject.value;
    const index = currentDates.findIndex(date => date.tableNumber === tableNumber);
    if (index !== -1) {
      currentDates[index].personTwo = null;
    }
    this.updateDates(currentDates);
  }

  removeUser(user: UserModel){
    const currentDates = this.datesSubject.value;
    const index = currentDates.findIndex(date => date.personTwo === user);
    if (index !== -1) {
      currentDates[index].personTwo = null;
    }
    this.updateDates(currentDates);
  }

  /**
   * Helper method to sort the dates by table number
   */
  sortDatesByTableNumber() {
    const currentDates = this.datesSubject.value;
    const sortedDates = currentDates.sort((a, b) => a.tableNumber - b.tableNumber);
    this.datesSubject.next(sortedDates);
  }

  changeTable(tableNumber1: number, tableNumber2: number) {
    const currentDates = this.datesSubject.value;
    const index1 = currentDates.findIndex(date => date.tableNumber === tableNumber1);
    const index2 = currentDates.findIndex(date => date.tableNumber === tableNumber2);
    if (index1 !== -1 && index2 !== -1) {
      const temp = currentDates[index1];
      currentDates[index1] = {...currentDates[index2], tableNumber: tableNumber1};
      currentDates[index2] = {...temp, tableNumber: tableNumber2};
      this.updateDates(currentDates);
    } else {
      console.error('One or both table numbers not found.');
    }
  }
}
