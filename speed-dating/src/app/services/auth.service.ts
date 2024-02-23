import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, firstValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {BackendService} from "./backend.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly PORT = 3000;
  private readonly backendURL: string = "http://localHost:" + this.PORT + "/";  // local
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private isOrganizerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private backendService: BackendService) {
    this.checkSession();
  }

  checkSession(): void {
    this.http.get<any>( this.backendURL +'api/validate-token', { withCredentials: true }).subscribe({
      next: (response) => {
        this.isLoggedInSubject.next(response.valid)
        this.isOrganizerSubject.next(response.isOrganizer)
      },
      error: () => this.isLoggedInSubject.next(false)
    });
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
  get isOrganizer(): Observable<boolean>{
    return this.isOrganizerSubject.asObservable();
  }

  loginSuccess(){
    this.isLoggedInSubject.next(true);
  }

  logout() {
    this.backendService.logout().subscribe({
      next: (response) => {
        this.isOrganizerSubject.next(false);
        this.isLoggedInSubject.next(false);
      },
      error: (error) => {
        console.log(error);
      }
    });

  }

  loggedIn(): Promise<boolean> {
    return firstValueFrom(this.http.get<any>(this.backendURL + 'api/validate-token', { withCredentials: true })).then(response => {
      return response.valid;
    }).catch(error => {
      return false;
    });
  }


}
