import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css'],

})
export class ToggleComponent {
  @Output() toggleShareContacts = new EventEmitter

  toggleShareContact():void{
    this.toggleShareContacts.emit()
  }
}
