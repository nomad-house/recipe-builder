import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import { store } from "./state/store";

import "./index.css";

ReactDOM.render(
  <BrowserRouter>
    <ReduxProvider store={store}>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </ReduxProvider>
  </BrowserRouter>,
  document.getElementById("root") as HTMLElement
);
