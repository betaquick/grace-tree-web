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
});
