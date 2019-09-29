import React from "react";
import "./ZStackCardsView.css";
import { useSprings, animated, to } from "react-spring";
import { useDrag } from "react-use-gesture";
import { useStateValue } from "../../Store";
import { EmailPreviewCard } from "../../components";

// This is being used down there in the view, it interpolates rotation and scale into a css transform.
const transform = (r, s) =>
  `rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

let _inboxEnter, _reminderEnter, _timeout;
let _currentPopupButton, _selectedAction;
let _flyoutToBottomLeft = false,
  _flyoutToBottomRight = false;

function ZStackCardsView() {
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

  console.log("emailPreviewCards", emailPreviewCards);

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
          _selectedAction = popupButton.id;
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

          switch (_selectedAction) {
            case "archive":
              _flyoutToBottomRight = true;
              dispatch({ type: "archiveEmail" });
              break;
            case "ignore":
              _flyoutToBottomRight = true;
              dispatch({ type: "ignoreEmail" });
              break;
            case "reminderTime1":
              _flyoutToBottomLeft = true;
              dispatch({ type: "remindEmailInTime", payload: 1 });
              break;
            case "reminderTime2":
              _flyoutToBottomLeft = true;
              dispatch({ type: "remindEmailInTime", payload: 3 });
              break;
            case "reminderTime3":
              _flyoutToBottomLeft = true;
              dispatch({ type: "remindEmailInTime", paylaod: 24 });
              break;
            default:
          }
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
  const gesture = useDrag(
    ({
      down,
      delta: [deltaX, deltaY],
      direction: [directionX, directionY],
      velocity,
      last,
      args: [index]
    }) => {
      // When the volocity is greater than 0.2, we consider it's a flick and fly out the card.
      const flick = velocity > 0.2;
      // Determine which direction the card should fly out to.
      let direction;
      if (_flyoutToBottomLeft) {
        direction = -1;
      } else if (_flyoutToBottomRight) {
        direction = 1;
      } else {
        direction = directionX < 0 ? -1 : 1;
      }

      if (
        _flyoutToBottomLeft ||
        _flyoutToBottomRight ||
        (!down && flick && directionY >= 0)
      ) {
        _flyoutToBottomLeft = _flyoutToBottomRight = false;

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
        const x = removed
          ? (window.innerWidth / 2) * direction
          : down
          ? deltaX
          : 0;
        const y = removed
          ? window.innerHeight
          : down
          ? deltaY
          : (emailPreviewCards.length - 1 - i) * -18;
        const rotation = removed
          ? deltaX / 40 + direction * 10 * velocity
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
        style={{ transform: to([rotation, scale], transform) }}
        onTouchMove={handleAdditionalActionsOnTouchOver}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        <EmailPreviewCard subject={emailPreviewCards[i].subject} />
      </animated.div>
    </animated.div>
  ));
}

export default ZStackCardsView;
