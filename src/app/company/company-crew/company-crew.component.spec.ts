import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';

import { CompanyCrewComponent } from './company-crew.component';
import { CompanyService } from '../company.service';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';

describe('CompanyCrewComponent', () => {
  let component: CompanyCrewComponent;
  let fixture: ComponentFixture<CompanyCrewComponent>;
  let companyServiceStub;
  let toastrStub;
  let routerStub;
  const crews = [{
    firstName: 'Test',
    lastName: 'Account',
    email: 'test@email.com',
  }];

  const routes = [
    { path: 'user-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [CompanyCrewComponent, DummyComponent],
      providers: [
        { provide: CompanyService, useValue: jasmine.createSpyObj('CompanyService', ['getCompanyCrews', 'deleteCompanyCrew']) },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['success', 'error']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCrewComponent);
    component = fixture.componentInstance;

    routerStub = TestBed.get(Router);
    companyServiceStub = TestBed.get(CompanyService);
    toastrStub = TestBed.get(ToastrService);

    companyServiceStub.getCompanyCrews.and.returnValue(asyncData(crews));
    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(companyServiceStub.getCompanyCrews).toBeDefined();
    expect(companyServiceStub.deleteCompanyCrew).toBeDefined();
    expect(toastrStub.success).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('list crews', () => {
    it('should successfully list all crews ', fakeAsync(() => {
      expect(component.crews).toEqual(crews);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails listing all crews - show toast error', fakeAsync(() => {
      component.crews = [];
      companyServiceStub.getCompanyCrews.and.returnValue(asyncError(new Error()));

      component.getCompanyCrews();
      expect(component.loading).toEqual(true);

      tick(100);
      expect(component.loading).toEqual(false);
      expect(component.crews).toEqual([]);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });

  describe('delete crew', () => {
    const response = { crew: { userId: 1 }};

    it('should successfully delete a crew ', fakeAsync(() => {
      companyServiceStub.deleteCompanyCrew.and.returnValue(asyncData(response));
      component.deleteCompanyCrew(1);
      expect(component.loading).toEqual(true);

      tick(100);
      expect(component.loading).toEqual(false);
      expect(toastrStub.success.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails deleting a crew - show toast error', fakeAsync(() => {
      companyServiceStub.deleteCompanyCrew.and.returnValue(asyncError(new Error()));

      component.deleteCompanyCrew(1);
      expect(component.loading).toEqual(true);

      tick(100);
      expect(component.loading).toEqual(false);
      expect(toastrStub.success.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
