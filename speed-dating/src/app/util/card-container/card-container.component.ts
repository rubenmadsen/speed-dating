import { Component, OnInit } from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {EventModel} from "../../models/eventModel"

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.css']
})
export class CardContainerComponent implements OnInit{
  events: EventModel[]
  public filteredEvents: EventModel[] = [];


  async ngOnInit(){
    await this.backend.getAllEvents().then(events => this.events = events.sort((a,b) => a.startDate > b.startDate ? 1 : -1))
    await this.loadEvents()
  }

  constructor(private backend: BackendService) {
    this.events = [];
  }

  async loadEvents() {
    // Logic to load events, then store them in `filteredEvents`
    await this.backend.getAllEvents().then(events => {
      this.filteredEvents = events.sort((a,b) => a.startDate > b.startDate ? 1 : -1);
    });
  }

  protected filterEvents(selectedCity: string) {
    this.filteredEvents = this.events.filter(event => event.city === selectedCity)
  }

}
