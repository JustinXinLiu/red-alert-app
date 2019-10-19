import React from "react";
import "./EmailPreviewCard.scss";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import CloseIcon from "@material-ui/icons/Close";
import { EmailViewMode, useStateValue } from "../../Store";
import { useTransition, animated } from "react-spring";

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: "fixed", // todo: need to make this sticky.
    top: 0,
    right: 12
  }
}));

function EmailPreviewCard(props) {
  const [{ emailViewMode }] = useStateValue();

  const transitions = useTransition(
    emailViewMode === EmailViewMode.full,
    null,
    {
      from: { opacity: 0, transform: "translate3d(0,-25%,0)" },
      enter: { opacity: 1, transform: "translate3d(0,0,0)" },
      leave: { opacity: 0, transform: "translate3d(0,-25%,0)" }
    }
  );

  let mail = props.mail;

  if (!mail) {
    mail = {
      subject: "",
      from: { emailAddress: { name: "", address: "" } },
      toRecipients: []
    };
  }

  const { subject, from, toRecipients, bodyPreview, body } = mail;

  let senderName, toText;
  if (from && from.emailAddress) {
    senderName = from.emailAddress.name;
  }

  switch (toRecipients.length) {
    case 1:
      toText = "you"; //toRecipients[0].name;
      break;
    default:
      toText = "";
  }

  const classes = useStyles();

  return (
    <div className="EmailPreviewCard">
      <div className="email-type">
        <span>high importance</span>
      </div>
      <h2 className="email-subject">{mail ? subject : ""}</h2>
      <section className="sender-section">
        <div className="avatar"></div>
        <div className="name">{senderName}</div>
        <div className="to-list">{`To ${toText}`}</div>
      </section>

      {transitions.map(({ item, key, props }) =>
        item ? (
          <p
            className="email-body"
            key={key}
            style={props}
            dangerouslySetInnerHTML={{ __html: body ? body.content : "" }}
          ></p>
        ) : (
          <p className="email-body" key={key} style={props}>
            {bodyPreview}
          </p>
        )
      )}

      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div className="email-actions" key={key} style={props}>
              <IconButton aria-label="menu">
                <SvgIcon>
                  <path d="M9.51654 2L1 8.90476L9.51654 16.2857V11.5238C13.5382 11.5238 17.0868 13.0952 18.9794 16.2857V16.0476C18.9794 10.9048 14.7211 6.76191 9.51654 6.76191V2Z" />
                </SvgIcon>
              </IconButton>

              <IconButton aria-label="reply-all">
                <SvgIcon>
                  <path d="M14.6591 2L6.14258 8.90476L14.6591 16.2857V11.5238C18.6808 11.5238 22.2294 13.0952 24.1219 16.2857V16.0476C24.1219 10.9048 19.8637 6.76191 14.6591 6.76191V2Z" />
                  <path d="M9.92768 16.2857L1.41113 8.90476L9.92768 2" />
                </SvgIcon>
              </IconButton>

              <IconButton aria-label="forward">
                <SvgIcon>
                  <path d="M10.0168 2L18.5333 9.14286L10.0168 16.2857V11.5238H0.553955V6.76191H10.0168V2Z" />
                </SvgIcon>
              </IconButton>
            </animated.div>
          )
      )}

      {/* {transitions.map(
        ({ item, key, props }) =>
          item && (
            <IconButton
              key={key}
              style={props}
              className={classes.closeButton}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          )
      )} */}

      {emailViewMode === EmailViewMode.full ? (
        <IconButton className={classes.closeButton} aria-label="close">
          <CloseIcon />
        </IconButton>
      ) : (
        <></>
      )}
    </div>
  );
}

export default EmailPreviewCard;
