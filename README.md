# ngx-golden-layout-electron

This repository contains a minimal working example to get you started using Golden-Layout in electron.
It uses:

- ngx-golden-layout
- Angular 8
- Electron 5

## Getting Started

Clone this repository

``` bash
# First step: Clone and build ngx-golden-layout on the ng8 branch
git clone -b ng8-electron https://github.com/embeddedenterprises/ng6-golden-layout
cd ng6-golden-layout
npm ci
npx ng build ngx-golden-layout

# Second step: Clone and build this repository
cd ..
git clone https://github.com/embeddedenterprises/ngx-golden-layout-electron.git
cd ngx-golden-layout-electron
npm ci

# Third step: Start electron in dev mode
npm start
```
