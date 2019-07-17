import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  GoldenLayoutModule,
} from 'ngx-golden-layout';
import { CommonModule } from '@angular/common';
import { TestComponent, TestedComponent, FailComponent, LandingPageComponent } from './components';
import { TestService, FooService } from './services';
import { DockingComponent, COMPONENT_TYPES, RootComponent } from './docking.component';

const ipcRenderer = window.require('electron').ipcRenderer as Electron.IpcRenderer;
ipcRenderer.send('test', `Hello from app.module.ts in window ${window.document.location}`);

const ROUTES: Routes = [
  { path: 'docking', component: DockingComponent },
  { path: 'main', component: LandingPageComponent },
  { path: '', redirectTo: 'main', pathMatch: 'full' }
];

const COMPONENTS = [
  DockingComponent,
  TestComponent,
  TestedComponent,
  FailComponent,
];

/**
 * This module contains all components, imports and other things
 * that need to be used in main and child windows.
 *
 * It must be a separate module for the production build to work.
 * Add your components to declarations, entryComponents and exports, respectively.
 */
@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    GoldenLayoutModule.forRoot(COMPONENT_TYPES, FailComponent),
  ],
  exports: COMPONENTS,
})
export class AppComponentModule {}

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(ROUTES, {
    useHash: true,
  })],
})
export class AppRoutingModule {}

@NgModule({
  declarations: [LandingPageComponent, RootComponent],
  entryComponents: [LandingPageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppComponentModule,
    AppRoutingModule,
  ],
  providers: [
    TestService,
    FooService,
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppComponentModule,
    // No routing module here
  ],
  providers: [
    TestService,
    FooService,
  ],
  bootstrap: [DockingComponent] // Directly bootstrap the docking component
})
export class AppChildWindowModule { }

