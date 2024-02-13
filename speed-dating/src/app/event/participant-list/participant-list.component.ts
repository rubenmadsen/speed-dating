import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css']
})
export class ParticipantListComponent {
  listUsers: Array<string> = []
  tableUsers: [string, string] = ["MALE", "TBD"]

  ngOnInit() {
    this.populateList();
  }

  populateList() { //TODO: Puplate the list and retrieve patricipants from backend
    this.listUsers = ["Qwerty Larsson", "Greta Larsson", "Stina Persson", "Lennart Adolfsson", "ASD KJHJ"]
  }

  drop(event: any) {
    const current = event.container.id === 'table' ? this.tableUsers : this.listUsers
    if (event.previousContainer.id === 'table' && event.previousIndex === 0) { // To not move a male of table
      return;
    }

    if (event.container === event.previousContainer) { // Drag and drop within same container
      moveItemInArray(current, event.previousIndex, event.currentIndex)
    } else { 
      const target = event.container.id === 'table' ? this.listUsers : this.tableUsers
      transferArrayItem(target, current, event.previousIndex, 1)
      if (this.tableUsers.length > 2) {
        for (let i = 2; i < this.tableUsers.length; i++) {
          this.listUsers.push(this.tableUsers[i])
        }
        this.tableUsers = [this.tableUsers[0], this.tableUsers[1]]
      }
    }
  }
}
