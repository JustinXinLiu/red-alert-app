import React from "react";
import "./ActionBar.css";
import { makeStyles } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SaveIcon from "@material-ui/icons/Save";
import ShareIcon from "@material-ui/icons/Share";
import DeleteIcon from "@material-ui/icons/Delete";

const actions = [
  { icon: <SaveIcon />, name: "Save" },
  { icon: <ShareIcon />, name: "Share" },
  { icon: <DeleteIcon />, name: "Delete" }
];

const useStyles = makeStyles(theme => ({
  button: {
    justifySelf: "center"
  }
}));

function ActionBar(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  return (
    <div className="ActionBar">
      <SpeedDial
        className={classes.button}
        ariaLabel="Inbox options"
        icon={<SpeedDialIcon />}
        onBlur={handleClose}
        onClick={handleClick}
        onClose={handleClose}
        open={open}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClick}
          />
        ))}
      </SpeedDial>

      <SpeedDial
        className={classes.button}
        ariaLabel="Inbox options"
        icon={<SpeedDialIcon />}
        onBlur={handleClose}
        onClick={handleClick}
        onClose={handleClose}
        open={open}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClick}
          />
        ))}
      </SpeedDial>
    </div>
  );
}

export default ActionBar;
