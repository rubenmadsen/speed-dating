import { Component , Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
interface Handle{
  min:number;
  value:number;
  max:number;
}
@Component({
  selector: 'app-minmax-slider',
  templateUrl: './minmax-slider.component.html',
  styleUrls: ['./minmax-slider.component.css']
})

export class MinmaxSliderComponent implements AfterViewInit{
  @Input() sliderLabel:string = 'Slider label';
  @ViewChild('trackRef') trackElementRef!: ElementRef;
  @ViewChild('handleRef') handleElementRef!: ElementRef;
  min = 0;
  max = 100;
  private scaler:number = 1;
  private width:number = 0;
  private handleSize:number = 0;
  private step:number = 0;
  ngAfterViewInit() {
    this.handleSize = this.handleElementRef.nativeElement.getBoundingClientRect().width;
    this.width = this.trackElementRef.nativeElement.getBoundingClientRect().width-2;
    this.step = 1/this.width;
  }
  private lowHandle:Handle = {min:0, value:0.2, max:0.8};
  private highHandle:Handle = {min:0.2,value:0.8, max:1};
  private dragged:HTMLElement | null = null;
  private dragOffset:number = 0;
  drag(event: MouseEvent, startDrag: boolean): void {
    if (startDrag) {
      this.dragged = event.target as HTMLElement;
      this.dragOffset = event.offsetX;
      event.preventDefault();
    } else {
      this.dragged = null;
    }
  }
  getLowValue(){
    return (Math.round(this.lowHandle.value*this.step*this.scaler));
    //return this.lowHandle.value;
  }
  getHighValue(){
    return (Math.round(this.highHandle.value*this.step*this.scaler));
  }
  move(event: MouseEvent): void {
    if (!this.dragged) return;
    const trackRect = this.trackElementRef.nativeElement.getBoundingClientRect();
    let newLeft = event.clientX - trackRect.left-this.dragOffset; // Relative X position within the track
    const handleWidth = this.dragged.offsetWidth;
    const maxLeft = trackRect.width - handleWidth;
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    this.dragged.style.left = newLeft + "px";
    const element = this.dragged as HTMLElement;
    // x on track

    let viewValue = (this.dragged.getBoundingClientRect().x+(this.handleSize/2)) - trackRect.x - (this.handleSize/2);
    //viewValue =  Math.round(viewValue*this.step*this.scaler);
    if(element.id === "highHandle"){
      this.highHandle.value = this.remap(viewValue,0,1,this.min,this.max);
    }
    else{
      this.lowHandle.value = this.remap(viewValue,0,1,this.min,this.max);
    }
  }
  private pad(data:number | string):string{
    let padded = data + "";
    let zeroes = (this.scaler + "").length-padded.length;
    for (let i = 0; i < zeroes; i++) {
      padded = "0" + padded;
    }
    return padded;
  }
   remap(value: number, from1: number, to1: number, from2: number, to2: number): number {
    return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
  }
}
