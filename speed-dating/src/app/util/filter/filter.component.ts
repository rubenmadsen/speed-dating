import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {EventModel} from "../../models/eventModel"

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  selectedCity: string | null;

  @Input() events: any = []
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
