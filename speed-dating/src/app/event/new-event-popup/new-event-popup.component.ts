import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {faX} from "@fortawesome/free-solid-svg-icons/faX";

import {CityModel} from "../../models/cityModel";
import {BackendService} from "../../services/backend.service";
import {NgForm} from "@angular/forms";
import {EventModel} from "../../models/eventModel";
import {StatusMessage} from "../../interfaces/statusMessage";
import {StatusMessageType} from "../../interfaces/StatusMessageType";
import {GlobalService} from "../../services/global.service";


@Component({
  selector: 'app-new-event-popup',
  templateUrl: './new-event-popup.component.html',
  styleUrls: ['./new-event-popup.component.css']
})
export class NewEventPopupComponent {
  @Input() callback?: (newEvent: EventModel) => void;
  @ViewChild('f') signupForm!: NgForm;
  @ViewChild('popupRef') popupRef!:ElementRef
  isVisible: Boolean = true;
  protected readonly faX = faX;

  cities: CityModel[] = []

  form: any = {
    venue: '',
    city:'',
    date: '',
    time:'',
  }
  constructor(private backend: BackendService, private globalService: GlobalService) {
  }

  async ngOnInit(){
    await this.backend.getAllCities().then(cities => this.cities = cities.sort(( a , b ) => a.name > b.name ? 1 : - 1));
    this.popupRef.nativeElement.classList.toggle("show")
  }

  createEvent(){
    console.log(this.form.date)

    if(!this.checkFormValidation()){
      return
    }
    const combinedDateTimeString = `${this.form.date}T${this.form.time}`;
    const startdate = new Date(combinedDateTimeString);

    const event: EventModel = {
      startDate: startdate,
      imagePath: "MaleProfilePlaceholder",
      hasEnded: false,
      round: 0,
      location: this.form.venue,
      city: this.form.city,
      description: this.form.description,
      totalParticipants: 20,
      currentParticipants: 0,
      participants: [],
      dates: [],
      eventFeedback: [],

    }
    this.backend.createNewEvent(event).subscribe({
        next: (response) => {
          const mess:StatusMessage = {
            message:"Event created",
            type:StatusMessageType.SUCCESS
          };
          this.globalService.setGlobalStatus(mess);
          this.isVisible = false;

          if (this.callback)
            this.callback(response);
        },
        error: (err => {
          console.log(err);
        })
      }
    )
  }
  checkFormValidation() : Boolean{
    if(this.signupForm.valid){
      return true
    } else {
      Object.keys(this.signupForm.controls).forEach(field => {
        const control = this.signupForm.controls[field];
        control.markAsTouched({onlySelf: true});
      });
      return false
    }
  }

  closePopup(){
    this.isVisible = false;
  }

}
