import React from "react";
import "./AppBar.css";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";

function AppBar(props) {
  return (
    <div className="root">
      <IconButton aria-label="menu">
        <SvgIcon>
          <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
        </SvgIcon>
      </IconButton>
    </div>
  );
}

export default AppBar;
