import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EventModel} from "../../models/eventModel"
import {distinct} from "rxjs";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  private _events: EventModel[] = [];
  selectedCity: string | null;

  @Input() set events(value: EventModel[]) {
    this._events = value;
  }
  get events(): EventModel[] {
    return this.getUnique(this._events).sort((a, b) => a.city.name.localeCompare(String(b.city.name)));
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

  protected getUnique(events: EventModel[]) {
    let unique = [...new Set(events.map(event => event.city.name))]
    let eventCollection = []
    for (let event of events) {
      if (unique.includes(event.city.name)) {
        eventCollection.push(event)
        delete unique[unique.indexOf(event.city.name)]
      }
    }
    return eventCollection
  }

}
