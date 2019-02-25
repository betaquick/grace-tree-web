import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';

import { ManageDeliveryComponent } from './manage-delivery.component';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { CompanyService } from '../company.service';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { DeliveryComponent } from '../../shared/delivery/delivery.component';

describe('ManageDeliveryComponent', () => {
  let component: ManageDeliveryComponent;
  let fixture: ComponentFixture<ManageDeliveryComponent>;
  let companyServiceStub;
  let toastrStub;
  let routerStub;
  const deliveries = [{
    firstName: 'Test',
    lastName: 'Account',
    userId: 1,
  }];

  const routes = [
    { path: 'user-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent },
    { path: 'company/deliveries', component: DummyComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        FormsModule,
        CustomFormsModule,
        ToastrModule.forRoot({})
      ],
      declarations: [
        ManageDeliveryComponent,
        DummyComponent,
        ModalBasicComponent,
        DeliveryComponent
      ],
      providers: [
        { provide: CompanyService, useValue: jasmine.createSpyObj('CompanyService', ['getDelivery']) },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['error']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDeliveryComponent);
    component = fixture.componentInstance;

    routerStub = TestBed.get(Router);
    companyServiceStub = TestBed.get(CompanyService);
    toastrStub = TestBed.get(ToastrService);

    companyServiceStub.getDelivery.and.returnValue(asyncData(deliveries));
    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(companyServiceStub.getDelivery).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('manage delivery', () => {
    it('should successfully list all users under a delivery', fakeAsync(() => {
      component.getDelivery(1);
      expect(component.loading).toEqual(true);

      tick(100);
      expect(component.loading).toEqual(false);

      expect(component.deliveries).toEqual(deliveries);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails listing all users under a delivery - show toast error', fakeAsync(() => {
      component.deliveries = [];
      companyServiceStub.getDelivery.and.returnValue(asyncError(new Error()));

      component.getDelivery(1);
      expect(component.loading).toEqual(true);

      tick(100);
      expect(component.loading).toEqual(false);
      expect(component.deliveries).toEqual([]);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
