import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';

import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../auth.service';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { ResetPasswordDetails } from '../../shared/models/user-model';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authServiceStub;
  let toastrStub;
  let routerStub;

  const routes =  [
    { path: 'company-registration', component: DummyComponent },
    { path: 'user-registration', component: DummyComponent }
  ];


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [ ResetPasswordComponent, DummyComponent ],
      providers: [
        {provide: AuthService, useValue: jasmine.createSpyObj('authServiceStub', ['resetPassword', 'confirmResetPasswordToken'])},
        {provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['error', 'success'])}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    authServiceStub = TestBed.get(AuthService);
    routerStub = TestBed.get(Router);
    toastrStub = TestBed.get(ToastrService);

    authServiceStub.confirmResetPasswordToken.and.returnValue(asyncData({}));
    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create reset password component', () => {
    expect(component).toBeTruthy();
    expect(authServiceStub.confirmResetPasswordToken).toBeDefined();
    expect(authServiceStub.resetPassword).toBeDefined();
    expect(toastrStub.success).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('Reset Password', () => {
    let resetDetails: ResetPasswordDetails;
    let response;
    let navigateStub;

    beforeEach(() => {
      response = { user: {userId: 1} };
      navigateStub = spyOn(routerStub, 'navigate');
      resetDetails = new ResetPasswordDetails();
      resetDetails.token = 'TOKEN';
      resetDetails.password = 'password';
      resetDetails.confirmPassword = 'password';
    });

    it('should successfully reset password - navigate to login', fakeAsync(() => {
      authServiceStub.resetPassword.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.resetDetails = resetDetails;
      component.resetPassword();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(1);
      expect(navigateStub.calls.argsFor(0)).toEqual([['login']]);
      expect(toastrStub.success.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails to reset password  - show toast error', fakeAsync(() => {
      authServiceStub.resetPassword.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.resetDetails = resetDetails;
      component.resetPassword();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
