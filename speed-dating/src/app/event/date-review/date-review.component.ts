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
  @Input() event!: EventModel |null;

/*
  dates!: DateModel[];
*/

  userDates : DateModel[] = [];
  constructor(private backend: BackendService) {

  }

  ngOnInit(){}

  onOpenReview(user: UserModel):void{
    console.log(this.event)
    this.user = user
    this.isOpen = true
    this.userDates=[]
    this.getDatesFromBackend()
  }

  getDatesFromBackend() {
    this.event?.dates.forEach(date => {
      if (date.personTwo?._id == this.user?._id || date.personOne._id == this.user?._id){
        this.userDates.push(date)
      }
    })
 }
  /*togglePopUp(){
    this.isOpen=false;
    /!*this.isOpen = !this.isOpen;*!/

  }*/
  closePopUp(){
    this.isOpen=false;
  }
}
