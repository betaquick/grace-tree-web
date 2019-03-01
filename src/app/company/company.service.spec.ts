import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PhoneTypes } from '@betaquick/grace-tree-constants';

import { CompanyService } from './company.service';
import { RegisterUser } from '../shared/models/user-model';
import { AppConfig } from '../app.config';
import { BusinessInfo } from '../shared/models/company-model';


describe('CompanyService', () => {
  let httpMock;
  let companyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [CompanyService]
    });
    httpMock = TestBed.get(HttpTestingController);
    companyService = TestBed.get(CompanyService);
    companyService.company = null;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('companyService should be created', () => {
    expect(companyService).toBeTruthy();
  });

  describe('update company profile', () => {
    let user: RegisterUser;
    let company: BusinessInfo;
    const response = {
      user: {
        userId: 1
      },
      company: {
        companyId: 1
      }
    };

    beforeEach(() => {
      user = new RegisterUser();
      user.firstName = 'Test';
      user.lastName = 'User';
      user.password = '1q2w3e4r5t';
      user.confirmPassword = '1q2w3e4r5t';
      user.emails = [{
        emailAddress: 'test@email.com',
        primary: true
      }];
      user.phones = [{
        phoneNumber: '1234567890',
        primary: true,
        phoneType: PhoneTypes.MOBILE
      }];

      company = new BusinessInfo();
      company.companyName = 'Test Company';
      company.companyAddress = 'Test Address';
      company.city = 'City';
      company.state = 'AL';
      company.zip = '23401';
      company.website = 'example.com';
    });

    it('update company profile - returns company and user', () => {
      companyService.updateCompanyInfo(company, user)
        .subscribe(
          data => {
            expect(data).toEqual(response);
          }
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user/company`);
      expect(req.request.method).toBe('PUT');
      req.flush({body: response});
      httpMock.verify();
    });

    it('Error: update company profile - server returns error', () => {
      companyService.updateCompanyInfo(company, user)
        .subscribe(
          data => fail('Request failed'),
          err => expect(err).toEqual('Something went wrong. Please contact support!')
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user/company`);
      req.flush('System Error', { status: 500, statusText: 'System Error' });
      httpMock.verify();
    });
  });

  describe('Get company crews', () => {
    const response = {
      crews: [{
        firstName: 'Test',
        lastName: 'Account',
        email: 'test@email.com',
      }]
    };

    it('Get company crews - returns crews', () => {
      companyService.getCompanyCrews()
        .subscribe(
          data => {
            expect(data).toEqual(response.crews);
          }
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user/company/crews`);
      expect(req.request.method).toBe('GET');
      req.flush({body: response});
      httpMock.verify();
    });

    it('Error: Get company crews - server returns error', () => {
      companyService.getCompanyCrews()
        .subscribe(
          data => fail('Request failed'),
          err => expect(err).toEqual('Something went wrong. Please contact support!')
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user/company/crews`);
      req.flush('System Error', { status: 500, statusText: 'System Error' });
      httpMock.verify();
    });
  });

  describe('add company crew', () => {
    let crew: RegisterUser;
    const response = {
      crew: {
        userId: 1
      }
    };

    beforeEach(() => {
      crew = new RegisterUser();
      crew.firstName = 'Test';
      crew.lastName = 'User';
      crew.password = '1q2w3e4r5t';
      crew.confirmPassword = '1q2w3e4r5t';
    });

    it('add company crew - returns crew', () => {
      companyService.addCompanyCrew(crew)
        .subscribe(
          data => {
            expect(data.body).toEqual(response);
          }
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user/company/crews`);
      expect(req.request.method).toBe('POST');
      req.flush({body: response});
      httpMock.verify();
    });

    it('Error: add company crew - server returns error', () => {
      companyService.addCompanyCrew(crew)
        .subscribe(
          data => fail('Request failed'),
          err => expect(err).toEqual('Something went wrong. Please contact support!')
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user/company/crews`);
      req.flush('System Error', { status: 500, statusText: 'System Error' });
      httpMock.verify();
    });
  });

  describe('delete company crew', () => {
    const response = {
      crew: {
        userId: 1
      }
    };

    it('delete company crew - returns crew', () => {
      companyService.deleteCompanyCrew(1)
        .subscribe(
          data => {
            expect(data.body).toEqual(response);
          }
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user/company/crews/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({body: response});
      httpMock.verify();
    });

    it('Error: delete company crew - server returns error', () => {
      companyService.deleteCompanyCrew(1)
        .subscribe(
          data => fail('Request failed'),
          err => expect(err).toEqual('Something went wrong. Please contact support!')
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user/company/crews/1`);
      req.flush('System Error', { status: 500, statusText: 'System Error' });
      httpMock.verify();
    });
  });
});
