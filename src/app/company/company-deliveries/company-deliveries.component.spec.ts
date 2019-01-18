import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDeliveriesComponent } from './company-deliveries.component';

describe('CompanyDeliveriesComponent', () => {
  let component: CompanyDeliveriesComponent;
  let fixture: ComponentFixture<CompanyDeliveriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDeliveriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
