import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { VerificationTypes } from '@betaquick/grace-tree-constants';

import { UserVerificationComponent } from './user-verification.component';
import { AuthService } from '../../auth.service';
import { DummyComponent, asyncData, asyncError } from '../../../testing/helpers';

describe('UserVerificationComponent', () => {
  let component: UserVerificationComponent;
  let fixture: ComponentFixture<UserVerificationComponent>;
  let authServiceSpy;
  let toastrStub;
  let routerStub;
  const token = 'token';
  let verifyType = VerificationTypes.Email;

  const response = {
    user: {
      userId: 1,
      emails: [{
        emailAddress: 'test@email.com',
        primary: true
      }],
      phones: [{
        phoneNumber: '1234567890',
        primary: true,
      }]
    }
  };

  const routes =  [
    { path: 'company-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['validateToken']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [ UserVerificationComponent, DummyComponent ],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        {provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['success', 'error'])}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserVerificationComponent);
    component = fixture.componentInstance;

    routerStub = TestBed.get(Router);
    toastrStub = TestBed.get(ToastrService);

    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create verification component', () => {
    expect(component).toBeTruthy();
    expect(authServiceSpy.validateToken).toBeDefined();
    expect(toastrStub.success).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('Send email verification', () => {
    it('should successfully send email verification - show toast success', fakeAsync(() => {
      authServiceSpy.validateToken.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.validateToken(verifyType, token);
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails sending email verification - show toast error', fakeAsync(() => {
      authServiceSpy.validateToken.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.validateToken(verifyType, token);
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });

  describe('Send phone verification', () => {
    beforeEach(async(() => {
      verifyType = VerificationTypes.SMS;
    }));

    it('should successfully send phone verification - show toast success', fakeAsync(() => {
      authServiceSpy.validateToken.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.validateToken(verifyType, token);
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails sending phone verification - show toast error', fakeAsync(() => {
      authServiceSpy.validateToken.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.validateToken(verifyType, token);
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
