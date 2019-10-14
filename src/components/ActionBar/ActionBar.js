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
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 }
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
