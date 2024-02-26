import {Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';
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
  isDisplayed:boolean = false;

  constructor(private eRef:ElementRef) {
    this.checkWindowSize();
  }

  ngOnInit() {
    this.checkWindowSize();
  }

  toggleMenu(){
    this.isOpen = !this.isOpen;
  }
  @HostListener('document:click', ['$event'])
  clickout(event:any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.checkWindowSize();
  }

  checkWindowSize() {
    this.isDisplayed = window.innerWidth < 680;
  }
}
