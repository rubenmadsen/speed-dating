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

  showNewEventPopup: Boolean = false;

  constructor(private backend: BackendService,private eRef: ElementRef) {
    this.yourEvents = [];

    this.recommendedEvents = [];
    this.completedEvents = [];
  }

  async ngOnInit(){
    await this.backend.getAllEvents().then(r => {
      this.yourEvents =  r})
    await this.backend.getAllEvents().then(r => {this.recommendedEvents = r})
    await this.backend.getAllEvents().then(r => {this. completedEvents = r})
    await this.backend.getMe().forEach(r => {
      this.contacts = r.sharedContacts;
      this.yourEvents = r.events;
    });
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
