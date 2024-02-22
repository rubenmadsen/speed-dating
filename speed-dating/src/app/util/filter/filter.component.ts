import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EventModel} from "../../models/eventModel"

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  private _events: EventModel[] = [];
  selectedCity: string | null;

  @Input() set events(value: EventModel[]) {
    const uniqueCities = new Set();
    this._events = value
      .filter(event => {
        const isDuplicate = uniqueCities.has(event.city.name);
        uniqueCities.add(event.city.name);
        return !isDuplicate;
      })
      .sort((a, b) => a.city.name.localeCompare(String(b.city.name)));
  }
  get events(): EventModel[] {
    return this._events;
  }
  @Output() citySelected: EventEmitter<string | null> = new EventEmitter<string | null>();

  constructor() {
    this.selectedCity = null;
  }

  onCityChange(): void {
    this.citySelected.emit(this.selectedCity);
  }

  protected resetFilter(): void {
    this.selectedCity = null;
    this.onCityChange();
  }

}
