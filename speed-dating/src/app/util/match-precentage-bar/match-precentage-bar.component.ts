import {ChangeDetectorRef, Component, Input, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-match-precentage-bar',
  templateUrl: './match-precentage-bar.component.html',
  styleUrls: ['./match-precentage-bar.component.css']
})
export class MatchPrecentageBarComponent {
  @Input() matchValue = "50";
  @Input() width = "5";
  @Input() height = "1";



  ngOnInit() {
    this.width = this.width + 'rem';
    this.height = this.height + 'rem';
    if (Number(this.matchValue) > 100) {
      this.matchValue = "100";
    }
  }

  getColor(): string {
    if (Number(this.matchValue) < 15) {
      return "red"
    } else if (Number(this.matchValue) < 50) {
      return "orange"
    } else if (Number(this.matchValue) < 70) {
      return "yellow"
    } else {
      return "green"
    }
  }

}
