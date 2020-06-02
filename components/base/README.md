# Base Components

All of the components in this folder, `components/base/`, are available globally within the project. They are tree-shaken using the vueity-loader plugin. Configuration of how they are used/imported can be found in the nuxt.config.ts in the VuetifyLoaderPlugin configuration. All will be tree-shaken appropriately, so while they are globally available like vuetify, the code will only show up in the bundles where they are used.

Use the base components, as in the following example...

```
<template>
  <v-app>
    <base-toolbar />
    <base-drawer />
    <v-content>
      <nuxt />
    </v-content>
    <base-footer />
  </v-app>
</template>
```

**note:**

- Filenames must be 'components/base/PascalCase.vue'
- Components must not use the '\$vue.name' parameter. ie. use the default component name
- Stop stressing... thats it, silly!

from example above
`components/base/Toolbar.vue` is referenced in the template as `<base-toolbar>`

That is all. You are welcome.

:)
