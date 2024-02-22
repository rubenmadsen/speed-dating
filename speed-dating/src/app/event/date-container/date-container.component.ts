import {Component, Input} from '@angular/core';
import {ParticipantListComponent} from "../participant-list/participant-list.component";

@Component({
  selector: 'app-date-container',
  templateUrl: './date-container.component.html',
  styleUrls: ['./date-container.component.css']
})
export class DateContainerComponent {


  @Input() participantList!: ParticipantListComponent;
}
