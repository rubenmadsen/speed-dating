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

  protected isLoadingRecommendedEvents: Boolean = true;

  pingpong:PingPong<EventModel> = {amount:10,itemType:'EventModel',items:[], retrieved:0};
  constructor(private backend: BackendService,private eRef: ElementRef) {
    this.yourEvents = [];
    this.recommendedEvents = [];
    this.completedEvents = [];
  }

  async ngOnInit(){
    this.backend.getMe().subscribe(me => {
      console.log("R",me)
      this.contacts = me.user.sharedContacts;;
      this.isOrganizer = me.user.isOrganizer;
      this.me = me.user;
    });

    this.getMoreEvents()
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
        } else {
          this.yourEvents.push(event)
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
