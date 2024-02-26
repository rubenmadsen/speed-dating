import {Component, ElementRef, HostListener} from '@angular/core';
import {EventModel} from "../../models/eventModel";
import {UserModel} from "../../models/userModel";
import {BackendService} from "../../services/backend.service";



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
  showNewEventPopup: Boolean = false;

  constructor(private backend: BackendService,private eRef: ElementRef) {
    this.yourEvents = [];

    this.recommendedEvents = [];
    this.completedEvents = [];
  }

  async ngOnInit(){
    this.backend.getMe().subscribe(r => {
      console.log("R",r)
      this.contacts = r.user.sharedContacts;
      this.yourEvents = r.user.events;
      this.isOrganizer = r.user.isOrganizer;
      this.yourEvents = r.user.events;
      this.backend.getEventsByLocation(r.user).subscribe(r => {
        this.recommendedEvents = r;
      })
    });
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
