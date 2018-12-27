import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';

import { AddBusinessComponent } from './add-business.component';
import { AuthService } from '../../auth.service';
import { DummyComponent, asyncData, asyncError } from '../../../testing/helpers';
import { BusinessInfo } from '../../../shared/models/company-model';
import { RoleTypes, states } from '@betaquick/grace-tree-constants';

describe('AddBusinessComponent', () => {
  let component: AddBusinessComponent;
  let fixture: ComponentFixture<AddBusinessComponent>;
  let authServiceStub;
  let toastrStub;
  let routerStub;

  const routes =  [
    { path: 'user-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [ AddBusinessComponent, DummyComponent ],
      providers: [
        {provide: AuthService, useValue: jasmine.createSpyObj('authServiceStub', ['addBusinessInfo'])},
        {provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['error'])}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBusinessComponent);
    component = fixture.componentInstance;
    authServiceStub = TestBed.get(AuthService);
    routerStub = TestBed.get(Router);
    toastrStub = TestBed.get(ToastrService);
    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create add business component', () => {
    expect(component).toBeTruthy();
    expect(authServiceStub.addBusinessInfo).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('register new company', () => {
    let businessInfo: BusinessInfo;
    let navigateStub;
    const response = {company: {companyId: 1, companyName: 'Test Company'}};

    beforeEach(() => {
      navigateStub = spyOn(routerStub, 'navigate');
      businessInfo = new BusinessInfo();
      businessInfo.companyName = 'Test Company';
      businessInfo.companyAddress = 'Test Address';
      businessInfo.city = 'City';
      businessInfo.state = states[0].abbr;
      businessInfo.zip = '23401';
      businessInfo.website = 'example.com';
    });

    it('should successfully add a new business - navigate to company', fakeAsync(() => {
      authServiceStub.addBusinessInfo.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.businessInfo = businessInfo;
      component.stateArray = states;
      component.addBusinessInfo();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails to add a new business - show toast error', fakeAsync(() => {
      authServiceStub.addBusinessInfo.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.businessInfo = businessInfo;
      component.stateArray = states;
      component.addBusinessInfo();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
