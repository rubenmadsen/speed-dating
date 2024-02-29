import {AfterViewChecked, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {UserModel} from "../../models/userModel";
import {EventModel} from "../../models/eventModel";
import {BackendService} from "../../services/backend.service";
import {DateModel} from "../../models/dateModel";

@Component({
  selector: 'app-date-review',
  templateUrl: './date-review.component.html',
  styleUrls: ['./date-review.component.css']
})
export class DateReviewComponent implements OnInit{
  @Input() isOpen: Boolean = false;
  @Input() user : UserModel | undefined;
  @Input()event!: EventModel |null;
/*
  dates!: DateModel[];
*/
  userDates : DateModel[] = [];
  constructor(private backend: BackendService) {

  }
  ngOnInit(){
    this.user
    this.event
/*
    console.log(this.event?.dates)
*/
/*
    this.getDatesFromBackend();
*/
/*
    this.getDateForUser();
*/
  }


/*  getDateForUser(){
    this.event?.dates.forEach(date=>{
      if (date.personOne===this.user){
        this.userDates.push(date)
      }
    });
  }*/
  getDatesFromBackend(){
    if (this.event !== null){
      this.backend.getSimulatedDatesWithFeedback(this.event).subscribe(event=>{
        console.log("e: ", event)
        /*dates.forEach(date =>{
          if(date.personOne === this.user){
            this.userDates.push(date)
          }
        })*/
      });
    }
  }

  togglePopUp(){
    console.log("Table No: ")
    /*this.isOpen = !this.isOpen;*/

  }
}
