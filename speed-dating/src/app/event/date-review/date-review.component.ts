import {Component, Input} from '@angular/core';
import {UserModel} from "../../models/userModel";
import {EventModel} from "../../models/eventModel";
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-date-review',
  templateUrl: './date-review.component.html',
  styleUrls: ['./date-review.component.css']
})
export class DateReviewComponent {
  @Input() isOpen: Boolean = false;
  @Input() user : UserModel | undefined;
  @Input()event!: EventModel |null;

  constructor(private backend: BackendService) {

  }
  ngOnInit(){
    this.user
  }

  togglePopUp(){
    this.isOpen = !this.isOpen;
    console.log(this.isOpen)
  }
}
