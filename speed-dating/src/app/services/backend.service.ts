import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly PORT = 4000;
  private readonly backendURL: string = "http://localHost:" + this.PORT + "/" // local
  //private readonly backendURL: string = "http://pro_url:" + this.PORT + "/" // remote

  private readonly loginURL: string = this.backendURL + "login/";

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


  //Ex
  // register(username:string, password:string):Observable<any>{
  //   return this.http.post<any>(this.signupURL,{"username":username,"password":password},this.requestOptions)
  // }

}
