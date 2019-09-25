import React, { useEffect } from "react";
import "./ZStackCardsView.css";
import { useSprings, animated, to } from "react-spring";
import { useGesture } from "react-use-gesture";
import { useStateValue } from "../../state";

// This is being used down there in the view, it interpolates rotation and scale into a css transform.
const transform = (r, s) =>
  `rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

let _inboxEnter, _reminderEnter, _timeout;
let _currentPopupButton, _selectedAction;

function ZStackCardsView() {
  // console.log("ZStackCardsView function called...");

  const [
    {
      maxDisplaySize,
      emailPreviewCards,
      removedEmailPreviewCards,
      cardSpringDataFrom,
      cardSpringDataTo,
      touchState
    },
    dispatch
  ] = useStateValue();

  const handleAdditionalActionsOnTouchOver = e => {
    const touches = e.changedTouches;
    // console.log('touches', touches);

    if (touches && touches.length > 0) {
      const touch = touches[0];
      const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
      // console.log("Touch over elements", elements.map(el => el.className));

      if (touchState.overInbox || touchState.overReminder) {
        const popupButton = elements.find(el => el.classList.contains("popup"));
        if (popupButton) {
          _currentPopupButton = popupButton;

          _currentPopupButton.classList.add("touchover");
          _currentPopupButton.firstChild.classList.add("touchover");
          switch (popupButton.id) {
            case "archive":
              _selectedAction = "archive";
              break;
            case "ignore":
              _selectedAction = "ignore";
              break;
            case "reminderTime1":
              _selectedAction = "reminderTime1";
              break;
            case "reminderTime2":
              _selectedAction = "reminderTime2";
              break;
            case "reminderTime3":
              _selectedAction = "reminderTime3";
              break;
            default:
          }
        } else {
          ResetPopupButtonTouchOverState();
        }
      }

      const dial = elements.find(el =>
        el.classList.contains(
          touchState.overInbox || touchState.overReminder
            ? "circle-menu"
            : "circle-button"
        )
      );

      if (dial) {
        switch (dial.id) {
          case "inbox":
            if (!_inboxEnter) {
              _inboxEnter = true;

              _timeout = setTimeout(() => {
                dispatch({ type: "showInboxActions" });
                console.log("show Inbox actions");
              }, 800);
            }
            break;
          case "reminder":
            if (!_reminderEnter) {
              _reminderEnter = true;

              _timeout = setTimeout(() => {
                dispatch({ type: "showReminderActions" });
                console.log("show Reminder actions");
              }, 800);
            }
            break;
          default:
        }
      } else {
        releaseTouch();
      }
    }
  };

  const releaseTouch = (cancelled = false) => {
    if (_timeout) {
      // console.log("clear timeout", _timeout);
      clearTimeout(_timeout);
      _timeout = null;
    }

    if (_inboxEnter || _reminderEnter) {
      _inboxEnter = false;
      _reminderEnter = false;
      console.log("hide actions");

      if (touchState.overInbox || touchState.overReminder) {
        if (!cancelled && _selectedAction) {
          console.log("_selectedAction", _selectedAction);
        }

        dispatch({ type: "hideActions" });
      }
    }

    ResetPopupButtonTouchOverState();
  };

  const handleTouchEnd = () => releaseTouch();

  const handleTouchCancel = () => releaseTouch(true);

  const ResetPopupButtonTouchOverState = () => {
    if (_currentPopupButton) {
      _currentPopupButton.classList.remove("touchover");
      _currentPopupButton.firstChild.classList.remove("touchover");
    }

    _selectedAction = undefined;
  };

  // Create a bunch of springs for later bound to each card.
  const [props, set] = useSprings(maxDisplaySize - 1, i => ({
    from: cardSpringDataFrom(),
    ...cardSpringDataTo(emailPreviewCards.length, i)
  }));

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const gesture = useGesture(
    ({
      args: [index],
      down,
      delta: [deltaX, deltaY],
      direction: [directionX, directionY],
      velocity,
      last
    }) => {
      // If you flick hard enough it should trigger the card to fly out.
      const trigger = velocity > 0.2;
      // Direction should either point left or right.
      const dir = directionX < 0 ? -1 : 1;

      if (!down && trigger && directionY >= 0) {
        // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out.
        removedEmailPreviewCards.add(index);

        if (index > -1) {
          emailPreviewCards.splice(index, 1);
        }
      }

      set(i => {
        // We're only interested in changing spring-data for the current spring.
        if (index !== i) return;

        const removed = removedEmailPreviewCards.has(index);

        // When a card is removed it flys out left or right, otherwise goes back to zero.
        const x = removed ? (window.innerWidth / 2) * dir : down ? deltaX : 0;
        const y = removed
          ? window.innerHeight
          : down
          ? deltaY
          : (emailPreviewCards.length - 1 - i) * -18;
        const rotation = removed
          ? deltaX / 40 + dir * 10 * velocity
          : down
          ? deltaX / 40
          : 0; // How much the card tilts, flicking it harder makes it rotate faster.
        // Active cards lift up a bit.
        const scale = down ? 1.1 : 1;

        // console.log("directionY", directionY);
        // console.log("offset y", y);

        return {
          x,
          y,
          rotation,
          scale,
          config: { friction: 50, tension: down ? 800 : removed ? 200 : 500 }
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
    // console.log("render ZStackCardsView");
  }, []);

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return props.map(({ x, y, rotation, scale }, i) => (
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
      {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which). */}
      <animated.div
        className="card"
        {...gesture(i)}
        style={{
          transform: to([rotation, scale], transform),
          backgroundImage: `url(${emailPreviewCards[i]})`
        }}
        onTouchMove={handleAdditionalActionsOnTouchOver}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      />
    </animated.div>
  ));
}

export default ZStackCardsView;
