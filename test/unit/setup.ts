// import fs from 'fs'
// import path from 'path'
import Vue from 'vue';
// import Vuex from 'vuex'
import axios from 'axios';
// import deepCopy from "deepcopy"

// Make console.error throw, so that Jest tests fail
// eslint-disable-next-line no-console
const error = console.error;
// eslint-disable-next-line no-console
console.error = (...args: any[]) => {
  error.call(console, args);
  // NOTE: You can whitelist some `console.error` messages here
  //       by returning if the `message` value is acceptable.
  throw args[0] instanceof Error ? args[0] : new Error(args[0]);
};

// Make console.warn throw, so that Jest tests fail
// eslint-disable-next-line no-console
const warn = console.warn;
// eslint-disable-next-line no-console
console.warn = (...args: any[]) => {
  warn.call(console, args);
  // NOTE: You can whitelist some `console.warn` messages here
  //       by returning if the `message` value is acceptable.
  throw args[0] instanceof Error ? args[0] : new Error(args[0]);
};

// https://vue-test-utils.vuejs.org/
// const vueTestUtils = require('@vue/test-utils')

/**
 * Force Axios to use the XHR adapter so that it behaves
 * more like it would in a browser environment.
 */
axios.defaults.adapter = require('axios/lib/adapters/xhr');

/**
 * Don't warn about not using the production build of Vue, as
 * we care more about the quality of errors than performance
 * for tests.
 */
Vue.config.productionTip = false;

/**
 * Register global components
 */
// const globalComponentFiles = fs
//   .readdirSync(path.join(__dirname, '../../src/components'))
//   .filter((fileName) => /^_base-.+\.vue$/.test(fileName))

// for (const fileName of globalComponentFiles) {
//   const componentName = _.pascalCase(fileName.match(/^_(base-.+)\.vue$/)[1])
//   const componentConfig = require('../../src/components/' + fileName)
//   Vue.component(componentName, componentConfig.default || componentConfig)
// }

/**
 * Mock window properties not handled by jsdom
 */
Object.defineProperty(window, 'localStorage', {
  value: (() => {
    let store: { [key: string]: any } = {};
    return {
      getItem(key: string) {
        return store[key] || null;
      },
      setItem(key: string, value: any) {
        store[key] = value.toString();
      },
      clear() {
        store = {};
      }
    };
  })()
});

// https://vue-test-utils.vuejs.org/api/#mount
// global.mount = vueTestUtils.mount

// // https://vue-test-utils.vuejs.org/api/#shallowmount
// global.shallowMount = vueTestUtils.shallowMount

// // A special version of `shallowMount` for view components
// global.shallowMountView = (Component, options = {}) => {
//   return global.shallowMount(Component, {
//     ...options,
//     stubs: {
//       Layout: {
//         functional: true,
//         render(h, { slots }) {
//           return <div>{slots().default}</div>
//         },
//       },
//       ...(options.stubs || {}),
//     },
//   })
// }

// A helper for creating Vue component mocks
// global.createComponentMocks = ({ store, router, style, mocks, stubs }) => {
//   // Use a local version of Vue, to avoid polluting the global
//   // Vue and thereby affecting other tests.
//   // https://vue-test-utils.vuejs.org/api/#createlocalvue
//   const localVue = vueTestUtils.createLocalVue()
//   const returnOptions = { localVue }

//   // https://vue-test-utils.vuejs.org/api/options.html#stubs
//   returnOptions.stubs = stubs || {}
//   // https://vue-test-utils.vuejs.org/api/options.html#mocks
//   returnOptions.mocks = mocks || {}

//   // Converts a `store` option shaped like:
//   //
//   // store: {
//   //   someModuleName: {
//   //     state: { ... },
//   //     getters: { ... },
//   //     actions: { ... },
//   //   },
//   //   anotherModuleName: {
//   //     getters: { ... },
//   //   },
//   // },
//   //
//   // to a store instance, with each module namespaced by
//   // default, just like in our app.
//   if (store) {
//     localVue.use(Vuex)
//     returnOptions.store = new Vuex.Store({
//       modules: Object.keys(store)
//         .map((moduleName) => {
//           const storeModule = store[moduleName]
//           return {
//             [moduleName]: {
//               state: storeModule.state || {},
//               getters: storeModule.getters || {},
//               actions: storeModule.actions || {},
//               namespaced:
//                 typeof storeModule.namespaced === 'undefined'
//                   ? true
//                   : storeModule.namespaced,
//             },
//           }
//         })
//         .reduce((moduleA, moduleB) => Object.assign({}, moduleA, moduleB), {}),
//     })
//   }

//   // If using `router: true`, we'll automatically stub out
//   // components from Vue Router.
//   if (router) {
//     returnOptions.stubs['router-link'] = true
//     returnOptions.stubs['router-view'] = true
//   }

//   // If a `style` object is provided, mock some styles.
//   if (style) {
//     returnOptions.mocks.$style = style
//   }

//   return returnOptions
// }

// global.createModuleStore = (vuexModule, options = {}) => {
//   vueTestUtils.createLocalVue().use(Vuex)
//   const store = new Vuex.Store({
//     ...deepCopy(vuexModule),
//     modules: {
//       auth: {
//         namespaced: true,
//         state: {
//           currentUser: options.currentUser,
//         },
//       },
//     },
//     // Enable strict mode when testing Vuex modules so that
//     // mutating state outside of a mutation results in a
//     // failing test.
//     // https://vuex.vuejs.org/guide/strict.html
//     strict: true,
//   })
//   axios.defaults.headers.common.Authorization = options.currentUser
//     ? options.currentUser.token
//     : ''
//   if (vuexModule.actions.init) {
//     store.dispatch('init')
//   }
//   return store
// }
