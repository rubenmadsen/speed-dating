import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {faGripVertical} from "@fortawesome/free-solid-svg-icons/faGripVertical";
import {Observable, Subscription} from "rxjs";
import {EventService} from "../../services/event.service";
import {EventModel} from "../../models/eventModel";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserModel} from "../../models/userModel";

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit, OnDestroy {

  protected readonly faGripVertical = faGripVertical;
  event: EventModel | null = null;

  subscription!: Subscription;
  participants?: UserModel[];

  cancelEventButtonClass: string = 'trans clr-accent border-accent';
  clearTablesButtonClass: string = 'trans clr-accent border-accent disabled';
  automaticMatchingButtonClass: string = 'accent border-accent clr-white disabled';
  startDateButtonClass: string = 'accent border-accent clr-white disabled';

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

    const baseClass = 'trans clr-accent border-accent';
    const disabledClass = ' disabled';
    const accentClass = 'accent border-accent clr-white';

    // await this.authService.checkSession();
    this.isOrganizer$ = this.authService.isOrganizer;
    this.participants = this.event?.participants;


    if(this.participants && this.participants.length == 20) {
      this.clearTablesButtonClass = baseClass;
      this.automaticMatchingButtonClass = accentClass;
      this.startDateButtonClass = accentClass;
    } else {
      this.clearTablesButtonClass = baseClass + disabledClass;
      this.automaticMatchingButtonClass = accentClass + disabledClass;
      this.startDateButtonClass = accentClass + disabledClass;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
