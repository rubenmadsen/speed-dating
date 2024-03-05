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
  feedbackOne: number[] = [];
  feedbackTwo: number[] = [];

  constructor(private backendService : BackendService) {

  }
  ngOnInit(){
    this.getFeedbackTwoQuestions()
    this.getFeedbackOneQuestions()
  }
  getFeedbackOneQuestions(){
    if (this.date.feedbackOne?._id != null) {
      this.backendService.getDateFeedback(this.date.feedbackOne?._id).subscribe(dfb => {
        if (dfb !==null){
          this.feedbackOne = dfb.question;
        }
        else {
          this.feedbackTwo = [];
        }
      });
    }
  }
  getFeedbackTwoQuestions(){
    if (this.date.feedbackTwo?._id != null) {
      this.backendService.getDateFeedback(this.date.feedbackTwo?._id).subscribe(dfb => {
        if (dfb !==null){
          this.feedbackTwo = dfb.question;
        }
        else {
          this.feedbackTwo = [];
        }
      });
    }
  }

}
