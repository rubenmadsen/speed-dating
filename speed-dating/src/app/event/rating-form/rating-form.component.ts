import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating-form',
  templateUrl: './rating-form.component.html',
  styleUrls: ['./rating-form.component.css']
})
export class RatingFormComponent {
  question1: number = 0;
  question2: number = 0;
  question3: number = 0;
  question4: number = 0;
  question5: number = 0;
  checked: boolean = true;

  /**
   * Ghetto fixes.
   */
  changeValueQ1(value: number) {
    this.question1 = value;
  }

  changeValueQ2(value: number) {
    this.question2 = value;
  }

  changeValueQ3(value: number) {
    this.question3 = value;
  }

  changeValueQ4(value: number) {
    this.question4 = value;
  }

  changeValueQ5(value: number) {
    this.question5 = value;
  }

  toggle(event: boolean) {
    this.checked = event;
    console.log(this.checked);
    
  }

}
