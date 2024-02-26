import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css'],

})
export class ToggleComponent {
  @Output() toggleShareContacts = new EventEmitter
  private checked: boolean = true;

  toggleShareContact():void{
    this.checked = !this.checked;
    this.toggleShareContacts.emit(this.checked)
  }
}
