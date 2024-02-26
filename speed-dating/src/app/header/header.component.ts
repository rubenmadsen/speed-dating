import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { StatusMessageType } from '../interfaces/StatusMessageType';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  protected showLoginPopup: Boolean = false;
  protected showSignUpPopup: Boolean = false;
  isLoggedIn$: Observable<boolean> | undefined;

  constructor(
    private eRef: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router,
    private globalService: GlobalService
  ) {}

  logout(event:any) {
    event.stopPropagation();
    this.authService.logout();
    const message = {
      message: "You successfully logged out!",
      type: StatusMessageType.SUCCESS
    }
    this.globalService.setGlobalStatus(message)
    this.router.navigate([''])
  }

  closeBackground() {
    this.showLoginPopup = false;
    this.showSignUpPopup = false;
  }

  /**
   * Redirect the user to the "home/overview" page
   */
  home(event:any) {
    event.stopPropagation();
    setTimeout(() => this.router.navigate(['overview']), 500);
  }

  /**
   * Redirect the user to the profile page
   */
  profile(event:any) {
    event.stopPropagation();
    setTimeout(() => this.router.navigate(['profile']), 500);
  }

  async ngOnInit() {
    this.isLoggedIn$ = await this.authService.isLoggedIn;
  }

  protected toggleLoginPopup(event:any) {
    event.stopPropagation();
    this.showLoginPopup = !this.showLoginPopup;
    this.showSignUpPopup = false;
  }

  protected toggleSignUpPopup(event:any) {
    event.stopPropagation();
    this.showSignUpPopup = !this.showSignUpPopup;
    this.showLoginPopup = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (
      !this.eRef.nativeElement.contains(event.target) &&
      (this.showLoginPopup || this.showSignUpPopup)
    ) {
      this.showLoginPopup = false;
      this.showSignUpPopup = false;
    }
  }

}
