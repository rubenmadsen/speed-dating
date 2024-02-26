import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  
  constructor(private  auth: AuthService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    if (!await this.auth.loggedIn()) {
      this.router.navigate([''])
      return false;
    }

    return true;
  }
}
