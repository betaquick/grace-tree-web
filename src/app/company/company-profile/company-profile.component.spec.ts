import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';

import { CompanyProfileComponent } from './company-profile.component';
import { CompanyService } from '../company.service';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { RegisterUser } from '../../shared/models/user-model';

describe('CompanyProfileComponent', () => {
  let component: CompanyProfileComponent;
  let fixture: ComponentFixture<CompanyProfileComponent>;
  let companyServiceStub;
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
    }]
  } as RegisterUser;
  const company = {
    companyName: 'Test Company',
    companyAddress: 'Test Address',
    city: 'City',
    state: 'AL',
    zip: '23401',
    website: 'example.com'
  };

  const routes = [
    { path: 'user-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {
    companyServiceStub = jasmine.createSpyObj('CompanyService', ['updateCompanyInfo', 'getCompanyInfo']);
    companyServiceStub = {
      ...companyServiceStub,
      user,
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [CompanyProfileComponent, DummyComponent],
      providers: [
        { provide: CompanyService, useValue: companyServiceStub },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['success', 'error']) }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CompanyProfileComponent);
    component = fixture.componentInstance;

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
    expect(companyServiceStub.updateCompanyInfo).toBeDefined();
    expect(toastrStub.success).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('Update company profile', () => {
    it('should successfully update company profile - show toast success', fakeAsync(() => {
      companyServiceStub.updateCompanyInfo.and.returnValue(asyncData({ company, user }));
      expect(component.loading).toEqual(false);
      component.user = user;
      component.updateCompanyInfo();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails updating company profile - show toast error', fakeAsync(() => {
      companyServiceStub.updateCompanyInfo.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.user = user;
      component.updateCompanyInfo();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
