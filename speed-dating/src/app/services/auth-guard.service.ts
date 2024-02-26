import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { StatusMessageType } from '../interfaces/StatusMessageType';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  
  constructor(private  auth: AuthService, private router: Router, private globalService: GlobalService) { }

  async canActivate(): Promise<boolean> {
    if (!await this.auth.loggedIn()) {
      const message = {
        message: "You are not logged in",
        type: StatusMessageType.ALERT
      }
      this.globalService.setGlobalStatus(message)
      this.router.navigate([''])
      return false;
    }

    return true;
  }
}
