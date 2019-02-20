import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { AgmCoreModule } from '@agm/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng5-validation';

import { CompanySearchComponent } from './company-search.component';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { CompanyService } from '../company.service';


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
    latitude: 37.4219931,
    longitude: -122.0851244
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
      longitude: -122.0851244
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
      declarations: [ CompanySearchComponent, ModalBasicComponent, DummyComponent ],
      providers: [
        { provide: CompanyService, useValue: jasmine.createSpyObj('CompanyService', ['searchUsers', 'getCompanyInfo']) },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['error']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySearchComponent);
    component = fixture.componentInstance;
    // component.user = user;

    routerStub = TestBed.get(Router);
    companyServiceStub = TestBed.get(CompanyService);
    toastrStub = TestBed.get(ToastrService);

    companyServiceStub.getCompanyInfo.and.returnValue(asyncData(company));
    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(companyServiceStub.getCompanyInfo).toBeDefined();
    expect(companyServiceStub.searchUsers).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('Get company lng/lat', () => {
    it('should successfully get company info', fakeAsync(() => {
      expect(component.loading).toEqual(false);
      component.getGeocode();
      tick(100);
      expect(companyServiceStub.getCompanyInfo.calls.count()).toEqual(2);
      expect(component.lat).toEqual(company.latitude);
      expect(component.lng).toEqual(company.longitude);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails fetching company lng/lat - show toast error', fakeAsync(() => {
      component.lat = null;
      component.lng = null;
      companyServiceStub.getCompanyInfo.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.getGeocode();
      tick(100);
      expect(companyServiceStub.getCompanyInfo.calls.count()).toEqual(2);
      expect(component.lat).toEqual(null);
      expect(component.lng).toEqual(null);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });

  describe('Search recipients', () => {
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
});
