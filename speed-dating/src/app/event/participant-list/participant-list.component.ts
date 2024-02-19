import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css']
})
export class ParticipantListComponent {
  listUsers: Array<string> = []

  ngOnInit() {
    this.populateList();
  }

  /**
   * Populate user list.
   */
  populateList() { //TODO: Populate the list and retrieve patricipants from backend
    this.listUsers = ["Qwerty Larsson", "Greta Larsson", "Stina Persson", "Lennart Adolfsson", "ASD KJHJ"]
  }

  /**
   * Allows drag and drop within the same list or to tables.
   * @param event
   */
  drop(event: any) {
    console.log("To: " + event.container.id + " in part ts");
    if (event.container === event.previousContainer) { // Drag and drop within same container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else if (event.previousIndex !== 0 && event.previousContainer.data[event.previousIndex] !== "TBD") {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, 1)
    }
  }

  /**
   * Recieves item from a date table if.
   * @param item item to add to listUsers.
   */
  recieveItem(item: any) {
    if (item !== "TBD") {
      this.listUsers.push(item)
    }
  }
}
