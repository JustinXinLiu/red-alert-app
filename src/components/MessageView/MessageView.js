import React, { useState, useEffect, useRef } from "react";
import "./MessageView.scss";
import { useStateValue } from "../../Store";

function MessageView(props) {
  const [{ message }] = useStateValue();

  const prevText = useRef();
  const [text, setText] = useState("");
  const [show, setShow] = useState(true);

  useEffect(() => {
    prevText.current = text;
    setText(message);

    setShow(true);
    const timeout = setTimeout(() => {
      setShow(false);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [text, message]);

  return (
    <div className="MessageView">
      <h3 className={`message ${show ? "" : "hide"}`}>
        <div className="prev-message-text">{prevText.current}</div>
        <div className="message-text">{text}</div>
      </h3>
    </div>
  );
}

export default MessageView;
