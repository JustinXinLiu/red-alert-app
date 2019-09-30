import React from "react";
import "./MessageView.scss";
import { useStateValue } from "../../Store";

function MessageView(props) {
  const [{ emailPreviewCards }, dispatch] = useStateValue();
  console.log("dispatch", dispatch);

  return (
    <div className="MessageView">
      <h3 className="message">
        {emailPreviewCards.length > 0 ? `${emailPreviewCards.length} new` : ""}
      </h3>
    </div>
  );
}

export default MessageView;
