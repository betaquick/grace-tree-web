import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupDeliveryComponent } from './setup-delivery.component';

describe('SetupDeliveryComponent', () => {
  let component: SetupDeliveryComponent;
  let fixture: ComponentFixture<SetupDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
