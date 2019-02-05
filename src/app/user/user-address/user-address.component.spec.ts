import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';

import { UserAddressComponent } from './user-address.component';
import { UserService } from '../user.service';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { Address } from '../../shared/models/user-model';
import { Component } from '@angular/core';

describe('UserAddressComponent', () => {
  let component: UserAddressComponent;
  let fixture: ComponentFixture<UserAddressComponent>;
  let userServiceStub;
  let toastrStub;
  let routerStub;

  const addy = {
    state: 'BN',
    city: 'Okota',
    street: 'Prince Way',
    zip: '100102',
    deliveryInstruction: 'Please leave it by the door'
  } as Address;

  const routes = [
    { path: 'user-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {
    userServiceStub = jasmine.createSpyObj('AuthService', ['updateProfile', 'getUserProducts']);
    userServiceStub = {
      ...userServiceStub,
      user: addy
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [
        UserAddressComponent,
        DummyComponent
      ],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['success', 'error']) }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserAddressComponent);
    component = fixture.componentInstance;

    routerStub = TestBed.get(Router);
    userServiceStub = TestBed.get(UserService);
    toastrStub = TestBed.get(ToastrService);

    userServiceStub.getUserAddress.and.returnValue(asyncData(addy));
    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(userServiceStub.updateUserAddress).toBeDefined();
    expect(toastrStub.success).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('Update user address', () => {
    it('should successfully update user address - show toast success', fakeAsync(() => {
      userServiceStub.updateUserAddress.and.returnValue(asyncData(addy));
      expect(component.loading).toEqual(false);
      component.address = addy;
      component.updateAddress();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails updating user address - show toast error', fakeAsync(() => {
      userServiceStub.updateUserAddress.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.address = addy;
      component.updateAddress();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
