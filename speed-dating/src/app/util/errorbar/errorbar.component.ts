import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {StatusMessageType} from '../../interfaces/StatusMessageType';
import {StatusMessage} from "../../interfaces/statusMessage";
import {GlobalService} from "../../services/global.service";
import {Subject} from "rxjs";

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
  private running:boolean = false;
  private queue:StatusMessage[] = [];
  display:string = "";
  private container:HTMLElement | null = null;
  private p:HTMLElement | null = null;
  private displayTime:number = 3000;
  private foldingTime:number = 500;
  private subject:Subject<StatusMessage>;
  private interval:any;
  constructor(private globalService:GlobalService) {
      this.subject = globalService.getGlobalStatusSubject();
      this.setSubject(this.subject)
  }

  ngAfterViewInit() {
    this.container = this.containerElementRef.nativeElement;
    this.p = this.pElementRef.nativeElement;
    this.p!.style.userSelect = 'none';
  }

  setSubject(subject:Subject<StatusMessage>){
    // this.subject.unsubscribe();
    this.subject = subject;
    this.subject.subscribe({
      next: (statusMessage) => this.addMessage(statusMessage),
      error: (err) => console.error(err),
      complete: () => console.log('Completed'),
    });
  }

  private release(){
    clearInterval(this.interval);
    this.fold();
  }
  /**
   * Adds a message to the queue
   * @param message The message
   */
  addMessage(message:any){
    if (message.ms != undefined)
      if (message.ms === -2){
        this.release();
        return;
      }
    this.queue.push(message);
    if(!this.running){
      this.running = true;
      this.start()
    }
  }


  private start(){
    const mes = this.queue.shift()!
    this.unfold(mes);
    let ms = mes.ms != undefined ? mes.ms : this.displayTime;
    if (ms === -1)
      ms = 10000000;
    this.interval = setTimeout(() => {
      this.fold();
    },
      ms);
  }
  private unfold(message: StatusMessage) {
    this.display = message.message
    if (this.container) {
      this.container.classList.toggle("open",true);
      this.container.style.backgroundColor = this.colors[message.type][0];
      if (this.p)
        this.p.style.color = this.colors[message.type][1];
    }
  }

  private fold(){
    if (this.container)
      this.container.classList.toggle("open",false);
    if(this.queue.length === 0)
      this.running = false;
    else
      setTimeout(() => {
        this.start();
      }, this.foldingTime);
  }
}
