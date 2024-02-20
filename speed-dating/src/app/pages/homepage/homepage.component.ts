import { Component } from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {EventModel} from "../../models/eventModel";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  events:EventModel[] = [];
  done: Boolean = false;

  constructor(private backend: BackendService) {}

  async ngOnInit(){
    await this.backend.getAllEvents().then(events => {
      this.events = events.sort((a,b) => a.startDate > b.startDate ? 1 : -1);
      this.done = true;
    });
  }
}
