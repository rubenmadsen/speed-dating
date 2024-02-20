import { Component } from '@angular/core';
import {faX} from "@fortawesome/free-solid-svg-icons/faX";


@Component({
  selector: 'app-new-event-popup',
  templateUrl: './new-event-popup.component.html',
  styleUrls: ['./new-event-popup.component.css']
})
export class NewEventPopupComponent {

  isVisible: Boolean = true;
  protected readonly faX = faX;

  form: any = {
    venue: '',
    city:'',
    date: '',
  }


  closePopup(){
    this.isVisible = false;
  }

}
