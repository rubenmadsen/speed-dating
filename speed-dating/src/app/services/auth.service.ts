import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {BackendService} from "./backend.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly PORT = 3000;
  private readonly backendURL: string = "http://localHost:" + this.PORT + "/";  // local
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private backendService: BackendService) {
    this.checkSession();
  }

  checkSession(): void {
    this.http.get<{valid: boolean}>( this.backendURL +'api/validate-token', { withCredentials: true }).subscribe({
      next: (response) => this.isLoggedInSubject.next(response.valid),
      error: () => this.isLoggedInSubject.next(false)
    });
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  loginSuccess(){
    this.isLoggedInSubject.next(true);
  }

  logout() {
    this.backendService.logout().subscribe({
      next: (response) => {
        this.isLoggedInSubject.next(false);
      },
      error: (error) => {
        console.log(error);
      }
    });

  }

}
