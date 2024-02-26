import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {UserModel} from "../../models/userModel";
import {DateModel} from "../../models/dateModel";

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css']
})
export class ParticipantListComponent {

  @Input() participantsList?: UserModel[];
  listUsers?: UserModel[] = [];
  @Input() datesList!: DateModel[];

  ngOnInit() {
    this.populateList();
  }

  /**
   * Populate user list.
   */
  populateList() {
    this.listUsers = this.participantsList?.filter(user => user.gender == "female");
    // this.listUsers = females?.map(user => user.firstname) || [];
  }

  /**
   * Allows drag and drop within the same list or to tables.
   * @param event
   */
  drop(event: any) {
    if (event.container === event.previousContainer) { // Drag and drop within same container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else if (event.previousIndex !== 0 && event.previousContainer.data.users[event.previousIndex].firstname !== "TBD" && event.previousContainer.data.users[event.previousIndex].firstname !== undefined) { 
      transferArrayItem(event.previousContainer.data.users, event.container.data, event.previousIndex, 1)
      event.previousContainer.data.users[1] = { firstname: 'TBD' };
    }
  }

  clearList(){
    this.listUsers = []
  }


  /**
   * Recieves item from a date table if.
   * @param item item to add to listUsers.
   */
  recieveItem(item: any) {
    if (item.firstname !== "TBD" && item.firstname !== "" && item.firstname !== undefined) {
      this.listUsers?.push(item)
    }
  }
}
