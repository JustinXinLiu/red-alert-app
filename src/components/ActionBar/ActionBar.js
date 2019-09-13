import React from 'react';
import './ActionBar.css';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SaveIcon from '@material-ui/icons/Save';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import { useStateValue } from '../../state';

const inboxActions = [
  { icon: <ShareIcon />, name: 'Share' },
  { icon: <DeleteIcon />, name: 'Delete' }
];

const reminderActions = [
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <ShareIcon />, name: 'Share' },
  { icon: <DeleteIcon />, name: 'Delete' }
];

const useStyles = makeStyles(theme => ({
  button: {
    justifySelf: 'center'
  }
}));

function ActionBar(props) {
  const classes = useStyles();
  const [inboxActionsOpen, setInboxActionsOpen] = React.useState(false);
  const [reminderActionsOpen, setReminderActionsOpen] = React.useState(false);

  const [{ inboxState }, dispatcher] = useStateValue();

  const handleInboxClick = () => {
    setInboxActionsOpen(prevOpen => !prevOpen);
  };

  const handleInboxClose = () => {
    setInboxActionsOpen(false);
  };

  const handleReminderClick = () => {
    setReminderActionsOpen(prevOpen => !prevOpen);
  };

  const handleReminderClose = () => {
    setReminderActionsOpen(false);
  };

  return (
    <div className="ActionBar">
      <SpeedDial
        id="reminder"
        className={classes.button}
        ariaLabel="Inbox options"
        icon={<SpeedDialIcon />}
        onBlur={handleInboxClose}
        onClick={handleInboxClick}
        onClose={handleInboxClose}
        open={inboxActionsOpen}
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
        className={classes.button}
        ariaLabel="Inbox options"
        icon={<SpeedDialIcon />}
        onBlur={handleReminderClose}
        onClick={handleReminderClick}
        onClose={handleReminderClose}
        open={inboxState.pointerOver}
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
