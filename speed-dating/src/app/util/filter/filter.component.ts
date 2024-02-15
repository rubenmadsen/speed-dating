import { Component } from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {EventModel} from "../../models/eventModel"

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  events: EventModel[]

  constructor(private backend: BackendService) {
    this.events = [];
  }

  async ngOnInit() {
    await this.backend.getAllEvents().then(events => this.events = events.sort((a,b) => a.startDate > b.startDate ? 1 : -1))
  }
}
