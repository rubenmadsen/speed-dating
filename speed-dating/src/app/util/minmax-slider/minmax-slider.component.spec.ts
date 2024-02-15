import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinmaxSliderComponent } from './minmax-slider.component';

describe('MinmaxSliderComponent', () => {
  let component: MinmaxSliderComponent;
  let fixture: ComponentFixture<MinmaxSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinmaxSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinmaxSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
