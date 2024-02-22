import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragStart, transferArrayItem } from '@angular/cdk/drag-drop';
import {faInfo} from "@fortawesome/free-solid-svg-icons/faInfo";
import {DateModel} from "../../models/dateModel";
import {UserModel} from "../../models/userModel";


@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css'],
})
export class DateComponent {

  protected readonly faInfo = faInfo;
  // tableUsers: Array<String> = [];

  @Input() tableNumber = 1;
  @Input() male?: UserModel;
  @Input() female!: UserModel;

  @Output() returnUserToList = new EventEmitter<UserModel>();
  previewUsers: Array<String> = []
  @Input() matchVal: number = 0;

  tableUsers: UserModel[] = [];

  isFemaleTBD = true;
  @Output() changeDetected = new EventEmitter<{ tableUsers: UserModel[], tableNumber: number }>();


  /**
   * Pushes male and female participant to the table
   */
  ngOnInit() {
    if (this.male) {
      this.tableUsers.push(this.male);
    }
    if (this.female && this.female.firstname !== "TBD") {
      this.tableUsers.push(this.female);
      this.isFemaleTBD = false;
    }
  }

  /**
   * Moves the participant from one container to another container
   *
   * @param event The participant being moved
   */
  drop(event: any) {
    if (event.previousIndex === 0 && event.previousContainer.id !== 'list') {
      console.log("we hit?");
      this.moveTable(event);
      return
    }

    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, 1)
    if (this.tableUsers.length > 2) {
      for (let i = 2; i < this.tableUsers.length; i++) {
        this.returnUserToList.emit(this.tableUsers[i]);
      }
      this.tableUsers = [this.tableUsers[0], this.tableUsers[1]]
    }
    this.changeDetected.emit({ tableUsers: this.tableUsers, tableNumber: this.tableNumber });
  }

  /**
   * Move participants from entire table to another table.
   */
  moveTable(event: any) {
    const itemFromPrevContainer = event.previousContainer.data[0]
    const itemFromPrevContainer1 = event.previousContainer.data[1]
    const itemFromCurrentContainer = event.container.data[0]
    const itemFromCurrentContainer1 = event.container.data[1]

    event.previousContainer.data[0] = itemFromCurrentContainer === undefined ? 'TBD' : itemFromCurrentContainer
    event.previousContainer.data[1] = itemFromCurrentContainer1 === undefined ? 'TBD' : itemFromCurrentContainer1
    event.container.data[0] = itemFromPrevContainer === undefined ? 'TBD' : itemFromPrevContainer
    event.container.data[1] = itemFromPrevContainer1 === undefined ? 'TBD' : itemFromPrevContainer1
  }
}
