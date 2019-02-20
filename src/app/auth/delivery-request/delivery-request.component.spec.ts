import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { VerificationTypes } from '@betaquick/grace-tree-constants';

import { DeliveryRequestComponent } from './delivery-request.component';
import { AuthService } from '../auth.service';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';

describe('DeliveryRequestComponent', () => {
  let component: DeliveryRequestComponent;
  let fixture: ComponentFixture<DeliveryRequestComponent>;
  let authServiceSpy;
  let toastrStub;
  let routerStub;

  const response = {
    userId: 1,
    deliveryId: 2
  };

  const routes =  [
    { path: 'company-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['acceptDeliveryRequest']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [ DeliveryRequestComponent, DummyComponent ],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        {provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['success', 'error'])}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryRequestComponent);
    component = fixture.componentInstance;

    routerStub = TestBed.get(Router);
    toastrStub = TestBed.get(ToastrService);

    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(authServiceSpy.acceptDeliveryRequest).toBeDefined();
    expect(toastrStub.success).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('Accept delivery request', () => {
    it('should successfully accept delivery request - show toast success', fakeAsync(() => {
      authServiceSpy.acceptDeliveryRequest.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(true);
      component.acceptDeliveryRequest(1, 2);
      tick(100);
      expect(component.loading).toEqual(false);
      expect(toastrStub.success.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails accepting delivery request - show toast error', fakeAsync(() => {
      authServiceSpy.acceptDeliveryRequest.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(true);
      component.acceptDeliveryRequest(1, 2);
      tick(100);
      expect(component.loading).toEqual(true);
      expect(toastrStub.success.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
