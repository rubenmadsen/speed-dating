import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {StatusMessageType} from '../../interfaces/StatusMessageType';
import {StatusMessage} from "../../interfaces/statusMessage";
import {GlobalService} from "../../services/global.service";

@Component({
  selector: 'app-errorbar',
  templateUrl: './errorbar.component.html',
  styleUrls: ['./errorbar.component.css']
})

export class ErrorbarComponent {
  @ViewChild('containerRef') containerElementRef!: ElementRef;
  @ViewChild('pRef') pElementRef!: ElementRef;
  colors: { [key: number]: string[] } = {
    [StatusMessageType.ALERT]: ["#E11010C7","#FFFFFFD8"],
    [StatusMessageType.WARNING]: ["#E1C510C6","#0E0E0ECC"],
    [StatusMessageType.INFO]: ["#FFFFFFD8","#0E0E0ECC"],
    [StatusMessageType.SUCCESS]: ["#1EE110C6","#FFFFFFD8"]
  };
  constructor(private globalService:GlobalService) {
    globalService.getGlobalStatusSubject().subscribe({
      next: (statusMessage) => this.addMessage(statusMessage),
      error: (err) => console.error(err),
      complete: () => console.log('Completed'),
    });
  }

  private running:boolean = false;
  private queue:StatusMessage[] = [];
  display:string = "";
  private container:HTMLElement | null = null;
  private p:HTMLElement | null = null;
  private displayTime:number = 3000;
  private foldingTime:number = 500;
  ngAfterViewInit() {
    this.container = this.containerElementRef.nativeElement;
    this.p = this.pElementRef.nativeElement;
  }
  addMessage(message:any){
    this.queue.push(message);
    if(!this.running){
      this.running = true;
      this.setMessage()
    }
  }
  private setMessage(){
    this.unfold(this.queue.shift()!);
    setTimeout(() => {
      this.fold();
    }, this.displayTime);
  }
  private unfold(message: StatusMessage) {
    this.display = message.message
    console.log("unfolding")
    console.log("message",message)
    console.log("type",message.type)
    console.log("cols",this.colors)
    console.log("colsType",this.colors[message.type])
    if (this.container) {
      this.container.classList.toggle("open",true);
      this.container.style.backgroundColor = this.colors[message.type][0];
      if (this.p)
        this.p.style.color = this.colors[message.type][1];
    }
  }

  private fold(){
    console.log("folding")
    if (this.container)
      this.container.classList.toggle("open",false);
    if(this.queue.length === 0)
      this.running = false;
    else
      setTimeout(() => {
        this.setMessage();
      }, this.foldingTime);
  }
}
