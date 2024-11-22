import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminFormComponent } from './admin-form.component';

describe('AdminFormComponent', () => {
  let component: AdminFormComponent;
  let fixture: ComponentFixture<AdminFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
