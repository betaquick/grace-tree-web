import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { CompanyDashboardComponent } from './company-dashboard.component';
import { CompanyService } from '../company.service';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { DeliveryComponent } from '../../shared/delivery/delivery.component';

describe('CompanyDashboardComponent', () => {
  let component: CompanyDashboardComponent;
  let fixture: ComponentFixture<CompanyDashboardComponent>;
  let companyServiceStub;
  let toastrStub;
  let routerStub;

  const response = [{
    firstName: 'Test',
    lastName: 'Account',
    userId: 1,
  }];

  const routes = [
    { path: 'user-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        ToastrModule.forRoot({})
      ],
      declarations: [
        CompanyDashboardComponent,
        DummyComponent,
        ModalBasicComponent,
        DeliveryComponent
      ],
      providers: [
        {
          provide: CompanyService,
          useValue: jasmine.createSpyObj('CompanyService', ['getDeliveries', 'getPendingDeliveries', 'getRecentDeliveries'])
        },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['success', 'error']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyDashboardComponent);
    component = fixture.componentInstance;

    routerStub = TestBed.get(Router);
    companyServiceStub = TestBed.get(CompanyService);
    toastrStub = TestBed.get(ToastrService);

    companyServiceStub.getDeliveries.and.returnValue(asyncData(response));
    companyServiceStub.getPendingDeliveries.and.returnValue(asyncData(response));
    companyServiceStub.getRecentDeliveries.and.returnValue(asyncData(response));
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(companyServiceStub.getDeliveries).toBeDefined();
    expect(companyServiceStub.getPendingDeliveries).toBeDefined();
    expect(companyServiceStub.getRecentDeliveries).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('list total, pending and recent deliveries', () => {
    it('should successfully list total, recent and pending deliveries ', fakeAsync(() => {
      expect(component.totalCount).toEqual(response.length);
      expect(component.pendingCount).toEqual(response.length);
      expect(component.deliveries).toEqual(response);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails listing total, recent and pending deliveries - show toast error', fakeAsync(() => {
      component.deliveries = [];
      component.pendingCount = 0;
      component.totalCount = 0;

      companyServiceStub.getDeliveries.and.returnValue(asyncError(new Error()));
      companyServiceStub.getPendingDeliveries.and.returnValue(asyncError(new Error()));
      companyServiceStub.getRecentDeliveries.and.returnValue(asyncError(new Error()));

      component.getDeliveries();
      component.getPendingDeliveries();
      component.getRecentDeliveries();

      tick(100);
      expect(component.totalCount).toEqual(0);
      expect(component.pendingCount).toEqual(0);
      expect(component.deliveries).toEqual([]);
      expect(toastrStub.error.calls.count()).toEqual(3);
    }));
  });
});
