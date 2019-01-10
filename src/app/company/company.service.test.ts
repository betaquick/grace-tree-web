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
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('companyService should be created', () => {
    expect(companyService).toBeTruthy();
  });

  describe('Get company information', () => {
    const response = {
      company: {
        companyId: 1,
        companyName: 'Test Company',
        companyAddress: 'Test Address',
        city: 'Test City',
        state: 'LA'
      }
    };

    it('Get company info- returns company', () => {
      companyService.getCompanyInfo()
        .subscribe(
          data => {
            expect(data).toEqual(response);
          }
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user/company`);
      expect(req.request.method).toBe('GET');
      req.flush({body: response});
      httpMock.verify();
    });

    it('Error: Get company info - server returns error', () => {
      companyService.getCompanyInfo()
        .subscribe(
          data => fail('Request failed'),
          err => expect(err).toEqual('Something went wrong. Please contact support!')
        );

      const req = httpMock.expectOne(`${AppConfig.API_URL}/user/company`);
      req.flush('System Error', { status: 500, statusText: 'System Error' });
      httpMock.verify();
    });
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
});
