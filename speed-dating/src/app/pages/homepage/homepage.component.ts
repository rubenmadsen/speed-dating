import { Component } from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {EventModel} from "../../models/eventModel";
import {PingPong} from "../../interfaces/PingPong";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  events:EventModel[] = [];
  done: Boolean = false;
  pingpong:PingPong<EventModel> = {amount:10,itemType:'EventModel',items:[], retrieved:0};

  constructor(private backend: BackendService) {}

  async ngOnInit(){
    // await this.backend.getAllEvents().then(events => {
    //   this.events = events.sort((a,b) => a.startDate > b.startDate ? 1 : -1);
    //   this.done = true;
    // });
    this.getMoreEvents();
  }
  getMoreEvents(){
    this.backend.getAlleventsStream(this.pingpong).subscribe(pp => {
      this.events.push(...pp.items);
      this.events = this.events.sort((a,b) => a.startDate > b.startDate ? 1 : -1);
      this.pingpong = pp;
      this.done = true
      if(this.pingpong.items.length !== 0)
        this.getMoreEvents();
    });
  }
}
