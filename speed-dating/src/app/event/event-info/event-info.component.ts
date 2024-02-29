import { Component, Input } from '@angular/core';
import { EventModel } from '../../models/eventModel';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.css'],
})
export class EventInfoComponent {
  @Input() event!: EventModel | null;

  @Input() isOrganizer!: boolean;
}
