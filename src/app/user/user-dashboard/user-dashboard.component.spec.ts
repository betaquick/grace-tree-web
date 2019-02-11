import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';
import { UiSwitchModule } from 'ngx-ui-switch';
import { UserStatus } from '@betaquick/grace-tree-constants';

import { UserDashboardComponent } from './user-dashboard.component';
import { UserService } from '../user.service';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { DeliveryComponent } from '../../shared/delivery/delivery.component';

describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;
  let userServiceStub;
  let toastrStub;
  let routerStub;
  const user = {
    firstName: 'Test',
    lastName: 'Account',
    emails: [{
      emailAddress: 'test@email.com',
      primary: true
    }],
    phones: [{
      phoneNumber: '1234567890',
      primary: true,
    }],
    status: UserStatus.Pause
  };
  const response = [{
    companyName: 'Test Account',
    companyId: 1,
  }];

  const routes = [
    { path: 'user-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {
    userServiceStub = jasmine.createSpyObj('UserService', ['updateStatus', 'getPendingDeliveries', 'getRecentDeliveries']);
    userServiceStub = {
      ...userServiceStub,
      user
    };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        FormsModule,
        CustomFormsModule,
        UiSwitchModule,
        ToastrModule.forRoot({})
      ],
      declarations: [
        UserDashboardComponent,
        DummyComponent,
        ModalBasicComponent,
        DeliveryComponent
      ],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['success', 'error']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;

    routerStub = TestBed.get(Router);
    userServiceStub = TestBed.get(UserService);
    toastrStub = TestBed.get(ToastrService);

    userServiceStub.getPendingDeliveries.and.returnValue(asyncData(response));
    userServiceStub.getRecentDeliveries.and.returnValue(asyncData(response));
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(userServiceStub.getPendingDeliveries).toBeDefined();
    expect(userServiceStub.getRecentDeliveries).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('list pending and recent deliveries', () => {
    it('should successfully list recent and pending deliveries ', fakeAsync(() => {
      expect(component.pendingCount).toEqual(response.length);
      expect(component.deliveries).toEqual(response);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails listing recent and pending deliveries - show toast error', fakeAsync(() => {
      component.deliveries = [];
      component.pendingCount = 0;
      userServiceStub.getPendingDeliveries.and.returnValue(asyncError(new Error()));
      userServiceStub.getRecentDeliveries.and.returnValue(asyncError(new Error()));

      component.getPendingDeliveries();
      component.getRecentDeliveries();

      tick(100);
      expect(component.pendingCount).toEqual(0);
      expect(component.deliveries).toEqual([]);
      expect(toastrStub.error.calls.count()).toEqual(2);
    }));
  });
});
