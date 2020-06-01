// See these docs for details on Jest's matcher utils:
// https://facebook.github.io/jest/docs/en/expect.html#thisutils

// import _ from "lodash"

// function toBeAComponent<T>(test: T) {
//   function isAComponent() {
//     return _.isPlainObject(test) && typeof (test as any).render === 'function';
//   }

//   if (isAComponent()) {
//     return {
//       // @ts-ignore
//       message: () => `expected ${(this as any).utils.printReceived(test)} not to be a Vue component`,
//       pass: true
//     };
//   } else {
//     return {
//       message: () =>
//       // @ts-ignore
//       `expected ${(this as any).utils.printReceived(
//           test
//         )} to be a valid Vue component, exported from a .vue file`,
//       pass: false
//     };
//   }
// }

// const toBeAViewComponent = (options, mockInstance = {}) => {
//   if (usesALayout() && definesAPageTitleAndDescription()) {
//     return {
//       message: () =>
//         `expected ${this.utils.printReceived(
//           options
//         )} not to register a local Layout component nor define a page title and meta description`,
//       pass: true
//     };
//   } else {
//     return {
//       message: () =>
//         `expected ${this.utils.printReceived(
//           options
//         )} to register a local Layout component and define a page title and meta description`,
//       pass: false
//     };
//   }

//   function usesALayout() {
//     return options.components && options.components.Layout;
//   }

//   function definesAPageTitleAndDescription() {
//     if (!options.page) return false;
//     const pageObject =
//       typeof options.page === 'function' ? options.page.apply(mockInstance) : options.page;
//     if (!Object.prototype.hasOwnProperty.call(pageObject, 'title')) return false;
//     if (!pageObject.meta) return false;
//     const hasMetaDescription = pageObject.meta.some(
//       (metaObject) =>
//         metaObject.name === 'description' &&
//         Object.prototype.hasOwnProperty.call(metaObject, 'content')
//     );
//     if (!hasMetaDescription) return false;
//     return true;
//   }
// };

// const toBeAViewComponentUsing = (options, mockInstance) => {
//   return customMatchers.toBeAViewComponent.apply(this, [options, mockInstance]);
// };

// const toBeAVuexModule = (options) => {
//   if (isAVuexModule()) {
//     return {
//       message: () => `expected ${this.utils.printReceived(options)} not to be a Vuex module`,
//       pass: true
//     };
//   } else {
//     return {
//       message: () =>
//         `expected ${this.utils.printReceived(
//           options
//         )} to be a valid Vuex module, include state, getters, mutations, and actions`,
//       pass: false
//     };
//   }

//   function isAVuexModule() {
//     return (
//       _.isPlainObject(options) &&
//       _.isPlainObject(options.state) &&
//       _.isPlainObject(options.getters) &&
//       _.isPlainObject(options.mutations) &&
//       _.isPlainObject(options.actions)
//     );
//   }
// };

// https://facebook.github.io/jest/docs/en/expect.html#expectextendmatchers
// (global as any).expect.extend({
//   toBeAComponent
// });
