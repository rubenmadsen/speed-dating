import {Component, Input, OnInit} from '@angular/core';
import {DateModel} from "../../models/dateModel";
import {DateFeedbackModel} from "../../models/dateFeedbackModel";
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-participant-answer',
  templateUrl: './participant-answer.component.html',
  styleUrls: ['./participant-answer.component.css']
})
export class ParticipantAnswerComponent implements OnInit{
  @Input() date!: DateModel;
  feedbackOne!: DateFeedbackModel;
  feedbackTwo!: DateFeedbackModel;

  constructor(private backendService : BackendService) {

  }
  ngOnInit(){
    this.feedbackOne = this.date.feedbackOne!;
    this.feedbackTwo = this.date.feedbackTwo!;
  }
}
