import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';

import { CompanyRegistrationComponent } from './company-registration.component';
import { AuthService } from '../auth.service';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { RegisterUser } from '../../shared/models/user-model';

describe('CompanyRegistrationComponent', () => {
  let component: CompanyRegistrationComponent;
  let fixture: ComponentFixture<CompanyRegistrationComponent>;
  let authServiceStub;
  let toastrStub;
  let routerStub;
  let locationStub;

  const routes =  [
    { path: 'user-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [ CompanyRegistrationComponent, DummyComponent ],
      providers: [
        {provide: AuthService, useValue: jasmine.createSpyObj('authServiceStub', ['register'])},
        {provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['error'])}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyRegistrationComponent);
    component = fixture.componentInstance;
    authServiceStub = TestBed.get(AuthService);
    routerStub = TestBed.get(Router);
    toastrStub = TestBed.get(ToastrService);
    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router, Location], (router: Router, location: Location) => {
    routerStub = router;
    locationStub = location;
  })));

  it('should create company registration component', () => {
    expect(component).toBeTruthy();
    expect(authServiceStub.register).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('register new company', () => {
    let user: RegisterUser;
    let navigateStub;
    const response = {token: 'TOKEN', user: {userId: 1}};

    beforeEach(() => {
      navigateStub = spyOn(routerStub, 'navigate');
      user = new RegisterUser();
      user.firstName = 'Test';
      user.lastName = 'User';
      user.password = '1q2w3e4r5t';
      user.confirmPassword = '1q2w3e4r5t';
      user.emails = [{
        emailAddress: 'test@email.com',
        primary: true
      }];
      user.phones = [{
        phoneNumber: '1234567890',
        primary: true,
      }];
    });

    it('should successfully register a new company - navigate to company', fakeAsync(() => {
      authServiceStub.register.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.user = user;
      component.register();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails registration of a new company - show toast error', fakeAsync(() => {
      authServiceStub.register.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.user = user;
      component.register();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
