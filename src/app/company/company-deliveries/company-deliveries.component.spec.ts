import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';

import { CompanyDeliveriesComponent } from './company-deliveries.component';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { CompanyService } from '../company.service';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';

describe('CompanyDeliveriesComponent', () => {
  let component: CompanyDeliveriesComponent;
  let fixture: ComponentFixture<CompanyDeliveriesComponent>;
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
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [CompanyDeliveriesComponent, DummyComponent, ModalBasicComponent],
      providers: [
        { provide: CompanyService, useValue: jasmine.createSpyObj('CompanyService', ['getDeliveries']) },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['error']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyDeliveriesComponent);
    component = fixture.componentInstance;

    routerStub = TestBed.get(Router);
    companyServiceStub = TestBed.get(CompanyService);
    toastrStub = TestBed.get(ToastrService);

    companyServiceStub.getDeliveries.and.returnValue(asyncData(deliveries));
    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(companyServiceStub.getDeliveries).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('list deliveries', () => {
    it('should successfully list all deliveries ', fakeAsync(() => {
      expect(component.deliveries).toEqual(deliveries);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails listing all deliveries - show toast error', fakeAsync(() => {
      component.deliveries = [];
      companyServiceStub.getDeliveries.and.returnValue(asyncError(new Error()));

      component.getDeliveries();
      expect(component.loading).toEqual(true);

      tick(100);
      expect(component.loading).toEqual(false);
      expect(component.deliveries).toEqual([]);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
