import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule, AppChildWindowModule } from './app/app.module';
import { AppConfig } from './environments/environment';
import * as $ from 'jquery';


if (AppConfig.production) {
  enableProdMode();
}

window['$'] = $;

if (!window.opener) {
  const baseRootElem = document.createElement('app-root');
  const script = document.body.querySelector('script');
  document.body.insertBefore(baseRootElem, script);
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
} else {
  const baseAppElem = document.createElement('app-docking');
  const script = document.body.querySelector('script');
  document.body.insertBefore(baseAppElem, script);
  platformBrowserDynamic().bootstrapModule(AppChildWindowModule)
  .catch(err => console.log(err));
}
