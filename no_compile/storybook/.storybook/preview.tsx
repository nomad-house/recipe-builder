import { Parameters, DecoratorFn } from "@storybook/react";

// import { defineCustomElements, applyPolyfills } from '../loader';
// if (process.env.NODE_ENV === 'production') {
//   applyPolyfills().then(() => defineCustomElements());
// } else {
//   defineCustomElements();
// }

export const parameters: Parameters = {
  layout: "centered",
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    // what does this do?
    // hideNoControlsWarning: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  backgrounds: {
    disable: true,
    default: "Default",
    values: [
      {
        name: "Dark",
        value: "#000"
      },
      {
        name: "White",
        value: "#fff"
      },
      {
        name: "Default",
        value: "hsl(218, 54%, 95%)"
      }
    ]
  },
  options: {
    storySort: {
      method: "alphabetical",
      order: ["Design System", ["Protons", "Atoms", "Molecules"]]
    }
  }
};

export const decorators: DecoratorFn[] = [
  (Story) => {
    return (
      // <section>
      <Story />
      // </section>
    );
  }
];

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "light",
    toolbar: {
      icon: "circlehollow",
      // Array of plain string values or MenuItem shape (see below)
      items: ["light", "dark"],
      // Property that specifies if the name of the item will be displayed
      showName: false
    }
  }
};
