import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';

import { AuthComponent } from './auth.component';
import { TitleComponent } from '../title/title.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive } from '@angular/core';

@Directive({
  selector: '[routerLink], [routerLinkActive]'
})
class DummyRouterLinkDirective {}

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let routerSpy;
  let activatedRoute;

  beforeEach(async(() => {
    activatedRoute = { root: { children: [new ActivatedRoute()] } };
    routerSpy = {
      navigate: function() {},
      events: of( new NavigationEnd(0, '', ''))
    };

    TestBed.configureTestingModule({
      declarations: [ AuthComponent, TitleComponent, SpinnerComponent, DummyRouterLinkDirective ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
