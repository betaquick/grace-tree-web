import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/observable/of';

import { DeliveryComponent } from './delivery.component';
import { AuthService } from '../../../shared/auth/auth.service';

describe('DeliveryComponent', () => {
  let component: DeliveryComponent;
  let fixture: ComponentFixture<DeliveryComponent>;
  let routerSpy: { navigate: jasmine.Spy };
  let authServiceSpy: { getProducts: jasmine.Spy, addDeliveryInfo: jasmine.Spy };

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getProducts', 'addDeliveryInfo']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy.getProducts.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule],
      declarations: [ DeliveryComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: AuthService, useValue: authServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
