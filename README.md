# Deekeeper-FrontEnd
The ClearML Web Application Rewrite Project \
target is migrate the clearml-web application which wrote by Angular.js to react 
## Project Structure
```text
api/   // request api
assets/  // web assets: font, icon, image
components/ // useful ui component 
hooks/ // custom react hooks
i18n/  // i18n translation data and define
layout/   // web application layout component like menu header....
main.tsx   //entry file
router/   //router define
store/    // global store by redux
styles/   // global styles
types/    // data types , interface, enums ...
utils/   // useful tool function
views/   // page views 
```
## Project Scripts
Project use pnpm as project package manager please install pnmp before develop
1. init project
```text
pnpm i
```
2. start project
```text
npm run dev
```
3. build project
```text
npm run build
```