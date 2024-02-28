import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, firstValueFrom, filter, OperatorFunction, ReplaySubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {BackendService} from "./backend.service";
import {UserModel} from "../models/userModel";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly PORT = 3000;
  private readonly backendURL: string = "http://localHost:" + this.PORT + "/";  // local
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isOrganizerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private userSubject: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel | null>(null);

  constructor(private http: HttpClient, private backendService: BackendService) {
    this.checkSession();
  }

  checkSession(): void {
    this.http.get<any>( this.backendURL +'api/validate-token', { withCredentials: true }).subscribe({
      next: (response) => {
        console.log("hej")
        this.userSubject.next(response.user);
        this.isLoggedInSubject.next(response.valid)
        this.isOrganizerSubject.next(response.isOrganizer)
      },
      error: () => {
        this.isLoggedInSubject.next(false)
      }
    });
  }
  getUser(): Observable<UserModel> {
    return this.userSubject.asObservable().pipe(
      filter(user => user !== null) as OperatorFunction<UserModel | null, UserModel>
    );
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
