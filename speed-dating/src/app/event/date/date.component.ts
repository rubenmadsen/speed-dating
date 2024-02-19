import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, CdkDragStart, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {faInfo} from "@fortawesome/free-solid-svg-icons/faInfo";


@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent {


  protected readonly faInfo = faInfo

  tableUsers: Array<String> = []
  @Input() tableNumber = 1;
  @Input() male: string = ""
  @Input() female: string = "";
  @Output() returnUserToList = new EventEmitter<String>();
  previewUsers: Array<String> = []

  ngOnInit() {
    if (this.male !== "") {
      this.tableUsers.push(this.male)
    }

    if (this.female !== "") {
      this.tableUsers.push(this.female)
    } else {
      this.tableUsers.push("TBD")
    }
  }

  drop(event: any) {
    console.log("Dropped i date " + this.tableNumber);
    console.log(event.previousContainer.data);
    console.log(event.container.id);
    
    
    if (event.previousIndex === 0) {
      this.moveTable(event);
      return
    }
    
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, 1)
    if (this.tableUsers.length > 2) {
      for (let i = 2; i < this.tableUsers.length; i++) {
        this.returnUserToList.emit(this.tableUsers[i])
      }
      this.tableUsers = [this.tableUsers[0], this.tableUsers[1]]
    }  
  }

  moveTable(event: any) {    
    const itemFromPrevContainer = event.previousContainer.data[0]
    const itemFromPrevContainer1 = event.previousContainer.data[1]
    const itemFromCurrentContainer = event.container.data[0]
    const itemFromCurrentContainer1 = event.container.data[1]

    event.previousContainer.data[0] = itemFromCurrentContainer
    event.previousContainer.data[1] = itemFromCurrentContainer1
    event.container.data[0] = itemFromPrevContainer
    event.container.data[1] = itemFromPrevContainer1
  }
}
