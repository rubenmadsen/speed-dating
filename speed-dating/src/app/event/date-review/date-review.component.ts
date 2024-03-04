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
    this.user = user
    this.isOpen = true
    this.userDates=[]
    this.getDatesFromBackend()
  }

  getDatesFromBackend() {
    if (this.event !== null) {
        this.event.dates.forEach(date => {
          this.backend.getDate(date).subscribe(d=>{
            if (d.personOne._id == this.user?._id){
              this.userDates.push(d)
              console.log(d.feedbackOne);
            }
          });
        });
    }
 }
  /*togglePopUp(){
    this.isOpen=false;
    /!*this.isOpen = !this.isOpen;*!/

  }*/
  closePopUp(){
    this.isOpen=false;
  }
}
