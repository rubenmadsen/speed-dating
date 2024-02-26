import {Component, Input} from '@angular/core';
import {DateModel} from "../../models/dateModel";

@Component({
  selector: 'app-participant-answer',
  templateUrl: './participant-answer.component.html',
  styleUrls: ['./participant-answer.component.css']
})
export class ParticipantAnswerComponent {
  @Input() date!: DateModel

  constructor() {

  }
}
