/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateModule } from '@ngx-translate/core';

import { APP_BASE_HREF } from '@angular/common';

describe('App: GraceTreeWeb', () => {
  beforeEach(() => {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    });
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
