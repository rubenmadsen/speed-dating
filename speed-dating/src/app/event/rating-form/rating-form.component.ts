import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

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
  answersBy: string = "";
  answersFor: string = "";

  constructor(private backend: BackendService) { }

  ngOnInit() {
    this.backend.getMe().subscribe(me => {
      this.answersBy = me.user.firstname + " " + me.user.lastname;
    })    
  }

  /**
   * Change question 1 value.
   */
  changeValueQ1(value: number) {
    this.question1 = value;
  }

  /**
   * Change question 2 value.
   */
  changeValueQ2(value: number) {
    this.question2 = value;
  }

  /**
   * Change question 3 value.
   */
  changeValueQ3(value: number) {
    this.question3 = value;
  }

  /**
   * Change question 4 value.
   */
  changeValueQ4(value: number) {
    this.question4 = value;
  }

  /**
   * Change question 5 value.
   */
  changeValueQ5(value: number) {
    this.question5 = value;
  }

  /**
   * Toggle button is pressed.
   * @param event value from toggle button component.
   */
  toggle(event: boolean) {
    this.checked = event;
  }

  /**
   * Continue button is pressed.
   */
  continue() { //TODO: Do something with this.
    const answers = {
      'q1': this.question1,
      'q2': this.question2,
      'q3': this.question3,
      'q4': this.question4,
      'q5': this.question5,
      'shareContact': this.checked,
      'answersBy': this.answersBy,
      'answersFor': this.answersFor
    }

    console.log(answers);
  }

}
