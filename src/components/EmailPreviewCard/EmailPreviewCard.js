import React from "react";
import "./EmailPreviewCard.scss";

function EmailPreviewCard(props) {
  return (
    <div className="EmailPreviewCard">
      <div className="email-type">
        <span>mentioned</span>
      </div>
      <div className="email-subject">
        {props.mail ? props.mail.subject : ""}
      </div>
      <div className="test"></div>
    </div>
  );
}

export default EmailPreviewCard;
