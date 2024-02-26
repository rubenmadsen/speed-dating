import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-hamburger',
  templateUrl: './hamburger.component.html',
  styleUrls: ['./hamburger.component.css']
})

export class HamburgerComponent {
  @ViewChild('hamRef') hamRef!:ElementRef;
  @Output()isDiplayedChange = new EventEmitter<boolean>();
  faBars = faBars;
  isOpen:boolean = false;

  toggleMenu(){
    this.isOpen = !this.isOpen;
  }
  isDisplayed():boolean{
    return this.hamRef.nativeElement.style.display === "none";
  }
}
