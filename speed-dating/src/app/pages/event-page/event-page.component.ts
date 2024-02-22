import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {faGripVertical} from "@fortawesome/free-solid-svg-icons/faGripVertical";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {EventService} from "../../services/event.service";
import {EventModel} from "../../models/eventModel";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserModel} from "../../models/userModel";
import {BackendService} from "../../services/backend.service";
import {DateModel} from "../../models/dateModel";


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
  dates!: DateModel[];

  isOrganizer$: Observable<boolean> | undefined;

  constructor(private eventService: EventService, private authService: AuthService, private backend: BackendService) { }

  /**
   * Load an event
   */
   async ngOnInit() {
    this.subscription = this.eventService.currentEvent.subscribe(event => {
      this.event = event;
    });
    this.isOrganizer$ = this.authService.isOrganizer;
    this.participants = this.event?.participants;
    console.log(this.participants)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  automaticMatching(){
     this.backend.getNextRoundOfDatesForEvent(this.event!).subscribe({
       next: (response) => {
         this.dates = response;
       },
       error: (error) => {
         console.log(error);
       }
     })
  }
}
