import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserModel} from "../../models/userModel";

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent{
  @Input() profile?: UserModel;
  @Output() onProfileClick = new EventEmitter;

  onClick(){
    this.onProfileClick.emit();
  }
  getFontSize():string{
    const emailLength = this.profile?.email.length;
    if (emailLength != undefined){
      if (emailLength > 20){
        return "0.6rem";
      }
      else if(emailLength>15){
        return "0.8rem";
      }
      else {
        return "1rem";
      }
    }
    else return "";
  }
}
