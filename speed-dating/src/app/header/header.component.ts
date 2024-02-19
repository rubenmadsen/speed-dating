import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import {StatusMessageType} from "../interfaces/StatusMessageType";
import {AuthService} from "../services/auth.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  protected showLoginPopup: Boolean = false;
  protected showSignUpPopup: Boolean = false;
  isLoggedIn$: Observable<boolean> | undefined;

  constructor(private eRef: ElementRef, private renderer: Renderer2, private authService: AuthService, private router: Router) {}

  logout(){
    this.authService.logout();
  }

  closeBackground(){
    this.showLoginPopup = false;
    this.showSignUpPopup = false;
  }

  home(){
    setTimeout(() => this.router.navigate(['overview']),500);
  }
  profile(){
    setTimeout(() => this.router.navigate(['profile']),500);

  }

  async ngOnInit(){
    this.isLoggedIn$ = await this.authService.isLoggedIn;
  }

  protected toggleLoginPopup() {
    this.showLoginPopup = !this.showLoginPopup;
  }

  protected toggleSignUpPopup(){
    this.showSignUpPopup = !this.showSignUpPopup;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target) && (this.showLoginPopup || this.showSignUpPopup)) {
      this.showLoginPopup = false;
      this.showSignUpPopup = false;
    }
  }
}
