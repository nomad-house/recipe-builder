import { FC } from "react";
import { Route, RouteProps, Navigate } from "react-router-dom";

export interface AuthGuardProps extends RouteProps {}

const isAuth = true;
export const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  return <>{children}</>;
};
