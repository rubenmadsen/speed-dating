import { Component } from '@angular/core';
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

  constructor(private backend: BackendService) {
    this.yourEvents = [];
    this.recommendedEvents = [];
    this.completedEvents = [];
  }

  async ngOnInit(){
    await this.backend.getAllEvents().then(r => {
      this.yourEvents =  r})
    await this.backend.getAllEvents().then(r => {this.recommendedEvents = r})
    await this.backend.getAllEvents().then(r => {this. completedEvents = r})
    await this.backend.getMe().forEach(r => {this.contacts = r.sharedContacts});
  }
}
