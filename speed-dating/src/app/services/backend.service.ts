import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {firstValueFrom, Observable} from "rxjs";
import {UserModel} from "../models/userModel";
import {EventModel} from "../models/eventModel";


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly PORT = 3000;
  private readonly backendURL: string = "http://localHost:" + this.PORT + "/";  // local
  //private readonly backendURL: string = "http://pro_url:" + this.PORT + "/";  // remote

  private readonly userURL: string = this.backendURL + "user/";
  private readonly eventURL: string = this.backendURL + "event/";

  headerDict = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': 'Content-Type'
  }
  requestOptions = {
    headers: new HttpHeaders(this.headerDict),
    withCredentials:true
  };
  constructor(private http:HttpClient) {

  }

  /**
   * 200 for ok
   * 400 for everything else
   * @param email An email address
   * @param password A password
   */
  login(email:string, password:string):Observable<any>{
    return this.http.post<any>(this.userURL + "login", {email, password},this.requestOptions);
  }
  logout():Observable<any>{
    return this.http.post<any>(this.userURL + "logout", this.requestOptions);
  }

  /**
   * 200 available
   * 409 not available
   * Checks if the chosen email address is available
   * @param email The god-damn email address
   */
  checkAvailability(email:string):Observable<any>{
    return this.http.get<any>(this.userURL +  `/${email}`,this.requestOptions);
  }

  /**
   * 201 ok
   * 500 registration error
   * Register new user
   * @param user
   */
  registerUser(user:UserModel):Observable<UserModel>{
    return this.http.post<UserModel>(this.userURL ,user);
  }

  getUserSharedContacts(user:UserModel):Observable<UserModel[]>{
    return this.http.get<UserModel[]>(this.userURL + `/${user.id}/contacts`,this.requestOptions);
  }

  getUserPreferences(user:UserModel):Observable<any>{
    return this.http.get<any>(this.userURL + `/${user.id}/preferences`,this.requestOptions);
  }

  getUserInterests(user:UserModel):Observable<any>{
    return this.http.get<any>(this.userURL + `/${user.id}/interests`,this.requestOptions);
  }

  getUserMatchingData(user:UserModel):Observable<any>{
    return this.http.get<any>(this.userURL + `/${user.id}/matchdata`,this.requestOptions);
  }


  // Event
  getAllEvents(): Promise<EventModel[]>{
    const endPoint = this.backendURL + 'event';
    const responseObservable = this.http.get<EventModel[]>(endPoint);
    return firstValueFrom(responseObservable);
  }

  // Date


  // DateFeedback


  // EventFeedback




  //Ex
  // register(username:string, password:string):Observable<any>{
  //   return this.http.post<any>(this.signupURL,{"username":username,"password":password},this.requestOptions)
  // }

}
