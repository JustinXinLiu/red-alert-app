import React from "react";
import "./EmailPreviewCard.scss";

function EmailPreviewCard(props) {
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
      <div className="email-subject">{mail ? subject : ""}</div>
      <section className="sender-section">
        <div className="avatar"></div>
        <div className="name">{senderName}</div>
        <div className="to-list">{`To ${toText}`}</div>
      </section>
      <p className="email-body">{bodyPreview}</p>
    </div>
  );
}

export default EmailPreviewCard;
