import { Component, EventEmitter, Output } from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {EventModel} from "../../models/eventModel"

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  events: EventModel[]
  selectedCity: string;
  @Output() citySelected: EventEmitter<string> = new EventEmitter<string>();

  constructor(private backend: BackendService) {
    this.events = [];
    this.selectedCity = "";
  }

  async ngOnInit() {
    await this.backend.getAllEvents().then(events => this.events = events
      .filter((thing, i, arr) => arr.findIndex(t => t.city === thing.city) === i)
      .sort((a,b) => a.startDate > b.startDate ? 1 : -1))
  }

  onCityChange(): void {
    this.citySelected.emit(this.selectedCity);
  }

}
