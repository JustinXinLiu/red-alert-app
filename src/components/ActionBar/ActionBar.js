import React from "react";
import "./ActionBar.scss";
import { InboxMenu, ReminderMenu } from "../../components";
import { EmailViewMode, useStateValue } from "../../Store";
import { useTransition, animated } from "react-spring";

function ActionBar(props) {
  const [{ emailViewMode }] = useStateValue();

  const transitions = useTransition(
    emailViewMode === EmailViewMode.preview,
    null,
    {
      from: { opacity: 0, transform: "translate3d(0,25%,0)" },
      enter: { opacity: 1, transform: "translate3d(0,0,0)" },
      leave: { opacity: 0, transform: "translate3d(0,25%,0)" }
    }
  );

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <animated.div className="ActionBar" key={key} style={props}>
          <ReminderMenu />
          <InboxMenu />
        </animated.div>
      )
  );
}

export default ActionBar;
