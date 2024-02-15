import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {EventModel} from "../../models/eventModel"

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  events: EventModel[]
  selectedCity: string | null;
  @Output() citySelected: EventEmitter<string | null> = new EventEmitter<string | null>();

  constructor(private backend: BackendService) {
    this.events = [];
    this.selectedCity = null;
  }

  async ngOnInit() {
    await this.backend.getAllEvents().then(events => this.events = events
      .filter((thing, i, arr) => arr.findIndex(t => t.city === thing.city) === i)
      .sort((a,b) => a.city > b.city ? 1 : -1))
  }

  onCityChange(): void {
    this.citySelected.emit(this.selectedCity);
  }

  protected resetFilter() {
    this.selectedCity = null;
    this.onCityChange();
  }

}
