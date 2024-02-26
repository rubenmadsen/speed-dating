import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, firstValueFrom, map, Observable, of, tap} from "rxjs";
import {UserModel} from "../models/userModel";
import {EventModel} from "../models/eventModel";
import {CityModel} from "../models/cityModel";
import {CategoryModel} from "../models/categoryModel";
import {ActivityModel} from "../models/activityModel";
import {DateModel} from "../models/dateModel";
import {PingPong} from "../interfaces/PingPong";
import {FileResponse} from "../interfaces/FileResponse";

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly PORT = 3000;
  private readonly backendURL: string = "http://localHost:" + this.PORT + "/";  // local
  //private readonly backendURL: string = "http://pro_url:" + this.PORT + "/";  // remote

  private readonly userURL: string = this.backendURL + "user/";
  private readonly eventURL: string = this.backendURL + "event/";
  private readonly cityURL: string = this.backendURL + "city/";
  private readonly categoryURL: string = this.backendURL + "category/";
  private readonly activityURL: string = this.backendURL + "activity/";
  private readonly dateURL: string = this.backendURL + "date/";


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
  uploadImageOptions = {
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': 'Content-Type'
    },
    withCredentials: true
  }
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
    return this.http.post<any>(this.userURL + "logout", {} ,this.requestOptions);
  }

  /**
   * 200 available
   * 409 not available
   * Checks if the chosen email address is available
   * @param email The god-damn email address
   */
  checkAvailability(email:string):Observable<any>{
    return this.http.get<any>(this.backendURL +'validate/' +   `${email}`,this.requestOptions);
  }

  getMe():Observable<UserModel>{
    return this.http.get<UserModel>(this.userURL + "profile/me",this.requestOptions);
  }

  /**
   * 201 ok
   * 500 registration error
   * Register new user
   * @param user
   */
  registerUser(user:UserModel):Observable<UserModel>{
    return this.http.post<UserModel>(this.userURL ,user, this.requestOptions);
  }
  /**
   * NOT IMPLEMENTED
   */
  updateUser(user:UserModel):Observable<UserModel>{
    return this.http.put<UserModel>(this.userURL,user,this.requestOptions);
  }
  getUserSharedContacts(user:UserModel):Observable<UserModel[]>{
    return this.http.get<UserModel[]>(this.userURL + `/${user._id}/contacts`,this.requestOptions);
  }

  getUserPreferences(user:UserModel):Observable<any>{
    return this.http.get<any>(this.userURL + `/${user._id}/preferences`,this.requestOptions);
  }

  getUserInterests(user:UserModel):Observable<any>{
    return this.http.get<any>(this.userURL + `/${user._id}/interests`,this.requestOptions);
  }

  getUserMatchingData(user:UserModel):Observable<any>{
    return this.http.get<any>(this.userURL + `/${user._id}/matchdata`,this.requestOptions);
  }

  /**
   * Uploads a profile picture and return the new name
   * @param file A god-damn file
   */
  uploadProfilePicture(file:File):Observable<FileResponse>{
    const formData = new FormData();
    formData.append('file',file,file.name);
    return this.http.post<FileResponse>(this.backendURL + "upload/image",formData,this.uploadImageOptions);
  }


  // Event
  getAllEvents(): Promise<EventModel[]>{
    const endPoint = this.backendURL + 'event';
    const responseObservable = this.http.get<EventModel[]>(endPoint);
    return firstValueFrom(responseObservable);
  }
  getAlleventsStream(pingpong:PingPong<EventModel>):Observable<PingPong<EventModel>>{
    return this.http.post<PingPong<EventModel>>(this.eventURL + "stream", pingpong, this.requestOptions);
  }
  deleteEvent(event:EventModel):Observable<EventModel>{
    return this.http.delete<EventModel>(this.eventURL + event._id,this.requestOptions);
  }


  /**
   * Gets all events based on a City or a User's City
   * @param sender
   */
  getEventsByLocation(sender:CityModel | UserModel):Observable<EventModel[]>{
    const id = (sender as UserModel).city._id == undefined ? (sender as CityModel)._id : (sender as UserModel).city._id;
    return this.http.get<EventModel[]>(this.cityURL + id + '/events',this.requestOptions);
  }

  /**
   * Create a new event
   * @param event
   */
  createNewEvent(event:EventModel): Observable<EventModel>{
    return this.http.post<EventModel>(this.eventURL,event,this.requestOptions);
  }

  /**
   * Calculates the date and matches for a new generation of Dates
   * @param event
   */
  getNextRoundOfDatesForEvent(event:EventModel):Observable<DateModel[]>{
    return this.http.get<DateModel[]>(this.eventURL + event._id + "/next",this.requestOptions);
  }
  /**
   * Inserts the datesfor a new round of the event
   * @param event
   * @param dates
   */
  setNextRoundOfDatesForEvent(event:EventModel, dates:DateModel[]):Observable<DateModel[]>{
    return this.http.post<DateModel[]>(this.eventURL + event._id + "/setnext",dates,this.requestOptions);
  }
  /**
   * Join an event
   */
  joinEvent(event: EventModel):Observable<EventModel>{
    return this.http.get<EventModel>(this.eventURL + event._id + "/join",this.requestOptions);
  }
  /**
   * Leave an event
   */
  leaveEvent(event:EventModel):Observable<EventModel>{
    return this.http.get<EventModel>(this.eventURL + event._id + "/leave",this.requestOptions);
  }





  // Date
  /**
   * Get specific Date
   */
  getDate(date:DateModel):Observable<DateModel>{
    return this.http.get<DateModel>(this.dateURL + date._id);
  }

  /**
   * Swap tables
   */
  swapTables(t1:DateModel, t2:DateModel):Observable<DateModel[]>{
    return this.http.get<DateModel[]>(this.dateURL + "swaptables/" +t1._id + "/" + t2._id,this.requestOptions);
  }
  /**
   * Swap tables
   */
  swapSkanks(t1:DateModel, t2:DateModel):Observable<DateModel[]>{
    return this.http.get<DateModel[]>(this.dateURL + "swapskanks/" +t1._id + "/" + t2._id,this.requestOptions);
  }

  matchUsers(user1:UserModel, user2:UserModel):Observable<DateModel>{
    return this.http.get<DateModel>(this.dateURL + "match/" + user1._id + "/" + user2._id);
  }


  /**
   * Match user 1 with user two
   */
  matchUserWithUser(male:UserModel,female:UserModel):Observable<DateModel>{
    return this.http.get<DateModel>(this.dateURL +"match/" + male._id + "/" + female._id ,this.requestOptions);
  }
  /**
   * Unmatch user 1 with user two
   */
  unmatchUserWithUser(user1:UserModel,user2:UserModel):Observable<UserModel>{
    return this.http.get<UserModel>(this.dateURL + user1._id + "/" + user2._id + "/unmatch",this.requestOptions);
  }

  // DateFeedback






  // EventFeedback

  // City
  getAllCities():Promise<CityModel[]>{
    const responseObservable = this.http.get<CityModel[]>(this.cityURL);
    return firstValueFrom(responseObservable);
  }
  // Category
  getAllCategories():Promise<CategoryModel[]>{
    const responseObservable = this.http.get<CategoryModel[]>(this.categoryURL, this.requestOptions);
    return firstValueFrom(responseObservable);
  }

  // Activity
  getAllActivities():Promise<ActivityModel[]>{
    const responseObservable = this.http.get<ActivityModel[]>(this.activityURL, this.requestOptions);
    return firstValueFrom(responseObservable);
  }

  //gets all users
  getAllUsers():Promise<UserModel[]>{
    const response = this.http.get<UserModel[]>(this.userURL)
    return firstValueFrom(response);
  }

  //gets a specific user by passing the id
  getSpecificUser(id:string):Promise<UserModel>{
    const responseObservable = this.http.get<UserModel>(this.userURL+"/user/:"+id)
    return firstValueFrom(responseObservable);
  }

  // Preference


}
