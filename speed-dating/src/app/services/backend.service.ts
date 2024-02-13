import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly PORT = 3000;
  private readonly backendURL: string = "http://localHost:" + this.PORT + "/";  // local
  //private readonly backendURL: string = "http://pro_url:" + this.PORT + "/";  // remote

  private readonly userURL: string = this.backendURL + "user/";

  headerDict = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': 'Content-Type'
  }
  requestOptions = {
    //headers: new HttpHeaders(this.headerDict),
    withCredentials:true
  };
  constructor(private http:HttpClient) {

  }

  // User
  login(email:string, password:string):Observable<any>{
    return this.http.post<any>(this.userURL + "login", {email, password},this.requestOptions);
  }
  logout():Observable<any>{
    return this.http.post<any>(this.userURL + "logout", this.requestOptions);
  }

  /**
   * Checks if the chosen email address is available
   * @param email The god-damn email address
   */
  checkAvailability(email:string):Observable<any>{
    return this.http.post<any>(this.userURL +  "available",{},this.requestOptions);
  }

  // Event


  // Date


  // DateFeedback


  // EventFeedback




  //Ex
  // register(username:string, password:string):Observable<any>{
  //   return this.http.post<any>(this.signupURL,{"username":username,"password":password},this.requestOptions)
  // }

}
