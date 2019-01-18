import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgmCoreModule } from '@agm/core';
import { RouterTestingModule } from '@angular/router/testing';

import { CompanySearchComponent } from './company-search.component';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { DummyComponent, asyncData, asyncError } from '../../testing/helpers';

describe('CompanySearchComponent', () => {
  let component: CompanySearchComponent;
  let fixture: ComponentFixture<CompanySearchComponent>;

  const routes =  [
    { path: 'setup-delivery', component: DummyComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), AgmCoreModule.forRoot({})],
      declarations: [ CompanySearchComponent, ModalBasicComponent, DummyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
