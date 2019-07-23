import { MultiWindowService } from 'ngx-golden-layout';
import { Injectable } from '@angular/core';

const ipcRenderer = window.require('electron').ipcRenderer as Electron.IpcRenderer;

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
