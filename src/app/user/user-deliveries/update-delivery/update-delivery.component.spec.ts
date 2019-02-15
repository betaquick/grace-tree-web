import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';
import { DeliveryStatusCodes } from '@betaquick/grace-tree-constants';

import { UpdateDeliveryComponent } from './update-delivery.component';
import { DummyComponent, asyncData, asyncError } from '../../../testing/helpers';
import { UserService } from '../../user.service';

describe('UpdateDeliveryComponent', () => {
  let component: UpdateDeliveryComponent;
  let fixture: ComponentFixture<UpdateDeliveryComponent>;

  let userServiceStub;
  let toastrStub;
  let routerStub;
  let navigateStub;

  const user = {
    userId: 1,
    email: 'admin@fccc.net',
    firstName: 'Test',
    lastName: 'User',
    addresses: [{
      street: 'Test street'
    }]
  };
  const delivery = {
    deliveryId: 1,
    companyName: 'Test Company',
    firstName: 'Test',
    lastName: 'User',
  };
  const userProducts = [{
    productId: 1,
    status: true
  }];

  const routes = [
    { path: 'user-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent },
    { path: 'user/deliveries', component: DummyComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [UpdateDeliveryComponent, DummyComponent],
      providers: [
        { provide: UserService, useValue: jasmine.createSpyObj('UserService', ['getDelivery', 'updateDeliveryStatus', 'getUserProducts']) },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['success', 'error']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDeliveryComponent);
    component = fixture.componentInstance;

    routerStub = TestBed.get(Router);
    userServiceStub = TestBed.get(UserService);
    toastrStub = TestBed.get(ToastrService);

    userServiceStub.getDelivery.and.returnValue(asyncData(delivery));
    userServiceStub.getUserProducts.and.returnValue(asyncData(userProducts));
    component.user = user;
    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
    navigateStub = spyOn(routerStub, 'navigate');
  })));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(userServiceStub.getDelivery).toBeDefined();
    expect(userServiceStub.getUserProducts).toBeDefined();
    expect(toastrStub.success).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('Get user delivery and products', () => {
    it('should successfully get user delivery', fakeAsync(() => {
      expect(component.loading).toEqual(false);
      component.getDelivery(1);
      tick(100);
      expect(userServiceStub.getDelivery.calls.count()).toEqual(1);
      expect(component.delivery).toEqual(delivery);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails getting user delivery - show toast error', fakeAsync(() => {
      component.delivery = null;
      userServiceStub.getDelivery.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.getDelivery(1);
      tick(100);
      expect(userServiceStub.getDelivery.calls.count()).toEqual(1);
      expect(component.delivery).toEqual(null);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));

    it('should successfully get user products', fakeAsync(() => {
      expect(component.loading).toEqual(false);
      component.getUserProducts();
      tick(100);
      expect(userServiceStub.getUserProducts.calls.count()).toEqual(1);
      expect(component.userProducts).toEqual(userProducts);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails getting user products - show toast error', fakeAsync(() => {
      component.delivery = null;
      userServiceStub.getUserProducts.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.getUserProducts();
      tick(100);
      expect(userServiceStub.getUserProducts.calls.count()).toEqual(1);
      expect(component.delivery).toEqual(null);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });

  describe('Update a delivery', () => {
    it('should successfully update a delivery - show toast success', fakeAsync(() => {
      userServiceStub.updateDeliveryStatus.and.returnValue(asyncData(delivery));
      expect(component.loading).toEqual(false);
      component.deliveryId = 1;
      component.statusCode = DeliveryStatusCodes.Delivered;
      component.updateDelivery();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails updating a delivery - show toast error', fakeAsync(() => {
      userServiceStub.updateDeliveryStatus.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.deliveryId = 1;
      component.statusCode = DeliveryStatusCodes.Delivered;
      component.updateDelivery();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
