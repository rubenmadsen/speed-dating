import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {EventModel} from "../../models/eventModel";
import {UserModel} from "../../models/userModel";
import {BackendService} from "../../services/backend.service";
import {PingPong} from "../../interfaces/PingPong";
import {firstValueFrom} from "rxjs";


@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent {

  protected yourEvents: EventModel[];
  protected recommendedEvents: EventModel[];
  protected completedEvents: EventModel[];
  protected contacts: UserModel[] = []
  protected isOrganizer: Boolean = false;
  protected me!: UserModel;
  showNewEventPopup: Boolean = false;

  protected isLoadingContacts: Boolean = true;
  protected isLoadingYourEvents: Boolean = true;
  protected isLoadingRecommendedEvents: Boolean = true;
  protected isLoadingCompletedEvents: Boolean = true;

  pingpong:PingPong<EventModel> = {amount:10,itemType:'EventModel',items:[], retrieved:0};
  constructor(private backend: BackendService,private eRef: ElementRef) {
    this.yourEvents = [];
    this.recommendedEvents = [];
    this.completedEvents = [];
  }

  async ngOnInit(){
    const me = await firstValueFrom(this.backend.getMe());
    this.contacts = me.sharedContacts;
    this.isOrganizer = me.isOrganizer;
    this.me = me;
    this.isLoadingContacts = false;
    // this.loadMyEvents();
    // this.loadCompleted();
    // await this.loadCityEvents();
    this.getMoreEvents()
  }

  // loadMyEvents(){
  //   this.me.events.forEach(event => {
  //     if (!event.hasEnded) {
  //       this.yourEvents.push(event);
  //     }
  //   });
  //   this.isLoadingCompletedEvents = false;
  // }
  // loadCompleted(){
  //    this.me.events.forEach(event => {
  //      if (event.hasEnded) {
  //        this.completedEvents.push(event);
  //      }
  //    });
  //    this.isLoadingYourEvents = false;
  // }
  //
  // async loadCityEvents(){
  //   this.backend.getEventsByLocation(this.me).subscribe( {
  //     next: (response) => {
  //       response.forEach(event => {
  //         this.recommendedEvents.push(event)
  //       });
  //     },
  //     error: (err => {
  //       console.log(err)
  //     })
  //   })
  //   this.isLoadingRecommendedEvents = false;
  // }

  getMoreEvents(){
    this.backend.getAlleventsStream(this.pingpong).subscribe(pp => {

      this.pingpong = pp

      const yourEventsFilter = pp.items.filter(event =>
        event.participants.some(participant => participant._id === this.me._id)
      );
      yourEventsFilter.forEach(event => {
        // console.log(this.yourEvents);
        if(event.hasEnded){
          this.completedEvents.push(event)
          this.isLoadingCompletedEvents = false;
        } else {
          this.yourEvents.push(event)
          this.isLoadingYourEvents = false;
        }
      })

      const cityFilter = pp.items.filter(event => event.city._id === this.me.city._id && !(this.yourEvents.includes(event)));

      cityFilter.forEach(event => {
        console.log(event)
        this.recommendedEvents.push(event)
      });

      if(pp.items.length !== 0){
        this.getMoreEvents()
      }
      this.isLoadingContacts = false;
      this.isLoadingRecommendedEvents = false;
      this.isLoadingYourEvents = false;
      this.isLoadingCompletedEvents = false;
    })
  }

  addEvent(event:EventModel){
    this.yourEvents.push(event);
  }

  openEventPopup(){
    this.showNewEventPopup = !this.showNewEventPopup
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target) && (this.showNewEventPopup)) {
      this.showNewEventPopup = false;
    }
  }
}
