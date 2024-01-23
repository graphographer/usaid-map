The map highlights where the U.S. Government is working, program education levels for each country, and examples of the type of coordination that is currently happening across Agencies.

## To Develop Locally

Requires node 20 and npm 10.

`npm i` to install all dependencies (you only need to do this once). Then:

`npm run start`

## To Build

`npm run build`

Outputs to `./dist`.

## Data

The `data` directory contains GeoJSON data as well as the SEL/SS measurement data. The latter is mapped from CSV to JSON in a manner that best serves the application's features by Webpack's `csv-loader`; it is further sanitized by a simple ad-hoc loader, `webpack.transform-data-loader.js`, intended primarily to reduce the budle size by including only information that is actually used by the app.

The bundle size could be further reduced by culling the GeoJSON data to include only those countries which are represented in the SEL/SS data.

## Styling

Uses [picocss](https://picocss.com/). We are using the SASS loader to customize Pico mainly to work with the shadow DOM. Crucially, Pico uses the `:root` selector where a fully encapsulated web component app would use `:host`.

To add additional styling, do so in the relevant components by extending the static `styles` property. Be sure to include `Provider` styles via `Provider.styles` (or `super.styles`, see https://lit.dev/docs/components/styles/#inheriting-styles-from-a-superclass). To add a "global" style to the shadow dom, do so in `./src/components/styles/shadow-dom.css`. Similarly, add light dom global styles to `./src/components/styles/light-dom.css`.

CSS variables related to pico are, for example, to be placed in the shadow dom styles, since the entirety of the app exists in the shadow dom.

As all styles are injected via js, will not update until the app is re-built: this happens automatically when developing locally, of course.

NB: The map web component does not use the Pico stylesheet. In fact, they interfere with each other to a certain extent, so it is useful that they can be segregated by use of the shadow DOM.

NBB: Currently, light DOM styles are unused with the expectation that this web component will be embedded or included in a separate HTML document.

## App State

App state is defined in `./src/models/state.ts`. Uses mobx. Web components use Lit and Lit-Mobx, which means that everything re-renders (very efficiently!) when observable state changes. App state is provided to components extended from `Provider` via the `state` property. In reality, app state is injected into `Provider` by means of a Mobx observable box: this is a best practice which, for example, allows for mock data to be used for testing purposes. Examine `./src/app/index.ts` to see this in action.

## Accessibility

An effort has been made to make the app conform to best practices with respect to keyboard navigability. To that end, the map interface has been supplemented with a dropdown menu of filtered country results which will only become visible if a keyboard user tabs into it.
