import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserTypes } from '@betaquick/grace-tree-constants';

import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../auth.service';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { AuthDetails } from '../../shared/models/user-model';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
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
      declarations: [ ForgotPasswordComponent, DummyComponent ],
      providers: [
        {provide: AuthService, useValue: jasmine.createSpyObj('authServiceStub', ['login'])},
        {provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['error'])}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
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

  it('should create forgot password component', () => {
    expect(component).toBeTruthy();
    expect(authServiceStub.login).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });
});
