import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { TestService } from './services';
import { GlOnClose, FailedComponent } from 'ngx-golden-layout';

/**
 * This is one component which will be instantiated by golden-layout
 */
@Component({
  template: `<h1>Test</h1><span>{{test.id}}</span>`,
  selector: `app-test`,
})
export class TestComponent {
  constructor(public test: TestService) { }
}

/**
 * This is the second component which will be instantiated by golden-layout
 */
@Component({
  template: `<h1>Test2</h1>`,
  selector: `app-tested`,
})
export class TestedComponent implements OnInit, OnDestroy, GlOnClose {
  constructor() { }

  public ngOnInit(): void {
    (window.opener || window).console.log(`ngoninit`);
  }
  public ngOnDestroy(): void {
    (window.opener || window).console.log(`ngondestroy`);
  }

  public glOnClose(): Promise<void> {
    console.log(`glOnClose`);
    return new Promise((resolve, reject) => {
      console.log(`glonclose promise`);
      setTimeout(() => {
        console.log(`resolving`);
        resolve();
      }, 1000);
    });
  }
}

/* Provide a fallback for components which couldn't be found. */
@Component({
  template: `<h1>Failed to load {{componentName}}</h1>`,
  selector: `app-failed`,
})
export class FailComponent {
  constructor(@Inject(FailedComponent) public componentName: string) { }
}

/**
 * This component is the landing page which will be displayed
 * prior to loading golden-layout.
 */
@Component({
  template: `<h1>This is a landing page</h1><a routerLink="/docking">Click here to go to the docking</a>`,
  selector: `app-landing-page`,
})
export class LandingPageComponent {
  constructor() { }
}
