import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Component, Injectable, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';

import {
  GoldenLayoutModule,
  ComponentRegistryService,
  MultiWindowService,
  GlOnClose,
  FallbackComponent,
  FailedComponent,
  GoldenLayoutComponent,
  ComponentType,
} from 'ngx-golden-layout';
import * as GoldenLayout from 'golden-layout';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

const ipcRenderer = window.require('electron').ipcRenderer as Electron.IpcRenderer;
ipcRenderer.send('test', `Hello from app.module.ts in window ${window.document.location}`);

const content: GoldenLayout.Config = {
  content: [{
    type: 'row',
    content: [
      {
        type: 'component',
        componentName: 'app-test',
        title: 'My custom title',
      },
      {
        type: 'component',
        componentName: 'app-test',
        title: 'Test 2',
      }
    ]
  }],
};

@MultiWindowService<FooService>()
@Injectable()
export class FooService {
  constructor() {
    console.log(`Create FooService`);
    const result = ipcRenderer.sendSync('test2', `Hello from fooService`);
    console.log('result in foo service', result);
  }
}

@MultiWindowService<TestService>()
@Injectable()
export class TestService {
  public id: string;
  constructor(private _foo: FooService) {
    console.log(`FooService: `, _foo);
    this.id = '_' + Math.random().toString(36).substr(2, 9);
    console.log(`Creating testService, id: ${this.id}`);
  }
}

@Component({
  template: `<div class="spawn-new"></div><golden-layout-root [layout]="layoutConfig$"></golden-layout-root>`,
  selector: `app-root`,
})
export class RootComponent implements OnInit {
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
@Component({
  template: `<h1>Test</h1><span>{{test.id}}</span>`,
  selector: `app-test`,
})
export class TestComponent {
  constructor(public test: TestService) { }
}

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

const COMPONENT_TYPES: ComponentType[] = [
  {
    type: TestComponent,
    name: 'app-test'
  },
  {
    type: TestedComponent,
    name: 'app-tested'
  }
];

@NgModule({
  declarations: [RootComponent, TestComponent, TestedComponent, FailComponent],
  entryComponents: [TestComponent, FailComponent, TestedComponent],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    GoldenLayoutModule.forRoot(COMPONENT_TYPES),
  ],
  providers: [
    TestService,
    FooService,
    {
      provide: FallbackComponent,
      useValue: FailComponent,
    },
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
