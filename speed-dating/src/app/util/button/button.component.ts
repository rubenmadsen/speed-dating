import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  // send class parameters: primary, secondary, alternative

  @Input() buttonText: string = "";
  @Input() buttonClass: string = '';

  @Output() appClick = new EventEmitter<void>();

  onClick() {
    this.appClick.emit();
  }
}
