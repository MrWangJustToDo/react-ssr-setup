import { Component } from "react";
import { Outlet } from "react-router";

import type { ReactNode } from "react";

// TODO
export class Layout extends Component {
  render(): ReactNode {
    return <Outlet />;
  }
}
