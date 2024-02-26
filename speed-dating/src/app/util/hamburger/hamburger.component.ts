import {Component, Input} from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-hamburger',
  templateUrl: './hamburger.component.html',
  styleUrls: ['./hamburger.component.css']
})

export class HamburgerComponent {
  faBars = faBars;
  isOpen:boolean = false;

  toggleMenu(){
    this.isOpen = !this.isOpen;
  }
}
