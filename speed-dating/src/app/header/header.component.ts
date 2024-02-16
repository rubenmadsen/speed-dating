import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import {StatusMessageType} from "../interfaces/StatusMessageType";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  protected showLoginPopup: Boolean = false;

  constructor(private eRef: ElementRef, private renderer: Renderer2) {}
  protected toggleLoginPopup() {
    this.showLoginPopup = !this.showLoginPopup;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target) && this.showLoginPopup) {
      this.showLoginPopup = false;
    }
  }
}
