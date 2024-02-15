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
  width:number = 0;
  handleSize:number = 0;
  ngAfterViewInit() {
    this.width = this.trackElementRef.nativeElement.offsetWidth;
    this.handleSize = this.handleElementRef.nativeElement.height;
  }
  lowHandle:Handle = {min:0, value:0.2, max:0.8};
  highHandle:Handle = {min:0.2,value:0.8, max:1};
  dragged:HTMLElement | null = null;
  dragOffset:number = 0;
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
    return this.lowHandle.value;
  }
  getHighValue(){
    return this.highHandle.value;
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

    const viewValue = (this.dragged.getBoundingClientRect().x - trackRect.x)/trackRect.width;

    if(element.id === "highHandle"){
      this.highHandle.value = Math.round(viewValue*100)/100;
    }
    else{
      this.lowHandle.value = Math.round(viewValue);
    }
  }
}
