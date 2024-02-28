import {Component, Input, OnInit} from '@angular/core';
import {DateModel} from "../../models/dateModel";

@Component({
  selector: 'app-participant-answer',
  templateUrl: './participant-answer.component.html',
  styleUrls: ['./participant-answer.component.css']
})
export class ParticipantAnswerComponent implements OnInit{
  @Input() date!: DateModel

  constructor() {

  }
  ngOnInit(){
    console.log("TSET")
  }
}
