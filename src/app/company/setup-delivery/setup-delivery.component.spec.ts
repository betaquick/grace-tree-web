import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';

import { SetupDeliveryComponent } from './setup-delivery.component';
import { ScheduleDelivery } from '../../shared/models/user-model';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { CompanyService } from '../company.service';

describe('SetupDeliveryComponent', () => {
  let component: SetupDeliveryComponent;
  let fixture: ComponentFixture<SetupDeliveryComponent>;

  let companyServiceStub;
  let toastrStub;
  let routerStub;
  let navigateStub;

  const response = {
    company: {
      companyId: 4,
      companyName: 'Test Company'
    },
    crews: [{
      userId: 9,
      email: 'admin@fccc.net',
      firstName: 'Test',
      lastName: 'User',
    }],
    recipient: {
      userId: 1,
      firstName: 'Jimoh',
      lastName: 'Damilola'
    }
  };

  const delivery: ScheduleDelivery = {
    assignedToUserId: 1,
    additionalCompanyText: 'Test',
    additionalRecipientText: 'Test'
  };

  const routes = [
    { path: 'user-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent },
    { path: 'company/search', component: DummyComponent },
    { path: 'company/deliveries', component: DummyComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [SetupDeliveryComponent, DummyComponent],
      providers: [
        { provide: CompanyService, useValue: jasmine.createSpyObj('CompanyService', ['getDeliveryInfo', 'scheduleDelivery']) },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['success', 'error']) }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SetupDeliveryComponent);
    component = fixture.componentInstance;

    routerStub = TestBed.get(Router);
    companyServiceStub = TestBed.get(CompanyService);
    toastrStub = TestBed.get(ToastrService);

    companyServiceStub.getDeliveryInfo.and.returnValue(asyncData(response));
    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
    navigateStub = spyOn(routerStub, 'navigate');
  })));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(companyServiceStub.getDeliveryInfo).toBeDefined();
    expect(companyServiceStub.scheduleDelivery).toBeDefined();
    expect(toastrStub.success).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('Get Delivery Info', () => {
    it('should successfully get delivery info', fakeAsync(() => {
      expect(component.loading).toEqual(false);
      component.getDeliveryInfo(1);
      tick(100);
      expect(companyServiceStub.getDeliveryInfo.calls.count()).toEqual(1);
      expect(component.company).toEqual(response.company);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails fetching company info - show toast error', fakeAsync(() => {
      component.company = null;
      companyServiceStub.getDeliveryInfo.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.getDeliveryInfo(1);
      tick(100);
      expect(companyServiceStub.getDeliveryInfo.calls.count()).toEqual(1);
      expect(component.company).toEqual(null);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });

  describe('Schedule a delivery', () => {
    it('should successfully schedule a delivery - show toast success', fakeAsync(() => {
      companyServiceStub.scheduleDelivery.and.returnValue(asyncData(delivery));
      expect(component.loading).toEqual(false);
      component.recipient = response.recipient;
      component.delivery = delivery;
      component.scheduleDelivery();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
      expect(navigateStub.calls.count()).toEqual(1);
      expect(navigateStub.calls.argsFor(0)).toEqual([['/company/deliveries']]);
    }));

    it('Error: fails scheduling a delivery - show toast error', fakeAsync(() => {
      companyServiceStub.scheduleDelivery.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.recipient = response.recipient;
      component.delivery = delivery;
      component.scheduleDelivery();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
      expect(navigateStub.calls.count()).toEqual(0);
    }));
  });
});
