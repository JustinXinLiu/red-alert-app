import React, { useState, useEffect } from "react";
import "./ZStackCardsView.css";
import { useSprings, animated, to } from "react-spring";
import { useGesture } from "react-use-gesture";
import { useStateValue } from "../../state";

// This is being used down there in the view, it interpolates rotation and scale into a css transform
const transform = (r, s) =>
  `rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

let _inboxEnter, _reminderEnter, _timeout;

function ZStackCardsView() {
  console.log("ZStackCardsView function called...");

  const [
    { emailPreviewCards, cardSpringDataFrom, cardSpringDataTo, touchState },
    dispatch
  ] = useStateValue();

  // const originalSize = emailPreviewCards.length;

  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out

  const handleAdditionalActionsOnTouchOver = e => {
    const touches = e.changedTouches;
    // console.log('touches', touches);

    if (touches && touches.length > 0) {
      const touch = touches[0];
      const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
      //console.log("Touch over elements", elements.map(el => el.className));

      const connectedAction = elements.find(el =>
        el.classList.contains("MuiFab-sizeSmall")
      );

      if (connectedAction) {
        if (connectedAction.title === "Delete") {
          console.log("connectedAction", connectedAction);
          connectedAction.classList.toggle("active");
        }
      }

      const dial = elements.find(el =>
        el.classList.contains(
          touchState.overInbox || touchState.overReminder
            ? "MuiSpeedDial-root"
            : "MuiButtonBase-root"
        )
      );

      if (dial) {
        switch (dial.parentElement.id) {
          case "inbox":
            if (!_inboxEnter) {
              _inboxEnter = true;

              _timeout = setTimeout(() => {
                dispatch({ type: "showInboxActions" });
                console.log("show Inbox actions");
              }, 600);
            }
            break;
          case "reminder":
            if (!_reminderEnter) {
              _reminderEnter = true;

              _timeout = setTimeout(() => {
                dispatch({ type: "showReminderActions" });
                console.log("show Reminder actions");
              }, 600);
            }
            break;
          default:
        }
      } else {
        handleTouchEnd();
      }
    }
  };

  const handleTouchEnd = () => {
    if (_timeout) {
      console.log("clear timeout", _timeout);
      clearTimeout(_timeout);
      _timeout = null;
    }

    if (_inboxEnter || _reminderEnter) {
      _inboxEnter = false;
      _reminderEnter = false;
      console.log("hide actions");

      if (touchState.overInbox || touchState.overReminder)
        dispatch({ type: "hideActions" });
    }
  };

  const [props, set] = useSprings(emailPreviewCards.length, i => {
    console.log("from", cardSpringDataFrom());
    console.log("to", cardSpringDataTo(emailPreviewCards.length, i));

    return {
      from: cardSpringDataFrom(),
      ...cardSpringDataTo(emailPreviewCards.length, i)
    };
  }); // Create a bunch of springs using the helpers above

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const gesture = useGesture(
    ({
      args: [index],
      down,
      delta: [xDelta, yDelta],
      direction: [xDir, yDir],
      velocity,
      last
    }) => {
      const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right

      if (!down && trigger && yDir >= 0) {
        gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out

        if (index > -1) {
          emailPreviewCards.splice(index, 1);
        }
      }

      set(i => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring

        const isGone = gone.has(index);

        // console.log("isGone", isGone);
        // console.log("down", down);

        const x = isGone ? (window.innerWidth / 2) * dir : down ? xDelta : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const y = isGone
          ? window.innerHeight
          : down
          ? yDelta
          : (emailPreviewCards.length - 1 - i) * -18;
        const rot = isGone
          ? xDelta / 40 + dir * 10 * velocity
          : down
          ? xDelta / 40
          : 0; // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1; // Active cards lift up a bit

        // console.log("yDir", yDir);
        // console.log("offset y", y);

        return {
          x,
          y,
          rot,
          scale,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
        };
      });

      if (last && !down) {
        set(i => {
          if (i < emailPreviewCards.length)
            return cardSpringDataTo(emailPreviewCards.length, i);
        });
      }

      // if (!down && gone.size === originalSize)
      //   setTimeout(() => gone.clear() || set(i => to(i)), 600);
    }
  );

  useEffect(() => {
    console.log("render ZStackCardsView");
  }, []);

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return props.map(({ x, y, rot, scale }, i) => (
    <animated.div
      className="card-wrapper"
      key={i}
      style={{
        transform: to(
          [x, y],
          (x, y) => `perspective(100px) translate3d(${x}px, ${y}px, ${4 * i}px)`
        )
      }}
    >
      {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
      <animated.div
        className="card"
        {...gesture(i)}
        style={{
          transform: to([rot, scale], transform),
          backgroundImage: `url(${emailPreviewCards[i]})`
        }}
        onTouchMove={handleAdditionalActionsOnTouchOver}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      />
    </animated.div>
  ));
}

export default ZStackCardsView;
