import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { TestService } from './services';
import { GlOnClose, FailedComponent, PluginRegistryService, GoldenLayoutComponent, GoldenLayoutComponentHost } from 'ngx-golden-layout';

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
  template: `
    <h1>Load a plugin here</h1>
    <input type="text" #url  placeholder="Enter UMD bundle URL"><br>
    <input type="text" #name placeholder="Enter library name"><br>
    <input type="text" #comp placeholder="Enter component name to create"><br>
    <button (click)="load(name.value, url.value, comp.value)">Load!</button>
  `,
  styles: [`input { width: 300px }`],
  selector: `app-tested`,
})
export class TestedComponent implements OnInit, OnDestroy, GlOnClose {
  constructor(
    public plugin: PluginRegistryService,
    @Inject(GoldenLayoutComponentHost) public host: GoldenLayoutComponent,
  ) { }

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

  public load(libname: string, url: string, componentName: string) {
    this.plugin.startLoadPlugin(libname, url);
    this.plugin.waitForPlugin(libname).then(() => {
      console.log('Loaded library', libname);
      this.host.createNewComponent({
        type: 'component',
        componentName: componentName,
        componentState: { hello: 'Dynamically loaded' },
        title: 'Dynamic ' + componentName,
      });
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
