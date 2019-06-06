import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';
import { MultiWindowInit } from 'ngx-golden-layout';
import * as $ from 'jquery';


if (AppConfig.production) {
  enableProdMode();
}


MultiWindowInit();
window['$'] = $;
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
