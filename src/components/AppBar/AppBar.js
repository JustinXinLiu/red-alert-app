import React from "react";
import "./AppBar.scss";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import { EmailViewMode, useStateValue } from "../../Store";
import { useTransition, animated } from "react-spring";

const useStyles = makeStyles(theme => ({
  button: {}
}));

function AppBar(props) {
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

  const classes = useStyles();

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <animated.div className="AppBar" key={key} style={props}>
          <IconButton className={classes.button} aria-label="menu">
            <SvgIcon>
              <path d="M20.6,7L20.6,7c0,0.6-0.4,1-1,1H4.4c-0.6,0-1-0.4-1-1l0,0c0-0.6,0.4-1,1-1h15.2C20.1,6,20.6,6.4,20.6,7z" />
              <path d="M16.5,11H4.4c-0.6,0-1,0.4-1,1l0,0c0,0.6,0.4,1,1,1h12.1c0.6,0,1-0.4,1-1l0,0C17.5,11.4,17.1,11,16.5,11z" />
              <path d="M19.6,16H4.4c-0.6,0-1,0.4-1,1l0,0c0,0.6,0.4,1,1,1h15.2c0.6,0,1-0.4,1-1l0,0C20.6,16.4,20.1,16,19.6,16z" />
            </SvgIcon>
          </IconButton>

          <SvgIcon className="logo" viewBox="0,0,39,39">
            <path d="M13.0668 27.126C13.8018 27.126 14.2218 26.706 14.2218 25.971V20.7H15.0198C16.0698 20.7 16.4688 21.141 16.4688 22.506V25.32C16.4688 26.643 16.9098 27.126 17.8548 27.126C18.5478 27.126 18.9468 26.853 18.9468 26.349C18.9468 26.139 18.9258 26.013 18.8628 25.782C18.7998 25.53 18.7788 25.32 18.7788 24.921V22.632C18.7788 20.973 18.4008 19.881 17.2458 19.524V19.482C18.2748 19.062 18.7578 18.096 18.7578 16.584V15.681C18.7578 13.413 17.7288 12.3 15.3348 12.3H13.0668C12.3318 12.3 11.9118 12.72 11.9118 13.455V25.971C11.9118 26.706 12.3318 27.126 13.0668 27.126ZM14.2218 18.6V14.4H15.2718C16.0908 14.4 16.4478 14.862 16.4478 15.912V17.046C16.4478 18.222 15.9228 18.6 15.0618 18.6H14.2218ZM20.9065 27.126C21.4945 27.126 21.8935 26.79 21.9985 26.055L22.2715 24.123H25.0225V24.081L25.2955 26.013C25.4005 26.685 25.7995 27.126 26.4925 27.126C27.1645 27.126 27.5425 26.664 27.5425 25.95C27.5425 25.845 27.5425 25.74 27.5215 25.614L25.5265 13.665C25.3585 12.699 24.7075 12.09 23.7415 12.09C22.7755 12.09 22.1035 12.699 21.9355 13.665L19.9405 25.614C19.9195 25.74 19.8985 25.866 19.8985 25.992C19.8985 26.769 20.3605 27.126 20.9065 27.126ZM22.5445 22.128L23.6155 14.652H23.6575L24.7495 22.128H22.5445Z" />
          </SvgIcon>

          <IconButton className={classes.button} aria-label="filter">
            <SvgIcon>
              <path d="M8.6,17v-3.6L3.2,4.1c-0.4-0.9,0.3-1.6,1-1.6c0.6,0,0.5,0,0.5,0l5.9,10.1c0.1,0.2,0.1,0.3,0.1,0.5v3.3l2.2,1.7   V13c0-0.2,0-0.3,0.1-0.5l4.8-7.9H8.7L7.6,2.5c0,0,12,0,12.2,0c0.7,0,1.4,0.8,1,1.7l-5.6,9.2v7c0,1-1.1,1.4-1.7,0.9l-4.4-3.4   C8.8,17.7,8.6,17.5,8.6,17z" />
            </SvgIcon>
          </IconButton>
        </animated.div>
      )
  );
}

export default AppBar;
