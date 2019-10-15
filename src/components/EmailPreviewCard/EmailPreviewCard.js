import React from "react";
import "./EmailPreviewCard.scss";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import { EmailViewMode, useStateValue } from "../../Store";
import { useTransition, animated } from "react-spring";

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

  const { subject, from, toRecipients, bodyPreview } = mail;

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
      <p className="email-body">{bodyPreview}</p>

      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div className="email-actions" key={key} style={props}>
              <IconButton aria-label="menu">
                <SvgIcon>
                  <path d="M20.6,7L20.6,7c0,0.6-0.4,1-1,1H4.4c-0.6,0-1-0.4-1-1l0,0c0-0.6,0.4-1,1-1h15.2C20.1,6,20.6,6.4,20.6,7z" />
                  <path d="M16.5,11H4.4c-0.6,0-1,0.4-1,1l0,0c0,0.6,0.4,1,1,1h12.1c0.6,0,1-0.4,1-1l0,0C17.5,11.4,17.1,11,16.5,11z" />
                  <path d="M19.6,16H4.4c-0.6,0-1,0.4-1,1l0,0c0,0.6,0.4,1,1,1h15.2c0.6,0,1-0.4,1-1l0,0C20.6,16.4,20.1,16,19.6,16z" />
                </SvgIcon>
              </IconButton>

              <IconButton aria-label="reply-all">
                <SvgIcon>
                  <path d="M20.6,7L20.6,7c0,0.6-0.4,1-1,1H4.4c-0.6,0-1-0.4-1-1l0,0c0-0.6,0.4-1,1-1h15.2C20.1,6,20.6,6.4,20.6,7z" />
                  <path d="M16.5,11H4.4c-0.6,0-1,0.4-1,1l0,0c0,0.6,0.4,1,1,1h12.1c0.6,0,1-0.4,1-1l0,0C17.5,11.4,17.1,11,16.5,11z" />
                  <path d="M19.6,16H4.4c-0.6,0-1,0.4-1,1l0,0c0,0.6,0.4,1,1,1h15.2c0.6,0,1-0.4,1-1l0,0C20.6,16.4,20.1,16,19.6,16z" />
                </SvgIcon>
              </IconButton>

              <IconButton aria-label="forward">
                <SvgIcon>
                  <path d="M8.6,17v-3.6L3.2,4.1c-0.4-0.9,0.3-1.6,1-1.6c0.6,0,0.5,0,0.5,0l5.9,10.1c0.1,0.2,0.1,0.3,0.1,0.5v3.3l2.2,1.7   V13c0-0.2,0-0.3,0.1-0.5l4.8-7.9H8.7L7.6,2.5c0,0,12,0,12.2,0c0.7,0,1.4,0.8,1,1.7l-5.6,9.2v7c0,1-1.1,1.4-1.7,0.9l-4.4-3.4   C8.8,17.7,8.6,17.5,8.6,17z" />
                </SvgIcon>
              </IconButton>
            </animated.div>
          )
      )}
    </div>
  );
}

export default EmailPreviewCard;
