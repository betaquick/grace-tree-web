import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { AgreementComponent } from './agreement.component';
import { AuthService } from '../../auth.service';
import { DummyComponent, asyncData, asyncError } from '../../../testing/helpers';

describe('AgreementComponent', () => {
  let component: AgreementComponent;
  let fixture: ComponentFixture<AgreementComponent>;
  let authServiceStub;
  let toastrStub;
  let routerStub;

  const routes =  [
    { path: 'company-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [ AgreementComponent, DummyComponent ],
      providers: [
        {provide: AuthService, useValue: jasmine.createSpyObj('authServiceStub', ['acceptAgreement'])},
        {provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['error'])}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgreementComponent);
    component = fixture.componentInstance;
    authServiceStub = TestBed.get(AuthService);
    routerStub = TestBed.get(Router);
    toastrStub = TestBed.get(ToastrService);
    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create agreement component', fakeAsync(() => {
    expect(component).toBeTruthy();
    expect(authServiceStub.acceptAgreement).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  }));

  describe('accept agreement', () => {
    let navigateStub;
    const response = {user: {userId: 1}};

    beforeEach(() => {
      navigateStub = spyOn(routerStub, 'navigate');
    });

    it('should successfully accept agreement - navigate to /user', fakeAsync(() => {
      authServiceStub.acceptAgreement.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.acceptAcceptment = true;
      component.acceptAgreement();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails accepting agreement- show toast error', fakeAsync(() => {
      authServiceStub.acceptAgreement.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.acceptAcceptment = true;
      component.acceptAgreement();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
