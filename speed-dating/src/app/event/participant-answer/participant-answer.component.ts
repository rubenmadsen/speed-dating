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
  dateFeedback : DateFeedbackModel | undefined;
  constructor(private backendService : BackendService) {

  }
  ngOnInit(){
    console.log("DATE", this.date)
/*    if (this.date.feedback !== undefined){
      /!*this.backendService.getDateFeedback(this.date).subscribe(dfb=>{

      });*!/
    }*/

  }
}
