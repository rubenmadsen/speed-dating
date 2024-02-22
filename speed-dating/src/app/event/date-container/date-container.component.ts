import {Component, Input, SimpleChanges} from '@angular/core';
import {ParticipantListComponent} from "../participant-list/participant-list.component";
import {UserModel} from "../../models/userModel";
import {BehaviorSubject, Subscription} from "rxjs";
import {DateModel} from "../../models/dateModel";

@Component({
  selector: 'app-date-container',
  templateUrl: './date-container.component.html',
  styleUrls: ['./date-container.component.css']
})
export class DateContainerComponent {

  @Input() participantList!: ParticipantListComponent;
  listUsers?: UserModel[];
  @Input() datesList!: DateModel[];
  hasDates: boolean = false;

  ngOnInit() {
    this.filterParticipants();
  }

  private filterParticipants() {
    this.listUsers = this.participantList.participantsList?.filter(user => user.gender === "male");
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['datesList'] && this.datesList !== undefined) {
        this.hasDates = true;

        this.datesList.forEach(date => {
          const personOneFull = this.participantList.participantsList?.find(participant => participant._id === date.personOne);
          const personTwoFull = this.participantList.participantsList?.find(participant => participant._id === date.personTwo);

          return {
            ...date,
            personOne: personOneFull ? { ...personOneFull } : date.personOne, // Replace personOne ID with full object
            personTwo: personTwoFull ? { ...personTwoFull } : date.personTwo, // Replace personTwo ID with full object
          } as any;
        })
      console.log(this.datesList)
    }
  }

}
