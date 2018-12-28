import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { states } from '@betaquick/grace-tree-constants';

import { AddDeliveryComponent } from './add-delivery.component';
import { AuthService } from '../../auth.service';
import { DummyComponent, asyncData, asyncError } from '../../../testing/helpers';
import { DeliveryInfo } from '../../../shared/models/user-model';

describe('AddDeliveryComponent', () => {
  let component: AddDeliveryComponent;
  let fixture: ComponentFixture<AddDeliveryComponent>;
  let authServiceStub;
  let toastrStub;
  let routerStub;

  const routes =  [
    { path: 'company-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];
  const products = [{
    active: 1,
    createdAt: "2018-12-22T08:54:17.000Z",
    productCode: "chips",
    productDesc: "Wood Chips",
    productId: 1,
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [ AddDeliveryComponent, DummyComponent ],
      providers: [
        {provide: AuthService, useValue: jasmine.createSpyObj('authServiceStub', ['addDeliveryInfo', 'getProducts'])},
        {provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['error'])}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDeliveryComponent);
    component = fixture.componentInstance;
    authServiceStub = TestBed.get(AuthService);
    routerStub = TestBed.get(Router);
    toastrStub = TestBed.get(ToastrService);

    authServiceStub.getProducts.and.returnValue(asyncData(products));
    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create add delivery component', fakeAsync(() => {
    expect(component).toBeTruthy();
    expect(authServiceStub.getProducts).toBeDefined();
    expect(authServiceStub.addDeliveryInfo).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  }));

  describe('add delivery info', () => {
    let deliveryInfo: DeliveryInfo;
    let navigateStub;
    const response = {
      delivery: {
        userId: 1, 
        userProducts: [{
          productId: 1,
          status: true
        }],
        address: {
          street: 'Test',
          state: states[0].abbr,
          city: 'Test',
          zip: '23401'
        }
      }
    };

    beforeEach(() => {
      navigateStub = spyOn(routerStub, 'navigate');
      deliveryInfo = new DeliveryInfo();
      deliveryInfo.address = {
        street: 'Test',
        state: states[0].abbr,
        city: 'Test',
        zip: '23401'
      };
      deliveryInfo.userProducts = [{
        productId: 1,
        status: true
      }];
    });

    it('should successfully add delivery info - navigate to /user', fakeAsync(() => {
      authServiceStub.addDeliveryInfo.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.deliveryInfo = deliveryInfo;
      component.stateArray = states;
      component.addDeliveryInfo();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails adding delivery info - show toast error', fakeAsync(() => {
      authServiceStub.addDeliveryInfo.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.deliveryInfo = deliveryInfo;
      component.stateArray = states;
      component.addDeliveryInfo();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
