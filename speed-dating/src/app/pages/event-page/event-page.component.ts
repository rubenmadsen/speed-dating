import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {faGripVertical} from "@fortawesome/free-solid-svg-icons/faGripVertical";
import {Subscription} from "rxjs";
import {EventService} from "../../services/event.service";
import {EventModel} from "../../models/eventModel";

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit, OnDestroy {

  protected readonly faGripVertical = faGripVertical;
  event: EventModel | null = null;
  subscription!: Subscription;

  constructor(private eventService: EventService) { }

  /**
   * Load an event
   */
  ngOnInit() {
    this.subscription = this.eventService.currentEvent.subscribe(event => {
      this.event = event;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
