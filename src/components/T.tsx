import React, { MouseEventHandler } from "react";
import { useIntl } from "react-intl";
import { Menu, MenuItem, Button } from "@mui/material";

export const T = () => {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const { formatMessage: f } = useIntl();
  const open = Boolean(anchorEl);
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div style={{ height: "30rm" }}>
      <div>123456 {f({ id: "app.title", defaultMessage: "hello" })} </div>
      <Button id="basic-button" aria-controls="basic-menu" aria-haspopup="true" aria-expanded={open ? "true" : undefined} onClick={handleClick}>
        Dashboard
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default T;
