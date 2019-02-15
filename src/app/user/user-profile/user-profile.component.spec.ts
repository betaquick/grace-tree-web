import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';

import { UserProfileComponent } from './user-profile.component';
import { UserService } from '../user.service';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { RegisterUser } from '../../shared/models/user-model';
import { Component } from '@angular/core';


@Component({
  // tslint:disable-next-line
  selector: 'app-user-profile-address',
  template: ''
})
class UserProfileAddressStubComponent {
}

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userServiceStub;
  let toastrStub;
  let routerStub;
  const response = {
    firstName: 'Test',
    lastName: 'Account',
    emails: [{
      emailAddress: 'test@email.com',
      primary: true
    }],
    phones: [{
      phoneNumber: '1234567890',
      primary: true,
    }]
  } as RegisterUser;
  const userProducts = [{
    userId: 1,
    active: 1,
    createdAt: '2018-12-22T08:54:17.000Z',
    productCode: 'chips',
    productDesc: 'Wood Chips',
    productId: 1,
  }];

  const routes = [
    { path: 'user-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {
    userServiceStub = jasmine.createSpyObj('AuthService', ['updateProfile', 'getUserProducts']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [
        UserProfileComponent,
        DummyComponent,
        UserProfileAddressStubComponent
      ],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['success', 'error']) }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;

    routerStub = TestBed.get(Router);
    userServiceStub = TestBed.get(UserService);
    toastrStub = TestBed.get(ToastrService);

    userServiceStub.getUserProducts.and.returnValue(asyncData(userProducts));
    component.user = response;

    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(userServiceStub.updateProfile).toBeDefined();
    expect(toastrStub.success).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('Update user profile', () => {
    it('should successfully update user profile - show toast success', fakeAsync(() => {
      userServiceStub.updateProfile.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.updateprofile();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails updating user profile - show toast error', fakeAsync(() => {
      userServiceStub.updateProfile.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.updateprofile();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
