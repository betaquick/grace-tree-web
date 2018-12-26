import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';

describe('AppComponent', () => {
  let fixture;
  let app;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        SpinnerComponent
      ],
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        app = fixture.debugElement.componentInstance;
      });
  }));

  it(`should have as title 'Grace Tree'`, async(() => {
    app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    expect(app.title).toEqual('Grace Tree');
  }));
});
