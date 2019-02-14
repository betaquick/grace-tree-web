import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';

import { UserDeliveriesComponent } from './user-deliveries.component';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { UserService } from '../user.service';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { DeliveryComponent } from '../../shared/delivery/delivery.component';

describe('UserDeliveriesComponent', () => {
  let component: UserDeliveriesComponent;
  let fixture: ComponentFixture<UserDeliveriesComponent>;
  let userServiceStub;
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
      declarations: [
        UserDeliveriesComponent,
        DummyComponent,
        ModalBasicComponent,
        DeliveryComponent
      ],
      providers: [
        { provide: UserService, useValue: jasmine.createSpyObj('UserService', ['getDeliveries', 'updateDeliveryStatus']) },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['error']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDeliveriesComponent);
    component = fixture.componentInstance;

    routerStub = TestBed.get(Router);
    userServiceStub = TestBed.get(UserService);
    toastrStub = TestBed.get(ToastrService);

    userServiceStub.getDeliveries.and.returnValue(asyncData(deliveries));
    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(userServiceStub.getDeliveries).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('list user deliveries', () => {
    it('should successfully list user deliveries ', fakeAsync(() => {
      expect(component.deliveries).toEqual(deliveries);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails listing user deliveries - show toast error', fakeAsync(() => {
      component.deliveries = [];
      userServiceStub.getDeliveries.and.returnValue(asyncError(new Error()));

      component.getDeliveries();
      expect(component.loading).toEqual(true);

      tick(100);
      expect(component.loading).toEqual(false);
      expect(component.deliveries).toEqual([]);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
