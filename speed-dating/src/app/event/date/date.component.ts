import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css'],
})
export class DateComponent {
  
  protected readonly faInfo = faInfo;
  tableUsers: Array<String> = [];
  
  @Input() tableNumber = 1;
  @Input() male: string = '';
  @Input() female: string = '';
  @Output() returnUserToList = new EventEmitter<String>();

  /**
   * Pushes male and female participant to the table
   */
  ngOnInit() {
    if (this.male !== '') {
      this.tableUsers.push(this.male);
    }

    if (this.female !== '') {
      this.tableUsers.push(this.female);
    }
  }

  /**
   * Moves the participant from one container to another container
   *
   * @param event The participant being moved 
   */
  drop(event: any) {
    console.log('Dropped');
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      1
    );
    if (this.tableUsers.length > 2) {
      for (let i = 2; i < this.tableUsers.length; i++) {
        this.returnUserToList.emit(this.tableUsers[i]);
      }
      this.tableUsers = [this.tableUsers[0], this.tableUsers[1]];
    }
  }
}
