import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';

import { NewCompanyCrewComponent } from './new-company-crew.component';
import { CompanyService } from '../../company.service';
import { DummyComponent, asyncData, asyncError } from '../../../testing/helpers';
import { RegisterUser } from '../../../shared/models/user-model';

describe('NewCompanyCrewComponent', () => {
  let component: NewCompanyCrewComponent;
  let fixture: ComponentFixture<NewCompanyCrewComponent>;
  let companyServiceStub;
  let toastrStub;
  let routerStub;

  const routes = [
    { path: 'user-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [NewCompanyCrewComponent, DummyComponent],
      providers: [
        { provide: CompanyService, useValue: jasmine.createSpyObj('CompanyService', ['addCompanyCrew']) },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['success', 'error']) }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NewCompanyCrewComponent);
    component = fixture.componentInstance;

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
    expect(companyServiceStub.addCompanyCrew).toBeDefined();
    expect(toastrStub.success).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('create new crew', () => {
    let crew: RegisterUser;
    let navigateStub;
    const response = { crew: { userId: 1 }};

    beforeEach(() => {
      navigateStub = spyOn(routerStub, 'navigate');
      crew = new RegisterUser();
      crew.firstName = 'Test';
      crew.lastName = 'User';
      crew.password = '1q2w3e4r5t';
      crew.confirmPassword = '1q2w3e4r5t';
    });

    it('should successfully create a new crew - navigate to /company/crews', fakeAsync(() => {
      companyServiceStub.addCompanyCrew.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.crew = crew;
      component.addCompanyCrew();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails creation of a new crew - show toast error', fakeAsync(() => {
      companyServiceStub.addCompanyCrew.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.crew = crew;
      component.addCompanyCrew();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(navigateStub.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
