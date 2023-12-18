The map highlights where the U.S. Government is working, program education levels for each country, and examples of the type of coordination that is currently happening across Agencies.

## To Develop Locally

Requires node 20 and npm 10.

`npm i` to install all dependencies (you only need to do this once). Then:

`npm run start`

## To Build

`npm run build`

Outputs to `./dist`.

## Styling

Uses [picocss](https://picocss.com/). The complete stylesheet is injected both into the light dom as well as into the shadow doms of web components extended from `Provider`.

To add additional styling, do so in the relevant components by extending the static `styles` property. Be sure to include `Provider` styles via `Provider.styles` (or `super.styles`, see https://lit.dev/docs/components/styles/#inheriting-styles-from-a-superclass). To add a "global" style to the shadow dom, do so in `./src/components/styles/shadow-dom.css`. Similarly, add light dom global styles to `./src/components/styles/light-dom.css`.

CSS variables related to pico are, for example, to be placed in the shadow dom styles, since the entirety of the app exists in the shadow dom.

There is currently no SASS or SCSS compiler.

As all styles are injected via js, will not update until the app is re-built.

## App State

App state is defined in `./src/models/state.ts`. Uses mobx. Web components use Lit and Lit-Mobx, which means that everything re-renders when observable state changes. App state is provided to components extended from `Provider` via the `state` property. In reality, app state is injected into `Provider` by means of a Mobx observable box: this is a best practice which, for example, allows for mock data to be used for testing purposes. Examine `./src/app/index.ts` to see this in action.
