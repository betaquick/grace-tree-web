import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { AgmCoreModule } from '@agm/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';
import { UserStatus } from '@betaquick/grace-tree-constants';

import { CompanySearchComponent } from './company-search.component';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { CompanyService } from '../company.service';
import { BusinessInfo } from '../../shared/models/company-model';


describe('CompanySearchComponent', () => {
  let component: CompanySearchComponent;
  let fixture: ComponentFixture<CompanySearchComponent>;
  let companyServiceStub;
  let toastrStub;
  let routerStub;
  const company = {
    companyName: 'Test Company',
    companyAddress: 'Test Address',
    city: 'City',
    state: 'AL',
    zip: '23401',
    website: 'example.com',
    latitude: '37.4219931',
    longitude: '-122.0851244'
  };

  const event = {
    target: {
      checked: true
    }
  };
  const response = {
    users: [{
      userId: 1,
      firstName: 'Test',
      lastName: 'Recipient',
      street: 'Test Address',
      city: 'City',
      state: 'AL',
      zip: '23401',
      website: 'example.com',
      latitude: 37.4219931,
      longitude: -122.0851244,
      status: UserStatus.Pause
    }, {
      userId: 2,
      firstName: 'Test',
      lastName: 'Recipient 2',
      street: 'Test Address',
      city: 'City',
      state: 'AL',
      zip: '23401',
      website: 'example.com',
      latitude: 37.4219931,
      longitude: -122.0851244,
      status: UserStatus.Ready
    }],
    coordinates: {
      latitude: 37.4219931,
      longitude: -122.0851244
    }
  };

  const routes =  [
    { path: 'setup-delivery', component: DummyComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyA-cbjuj3-Cr63P-Y-6GfSRPcLh5FZISfE'
        }),
        ToastrModule.forRoot({}),
        FormsModule,
        CustomFormsModule
      ],
      declarations: [CompanySearchComponent, ModalBasicComponent, DummyComponent],
      providers: [
        {
          provide: CompanyService,
          useValue: jasmine.createSpyObj('CompanyService', ['searchUsers', 'scheduleDelivery'])
        },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['success', 'error']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySearchComponent);
    component = fixture.componentInstance;
    component.company = company;

    routerStub = TestBed.get(Router);
    companyServiceStub = TestBed.get(CompanyService);
    toastrStub = TestBed.get(ToastrService);

    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(companyServiceStub.searchUsers).toBeDefined();
    expect(companyServiceStub.scheduleDelivery).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('Get company lng/lat', () => {
    it('should successfully get company lng/lat', fakeAsync(() => {
      expect(component.loading).toEqual(false);
      component.getGeocode();
      tick(100);
      expect(component.lat).toEqual(parseFloat(company.latitude));
      expect(component.lng).toEqual(parseFloat(company.longitude));
    }));

    it('Error: fails fetching company lng/lat - show toast error', fakeAsync(() => {
      component.lat = null;
      component.lng = null;
      component.company = new BusinessInfo();
      expect(component.loading).toEqual(false);
      component.getGeocode();
      tick(100);
      expect(component.lat).toEqual(null);
      expect(component.lng).toEqual(null);
    }));
  });

  describe('Search recipients', () => {
    beforeEach(fakeAsync(() => {
      component.company = company;
    }));

    it('should successfully fetch all available recipient - show toast success', fakeAsync(() => {
      companyServiceStub.searchUsers.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.search();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(component.recipients).toEqual(response.users);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails fetaching recipients - show toast error', fakeAsync(() => {
      companyServiceStub.searchUsers.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.search();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });

  describe('Delivery request tests', () => {
    beforeEach(fakeAsync(() => {
      component.loading = false;
      component.company = company;
      event.target.checked = true;
      companyServiceStub.searchUsers.and.returnValue(asyncData(response));
      component.search();
      tick(100);
    }));

    it('should successfully select all recipients in Pause state - show toast success', fakeAsync(() => {
      component.toggleAllUsers(event);
      expect(component.isUserSelected()).toEqual(true);
    }));

    it('should successfully deselect all recipients in Pause state - show toast success', fakeAsync(() => {
      event.target.checked = false;
      component.toggleAllUsers(event);
      expect(component.isUserSelected()).toEqual(false);
    }));

    it('should successfully send delivery request to recipients in pause state - show toast success', fakeAsync(() => {
      companyServiceStub.scheduleDelivery.and.returnValue(asyncData(response.users[1]));
      component.toggleAllUsers(event);
      expect(component.loading).toEqual(false);
      component.sendRequest();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails sending delivery requests - show toast error', fakeAsync(() => {
      companyServiceStub.scheduleDelivery.and.returnValue(asyncError(new Error()));
      component.toggleAllUsers(event);
      expect(component.loading).toEqual(false);
      component.sendRequest();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
