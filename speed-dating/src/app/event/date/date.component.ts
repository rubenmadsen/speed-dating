import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
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
  tableData: { users: UserModel[], matchVal: number } = { users: [], matchVal: 0 };

  @Output() changeDetected = new EventEmitter<{ tableUsers: UserModel[], tableNumber: number }>();

  @Output() onUserClick = new EventEmitter<string>();
  /**
   * Pushes male and female participant to the table
   */
  ngOnInit() {
    if (this.male) {
      this.tableUsers.push(this.male);
    }
    this.tableUsers.push(this.female || { firstname: 'TBD' as any });
    this.tableData = {
      users: this.tableUsers,
      matchVal: this.matchVal,
    };
  }


  /**
   * Moves the participant from one container to another container
   *
   * @param event The participant being moved
   */
  drop(event: any) {
    if (event.previousIndex === 0 && event.previousContainer.id !== 'list') {
      this.moveTable(event);
      return
    }

    if (event.previousContainer.id.includes("table") && event.container.id.includes("table")) { // Move between tables.
      transferArrayItem(event.previousContainer.data.users, event.container.data.users, event.previousIndex, 1);

    } else { // Move between table and list.
      transferArrayItem(event.previousContainer.data, event.container.data.users, event.previousIndex, 1)
    }


    if (this.tableUsers.length > 2) {
      for (let i = 2; i < this.tableUsers.length; i++) {
        if (event.previousContainer.id === 'list') {
          this.returnUserToList.emit(this.tableUsers[i]);
          this.changeDetected.emit({tableUsers: this.tableUsers, tableNumber: this.tableNumber})
        } else {
          //TODO: Ghetto shit, not sure why this is needed to move females between tables.
          event.previousContainer.data.users[1] = event.container.data.users.pop()
          this.emitUpdatedTables(event.previousContainer, event.container);
        }
      }

      this.tableUsers = [this.tableUsers[0], this.tableUsers[1]]
      this.tableData.users = this.tableUsers
    }
  }

  emitUpdatedTables(previousContainer: any, currentContainer: any) {
    this.changeDetected.emit({
      tableUsers: previousContainer.data.users,
      tableNumber: previousContainer.data.tableNumber, // Ensure you have tableNumber in your container's data
    });

    this.changeDetected.emit({
      tableUsers: currentContainer.data.users,
      tableNumber: currentContainer.data.tableNumber, // Ensure you have tableNumber in your container's data
    });
  }


    /**
   * Move participants from entire table to another table.
   */
  moveTable(event: any) {
    const itemFromPrevContainer = event.previousContainer.data.users[0]
    const itemFromPrevContainer1 = event.previousContainer.data.users[1]
    const itemFromPrevContainer2 = event.previousContainer.data.matchVal

    const itemFromCurrentContainer = event.container.data.users[0]
    const itemFromCurrentContainer1 = event.container.data.users[1]
    const itemFromCurrentContainer2 = event.container.data.matchVal

    event.container.data.matchVal = itemFromPrevContainer2
    event.previousContainer.data.matchVal = itemFromCurrentContainer2
    this.tableData['matchVal'] = itemFromPrevContainer2

    event.previousContainer.data.users[0] = itemFromCurrentContainer === undefined ? 'TBD' : itemFromCurrentContainer
    event.previousContainer.data.users[1] = itemFromCurrentContainer1 === undefined ? 'TBD' : itemFromCurrentContainer1
    event.container.data.users[0] = itemFromPrevContainer === undefined ? 'TBD' : itemFromPrevContainer
    event.container.data.users[1] = itemFromPrevContainer1 === undefined ? 'TBD' : itemFromPrevContainer1

  }

  onParticipantClick(event:any){
    console.log("EVENT",event.target.id);
    this.onUserClick.emit(event.target.id)
  }
}
