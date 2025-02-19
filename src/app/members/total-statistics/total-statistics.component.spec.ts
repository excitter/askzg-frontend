import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TotalStatisticsComponent } from './total-statistics.component';

describe('TotalStatisticsComponent', () => {
  let component: TotalStatisticsComponent;
  let fixture: ComponentFixture<TotalStatisticsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
