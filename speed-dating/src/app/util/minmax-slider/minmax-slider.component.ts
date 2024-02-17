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
  @Input() min:number = 0;
  @Input() max:number = 100;
  @ViewChild('trackRef') trackElementRef!: ElementRef;
  @ViewChild('handleRef') handleElementRef!: ElementRef;
  private width:number = 0;
  private handleSize:number = 0;
  ngAfterViewInit() {
    this.handleSize = this.handleElementRef.nativeElement.getBoundingClientRect().width;
    this.width = this.trackElementRef.nativeElement.getBoundingClientRect().width-this.handleSize;
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
    return Math.floor(this.remap(this.lowHandle.value,0,this.width,this.min, this.max +1));
  }
  getHighValue(){
    return Math.ceil(this.remap(this.highHandle.value,0,this.width,this.min, this.max +1));
  }

  /**
   * NOT WORKING YET
   * @param value
   * @private
   */
  private setLowValue(value:number){
    this.lowHandle.value = this.width * ((this.getLowValue()-this.min) / (this.max+1-this.min));

  }

  /**
   * NOT WORKING YET
   * @param value
   * @private
   */
  private setHighValue(value:number){

  }
  move(event: MouseEvent): void {
    if (!this.dragged) return;
    const trackRect = this.trackElementRef.nativeElement.getBoundingClientRect();
    this.width = trackRect.width;
    let newLeft = event.clientX - trackRect.left-this.dragOffset; // Relative X position within the track
    const handleWidth = this.dragged.offsetWidth;
    const maxLeft = trackRect.width - handleWidth;
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    this.dragged.style.left = newLeft + "px";
    const element = this.dragged as HTMLElement;
    // x on track
    const draggedCenter = (this.dragged.getBoundingClientRect().x+(this.handleSize/2))
    const trackStart = (trackRect.x+(this.handleSize/2));
    const position = draggedCenter - trackStart;
    // console.log("dragged center", draggedCenter);
    // console.log("track.start", trackStart);
    // console.log("valu",position)
    // let viewValue = (this.dragged.getBoundingClientRect().x+(this.handleSize/2)) - (trackRect.x + (this.handleSize/2));
    //viewValue =  Math.round(viewValue*this.step*this.scaler);
    if(element.id === "highHandle"){
      this.highHandle.value = position;
    }
    else{
      this.lowHandle.value = position;
    }
  }
  private pad(data:number | string):string{
    let padded = data + "";
    let zeroes = (this.max + "").length-padded.length;
    for (let i = 0; i < zeroes; i++) {
      padded = "0" + padded;
    }
    return padded;
  }
   remap(value: number, from1: number, to1: number, from2: number, to2: number): number {
    return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
  }
}
