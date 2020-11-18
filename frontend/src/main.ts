// import "./registerServiceWorker";
import { h, createApp, provide } from "vue";
// import { DefaultApolloClient } from "@vue/apollo-composable";
// import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import App from "./App.vue";
import store from "./store";
import router from "./router";

// const link = createHttpLink({ uri: "" });
// const cache = new InMemoryCache();
// const defaultClient = new ApolloClient({ link, cache });

createApp(
  App
  // {
  //   setup() {
  //     provide(DefaultApolloClient, defaultClient);
  //   },
  //   render() {
  //     return h(App);
  //   }
  // }
)
  .use(store)
  .use(router)
  .mount("#app");
