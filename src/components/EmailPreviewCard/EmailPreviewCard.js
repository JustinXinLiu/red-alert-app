import React from "react";
import "./EmailPreviewCard.scss";

function EmailPreviewCard(props) {
  return (
    <div className="EmailPreviewCard">
      <div>MENTIONED</div>
      <div>{props.subject}</div>
    </div>
  );
}

export default EmailPreviewCard;
