import React from "react";
import "./ActionBar.css";
import { makeStyles } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SaveIcon from "@material-ui/icons/Save";
import ShareIcon from "@material-ui/icons/Share";
import DeleteIcon from "@material-ui/icons/Delete";
import { useStateValue } from "../../state";

const inboxActions = [
  { icon: <ShareIcon />, name: "Share" },
  { icon: <DeleteIcon />, name: "Delete" }
];

const reminderActions = [
  { icon: <SaveIcon />, name: "Save" },
  { icon: <ShareIcon />, name: "Share" },
  { icon: <DeleteIcon />, name: "Delete" }
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

function ActionBar() {
  const [{ touchState }] = useStateValue();
  // const [{ touchState }, dispatcher] = useStateValue();

  const classes = useStyles(touchState);

  const handleInboxClick = () => {};

  const handleInboxClose = () => {};

  const handleReminderClick = () => {};

  const handleReminderClose = () => {};

  return (
    <div className="ActionBar">
      <SpeedDial
        id="reminder"
        className={classes.root}
        ariaLabel="Inbox options"
        icon={<SpeedDialIcon />}
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
        icon={<SpeedDialIcon />}
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

export default ActionBar;
