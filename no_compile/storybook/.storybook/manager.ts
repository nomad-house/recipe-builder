import { addons } from "@storybook/addons";
import { create } from "@storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Trusted Resources",
    brandUrl: "https://trusted-resources.com",
    brandImage: "/favicon.ico"
  })
});
