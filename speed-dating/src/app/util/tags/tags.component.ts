import {Component, EventEmitter, Input, Output} from '@angular/core';
import {faClose} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent {

  @Input()  tagClass = ''
  @Input()   tagLabel= ''
  protected readonly faClose = faClose;

  @Output() tagOnClick = new EventEmitter

  onClick(){
    this.tagOnClick.emit()
  }
}
