import React from "react";
import "./ActionBar.scss";
import { InboxMenu, ReminderMenu } from "../../components";

function ActionBar(props) {
  return (
    <div className="ActionBar">
      <ReminderMenu />
      <InboxMenu />
    </div>
  );
}

export default ActionBar;
