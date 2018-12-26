import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserTypes } from '@betaquick/grace-tree-constants';

import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { AuthDetails } from '../../shared/models/user-model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceStub;
  let toastrStub;
  let routerStub;
  let locationStub;

  const routes =  [
    { path: 'company-registration', component: DummyComponent },
    { path: 'user-registration', component: DummyComponent }
  ];


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, ToastrModule.forRoot({})],
      declarations: [ LoginComponent, DummyComponent ],
      providers: [
        {provide: AuthService, useValue: jasmine.createSpyObj('authServiceStub', ['login'])},
        {provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['error'])}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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

  it('should create login component', () => {
    expect(component).toBeTruthy();
    expect(authServiceStub.login).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('login user', () => {
    let user: AuthDetails;
    let navigateStub;
    let response;

    beforeEach(() => {
      response = {token: 'TOKEN', user: {userId: 1}};
      navigateStub = spyOn(routerStub, 'navigate');
      user = new AuthDetails();
      user.email = 'test@email.com';
      user.password = '1q2w3e4r5t';
    });

    it('should successfully login user - navigate based on userType: TreeAdmin', fakeAsync(() => {
      response.user.userType = UserTypes.TreeAdmin;
      authServiceStub.login.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.authUser = user;
      component.logIn();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(1);
      expect(navigateStub.calls.argsFor(0)).toEqual([['/company']]);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('should successfully login user - navigate based on userType: Crew', fakeAsync(() => {
      response.user.userType = UserTypes.Crew;
      authServiceStub.login.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.authUser = user;
      component.logIn();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(1);
      expect(navigateStub.calls.argsFor(0)).toEqual([['/company']]);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('should successfully login user - navigate based on userType: General', fakeAsync(() => {
      response.user.userType = UserTypes.General;
      authServiceStub.login.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.authUser = user;
      component.logIn();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(1);
      expect(navigateStub.calls.argsFor(0)).toEqual([['/user']]);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails login  - show toast error', fakeAsync(() => {
      authServiceStub.login.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.authUser = user;
      component.logIn();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
