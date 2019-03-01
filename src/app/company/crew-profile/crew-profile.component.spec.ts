import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CustomFormsModule } from 'ng5-validation';

import { CrewProfileComponent } from './crew-profile.component';
import { CompanyService } from '../company.service';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';
import { RegisterUser } from '../../shared/models/user-model';

describe('CrewProfileComponent', () => {
  let component: CrewProfileComponent;
  let fixture: ComponentFixture<CrewProfileComponent>;
  let companyServiceStub;
  let toastrStub;
  let routerStub;
  const response = {
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

  const routes = [
    { path: 'user-registration', component: DummyComponent },
    { path: 'login', component: DummyComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, CustomFormsModule, ToastrModule.forRoot({})],
      declarations: [
        CrewProfileComponent,
        DummyComponent
      ],
      providers: [
        { provide: CompanyService, useValue: jasmine.createSpyObj('CompanyService', ['updateProfile']) },
        { provide: ToastrService, useValue: jasmine.createSpyObj('toastrStub', ['success', 'error']) }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CrewProfileComponent);
    component = fixture.componentInstance;

    routerStub = TestBed.get(Router);
    companyServiceStub = TestBed.get(CompanyService);
    toastrStub = TestBed.get(ToastrService);

    component.user = response;

    fixture.detectChanges();
  }));

  beforeEach(async(inject([Router], (router: Router) => {
    routerStub = router;
  })));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(companyServiceStub.updateProfile).toBeDefined();
    expect(toastrStub.success).toBeDefined();
    expect(toastrStub.error).toBeDefined();
    expect(routerStub).toBeDefined();
    expect(toastrStub).toBeDefined();
  });

  describe('Update crew profile', () => {
    it('should successfully update crew profile - show toast success', fakeAsync(() => {
      companyServiceStub.updateProfile.and.returnValue(asyncData(response));
      expect(component.loading).toEqual(false);
      component.updateprofile();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(1);
      expect(toastrStub.error.calls.count()).toEqual(0);
    }));

    it('Error: fails updating crew profile - show toast error', fakeAsync(() => {
      companyServiceStub.updateProfile.and.returnValue(asyncError(new Error()));
      expect(component.loading).toEqual(false);
      component.updateprofile();
      expect(component.loading).toEqual(true);
      tick(100);
      expect(toastrStub.success.calls.count()).toEqual(0);
      expect(toastrStub.error.calls.count()).toEqual(1);
    }));
  });
});
