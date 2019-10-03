import { Component, ViewChild, OnInit } from '@angular/core';
import { GoldenLayoutComponent, ComponentType } from 'ngx-golden-layout';
import * as GoldenLayout from 'golden-layout';
import { of } from 'rxjs';
import { TestComponent, TestedComponent } from './components';

/**
 * Definition of the initial layout
 */
const content: GoldenLayout.Config = {
  content: [],
};

/**
 * Definition of the known component types
 */
export const COMPONENT_TYPES: ComponentType[] = [
  {
    type: TestComponent,
    name: 'app-test'
  },
  {
    type: TestedComponent,
    name: 'app-tested'
  }
];

/**
 * This component is rendered by the router-outlet in the main window and directly
 * in a child window.
 */
@Component({
  template: `<golden-layout-root [layout]="layoutConfig$"></golden-layout-root>`,
  selector: `app-docking`,
})
export class DockingComponent implements OnInit {
  @ViewChild(GoldenLayoutComponent, { static: true })
  cmp: GoldenLayoutComponent;

  layoutConfig$ = of(content);

  // test delayed component construction
  ngOnInit() {
    if (!window.opener) {
      setTimeout(() => {
        this.cmp.createNewComponent({
          componentName: 'app-tested',
          title: 'Custom Title',
          type: 'component',
        });
      }, 1000);
    }
  }
}


/**
 * This component is rendered in the main window and contains the router outlet.
 * It is used to instantiate the golden-layout docking framework dynamically
 * This component won't be rendered when running in a child window.
 */
@Component({
  template: `<router-outlet></router-outlet>`,
  selector: `app-root`,
})
export class RootComponent { }

