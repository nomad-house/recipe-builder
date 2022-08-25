import { Route, Routes } from "react-router-dom";
import { FormBuilder } from "./components/FormBuilder";
import { AuthGuard } from "./components/AuthGuard";
import { Layout } from "./components/Layout";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* <Route
          path="/forms"
          element={
            <AuthGuard>
              <FormBuilder title="some fancy form ya got there!" />
            </AuthGuard>
          }
        ></Route> */}
      </Route>
    </Routes>
  );
}

export default App;
