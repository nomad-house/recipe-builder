import { FC } from "react";
import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { TrDispatch, allActions } from "../state";
import { Outlet } from "react-router-dom";

export const Layout: FC = () => {
  const dispatch = useDispatch<TrDispatch>();

  function login() {
    dispatch(allActions.configSetup());
    dispatch(allActions.web3Setup());
  }

  return (
    <main className="App">
      <Button onClick={login}>Login</Button>
      <Outlet />
    </main>
  );
};
