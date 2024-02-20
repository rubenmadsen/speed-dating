import {Component, Input, OnInit} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {EventModel} from "../../models/eventModel"
import {CityModel} from "../../models/cityModel";

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.css']
})
export class CardContainerComponent implements OnInit{

  public filteredEvents: EventModel[] = [];

  @Input() events: EventModel[] = [];
  @Input() eventCardClass: string = "";

  async ngOnInit(){
    this.filteredEvents = this.events;
  }

  protected filterEvents(selectedCity: string | null) {
    if (selectedCity !== null) {
      this.filteredEvents = this.events.filter(event => event.city.name === selectedCity)
    } else {
      this.filteredEvents = this.events
    }
  }

}
