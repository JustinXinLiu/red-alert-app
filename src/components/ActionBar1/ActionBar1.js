import React from "react";
import "./ActionBar1.css";
import { makeStyles } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SaveIcon from "@material-ui/icons/Save";
import ShareIcon from "@material-ui/icons/Share";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import { useStateValue } from "../../state";

const reminderIcon = (
  <IconButton aria-label="reminder">
    <SvgIcon>
      <path d="M20.6,7L20.6,7c0,0.6-0.4,1-1,1H4.4c-0.6,0-1-0.4-1-1l0,0c0-0.6,0.4-1,1-1h15.2C20.1,6,20.6,6.4,20.6,7z" />
      <path d="M16.5,11H4.4c-0.6,0-1,0.4-1,1l0,0c0,0.6,0.4,1,1,1h12.1c0.6,0,1-0.4,1-1l0,0C17.5,11.4,17.1,11,16.5,11z" />
      <path d="M19.6,16H4.4c-0.6,0-1,0.4-1,1l0,0c0,0.6,0.4,1,1,1h15.2c0.6,0,1-0.4,1-1l0,0C20.6,16.4,20.1,16,19.6,16z" />
    </SvgIcon>
  </IconButton>
);

const emailIcon = (
  <IconButton aria-label="reminder">
    <SvgIcon>
      <path d="M20.6,7L20.6,7c0,0.6-0.4,1-1,1H4.4c-0.6,0-1-0.4-1-1l0,0c0-0.6,0.4-1,1-1h15.2C20.1,6,20.6,6.4,20.6,7z" />
      <path d="M16.5,11H4.4c-0.6,0-1,0.4-1,1l0,0c0,0.6,0.4,1,1,1h12.1c0.6,0,1-0.4,1-1l0,0C17.5,11.4,17.1,11,16.5,11z" />
      <path d="M19.6,16H4.4c-0.6,0-1,0.4-1,1l0,0c0,0.6,0.4,1,1,1h15.2c0.6,0,1-0.4,1-1l0,0C20.6,16.4,20.1,16,19.6,16z" />
    </SvgIcon>
  </IconButton>
);

const inboxActions = [
  { icon: <ShareIcon id="share" />, name: "Share" },
  { icon: <DeleteIcon id="delete" />, name: "Delete" }
];

const reminderActions = [
  { icon: <SaveIcon id="save" />, name: "Save" },
  { icon: <ShareIcon id="share" />, name: "Share" }
];

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: "center",
    zIndex: 1050,
    display: "flex",
    pointerEvents: touchState =>
      touchState.overInbox || touchState.overReminder ? "auto" : "none"
  }
}));

function ActionBar1() {
  const [{ touchState }] = useStateValue();
  // const [{ touchState }, dispatcher] = useStateValue();

  const classes = useStyles(touchState);

  const handleInboxClick = () => {};

  const handleInboxClose = () => {};

  const handleReminderClick = () => {};

  const handleReminderClose = () => {};

  return (
    <div className="ActionBar1">
      <SpeedDial
        id="reminder"
        className={classes.root}
        ariaLabel="Inbox options"
        icon={reminderIcon}
        onBlur={handleInboxClose}
        onClick={handleInboxClick}
        onClose={handleInboxClose}
        open={touchState.overReminder}
      >
        {inboxActions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleInboxClick}
          />
        ))}
      </SpeedDial>

      <SpeedDial
        id="inbox"
        className={classes.root}
        ariaLabel="Inbox options"
        icon={emailIcon}
        onBlur={handleReminderClose}
        onClick={handleReminderClick}
        onClose={handleReminderClose}
        open={touchState.overInbox}
      >
        {reminderActions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleReminderClick}
          />
        ))}
      </SpeedDial>
    </div>
  );
}

export default ActionBar1;
