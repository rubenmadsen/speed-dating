import {Component, ElementRef, HostListener} from '@angular/core';
import {EventModel} from "../../models/eventModel";
import {UserModel} from "../../models/userModel";
import {BackendService} from "../../services/backend.service";
import {PingPong} from "../../interfaces/PingPong";


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
    this.backend.getMe().subscribe(me => {
      this.contacts = me.sharedContacts;
      this.isOrganizer = me.isOrganizer;
      this.me = me;
      this.getMoreEvents()
      this.isLoadingContacts = false;
    });


  }

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
          this.isLoadingYourEvents = false;
        } else {
          this.yourEvents.push(event)
          this.isLoadingCompletedEvents = false;
        }
      })

      const cityFilter = pp.items.filter(event => event.city._id === this.me.city._id && !(this.yourEvents.includes(event)));

      cityFilter.forEach(event => {
        console.log(event)
        this.recommendedEvents.push(event)

        this.isLoadingRecommendedEvents = false;
      });

      if(pp.items.length !== 0){
        this.getMoreEvents()
      }

      this.isLoadingYourEvents = false;
      this.isLoadingContacts = false;
      this.isLoadingRecommendedEvents = false;
      this.isLoadingCompletedEvents = false;
    })
  }


  addEvent(event:EventModel){
    this.yourEvents.push(event);
    console.log("sd")
    console.log("Added event ", event)
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
