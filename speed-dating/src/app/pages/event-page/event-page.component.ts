import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {faGripVertical} from "@fortawesome/free-solid-svg-icons/faGripVertical";
import {Observable, Subscription} from "rxjs";
import {EventService} from "../../services/event.service";
import {EventModel} from "../../models/eventModel";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit, OnDestroy {

  protected readonly faGripVertical = faGripVertical;
  event: EventModel | null = null;
  subscription!: Subscription;

  private sub: any

  isOrganizer$: Observable<boolean> | undefined;

  constructor(private eventService: EventService, private authService: AuthService) { }

  /**
   * Load an event
   */
   async ngOnInit() {
    this.subscription = this.eventService.currentEvent.subscribe(event => {
      this.event = event;
    });
    // await this.authService.checkSession();
    this.isOrganizer$ = this.authService.isOrganizer;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
