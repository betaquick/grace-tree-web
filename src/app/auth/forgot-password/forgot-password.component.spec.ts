import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../auth.service';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { AuthDetails } from '../../shared/models/user-model';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authServiceStub;
  let toastrStub;

  const routes =  [
    { path: 'company-registration', component: DummyComponent },
    { path: 'user-registration', component: DummyComponent }
  ];


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, ToastrModule.forRoot({})],
      declarations: [ ForgotPasswordComponent, DummyComponent ],
      providers: [
        {provide: AuthService, useValue: jasmine.createSpyObj('authServiceStub', ['requestResetPassword'])},
        {provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['error', 'success'])}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    authServiceStub = TestBed.get(AuthService);
    toastrStub = TestBed.get(ToastrService);
    fixture.detectChanges();
  }));

  it('should create forgot password component', () => {
    expect(component).toBeTruthy();
    expect(authServiceStub.requestResetPassword).toBeDefined();
    expect(toastrStub.success).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('Forgot Password', () => {
    let user: AuthDetails;
    let response;

    beforeEach(() => {
      response = { user: {userId: 1} };
      user = new AuthDetails();
      user.email = 'test@email.com';
    });

    it('should successfully request token - show toast success', fakeAsync(() => {
      authServiceStub.requestResetPassword.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.authUser = user;
      component.requestPasswordReset();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails to request token - show toast error', fakeAsync(() => {
      authServiceStub.requestResetPassword.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.authUser = user;
      component.requestPasswordReset();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
