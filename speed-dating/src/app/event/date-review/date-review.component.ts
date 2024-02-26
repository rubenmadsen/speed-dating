import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-date-review',
  templateUrl: './date-review.component.html',
  styleUrls: ['./date-review.component.css']
})
export class DateReviewComponent {
  @Input() isOpen: Boolean = false;

  togglePopUp(){
    this.isOpen = !this.isOpen;
    console.log(this.isOpen)
  }
}
