import React, { createRef, useRef } from "react";
import "./ZStackCardsView.scss";
import { useSprings, animated, to } from "react-spring";
import { useDrag } from "react-use-gesture";
import { EmailViewMode, useStateValue } from "../../Store";
import { EmailPreviewCard } from "../../components";

// This is being used down there in the view, it interpolates rotation and scale into a css transform.
const toCardTransform = (r, s) =>
  `rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;
const toCardBgTransform = (r, sx, sy) =>
  `rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${sx}, ${sy})`;

let _inboxEnter, _reminderEnter, _timeout;
let _currentPopupButton, _selectedAction;
let _flyoutToBottomLeft = false,
  _flyoutToBottomRight = false;

let _emailViewMode = EmailViewMode.preview;

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

  const cardRefs = useRef(emailPreviewCards.map(createRef));

  // console.log("emailPreviewCards", emailPreviewCards);

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
              }, 300);
            }
            break;
          case "reminder":
            if (!_reminderEnter) {
              _reminderEnter = true;

              _timeout = setTimeout(() => {
                dispatch({ type: "showReminderActions" });
                console.log("show Reminder actions");
              }, 300);
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
              dispatch({ type: "remindEmailInTime", payload: 24 });
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
  const [springs, set] = useSprings(maxDisplaySize, i => ({
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
      if (_emailViewMode === EmailViewMode.full) {
        const currentCard = cardRefs.current[index].current;
        // todo: This is currently a hack that tells if the card is being interated with.
        var scaleX =
          currentCard.getBoundingClientRect().width / currentCard.offsetWidth;
        // console.log("scaleX", scaleX);
        if (currentCard.scrollTop !== 0 && scaleX > 1) return;
      }

      // When the volocity is greater than 0.5, we consider it's a flick and fly out the card.
      const flick = velocity > 0.5;

      // Determine which direction the card should fly out to.
      let direction;
      if (_flyoutToBottomLeft) {
        direction = -1;
      } else if (_flyoutToBottomRight) {
        direction = 1;
      } else {
        if (!flick || (flick && Math.abs(directionX) < 0.1)) {
          direction = deltaX < 0 ? -1 : 1;
        } else {
          direction = directionX < 0 ? -1 : 1;
        }
      }

      const canCloseDetailView =
        _flyoutToBottomLeft ||
        _flyoutToBottomRight ||
        (!down && flick && directionY >= 0) ||
        (!down && deltaY >= window.innerHeight / 4);

      const canDismissCard =
        _flyoutToBottomLeft ||
        _flyoutToBottomRight ||
        (!down && flick && Math.abs(directionX) > Math.abs(directionY)) ||
        (!down && !flick && Math.abs(deltaX) >= window.innerWidth / 3);

      // console.log("-----------------------------------");
      // console.log("down", down);
      // console.log("flick", flick);
      // console.log("directionX", directionX);
      // console.log("directionY", directionY);
      // console.log("direction", direction);
      // console.log("deltaX", deltaX);
      // console.log("deltaY", deltaY);
      // console.log("window.innerWidth", window.innerWidth);
      // console.log("_emailViewMode", _emailViewMode);
      // console.log("canCloseDetailView", canCloseDetailView);
      // console.log("canDismissCard", canDismissCard);

      if (_emailViewMode === EmailViewMode.full && canCloseDetailView) {
        _emailViewMode = EmailViewMode.fullEnteringPreview;
        dispatch({
          type: "UpdateEmailViewMode",
          payload: EmailViewMode.fullEnteringPreview
        });
      } else if (_emailViewMode === EmailViewMode.preview && canDismissCard) {
        if (_flyoutToBottomLeft || _flyoutToBottomRight) {
          _flyoutToBottomLeft = _flyoutToBottomRight = false;
        } else {
          direction === -1
            ? dispatch({ type: "remindEmailInTime", payload: 1 })
            : dispatch({ type: "archiveEmail" });
        }

        // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out.
        removedEmailPreviewCards.add(index);

        if (index > -1) {
          dispatch({ type: "removeEmailPreviewCard", payload: index });
        }
      } else if (
        !down &&
        ((flick &&
          directionY < 0 &&
          deltaY < 0 &&
          Math.abs(directionY) > Math.abs(directionX)) ||
          deltaY <= -window.innerHeight / 6)
      ) {
        _emailViewMode = EmailViewMode.previewEnteringFull;

        dispatch({
          type: "UpdateEmailViewMode",
          payload: EmailViewMode.previewEnteringFull
        });
      }

      const removed = removedEmailPreviewCards.has(index);

      set(i => {
        // TODO: Currently only interested in changing the current spring.
        // However, in the future the current card should be able to manipulate
        // other cards. For example, by dragging the current card down, then
        // fade in the card underneath it.
        if (index !== i) return;

        let x = 0,
          y = 0,
          h = "56vh",
          rotation = 0,
          scale = 1,
          scaleXBg = 1,
          scaleYBg = 1;

        if (_emailViewMode === EmailViewMode.full) {
          if (deltaX === 0 || deltaY < 0) return;
          x = deltaX;
          y = deltaY;
          h = "85vh";
          scale = (-y / (window.innerHeight / 4)) * 0.15 + 1;
          scaleXBg = (scale / 1.1) * 1.2;
          scaleYBg = (scale / 1.1) * 1.7;
        } else if (_emailViewMode === EmailViewMode.previewEnteringFull) {
          h = "85vh";
          scaleXBg = 1.3;
          scaleYBg = 2.2;
          scale = 1.1;
        } else {
          // When a card is removed...
          if (removed) {
            x = window.innerWidth * 3 * direction;
            y = window.innerHeight;
            // How much the card tilts, flicking it harder makes it rotate faster.
            rotation = deltaX / 80 + direction * 2 * velocity;
          } else if (down) {
            x = deltaX;
            y = deltaY;
            // Scale up the active card.
            scale = (-y / (window.innerHeight / 4)) * 0.15 + 1;
            scaleXBg = scale;
            scaleYBg = scale;
            rotation = deltaX / 32;
          }
        }

        return {
          x,
          y,
          h,
          rotation,
          scale,
          scaleXBg,
          scaleYBg,
          config: { friction: 28, tension: down ? 400 : removed ? 50 : 300 }
        };
      });

      if (!down && last) {
        if (_emailViewMode === EmailViewMode.full) {
          set(i => {
            if (index === i) {
              return {
                x: 0,
                y: 0,
                h: "85vh",
                rotation: 0,
                scale: 1.1,
                scaleXBg: 1.3,
                scaleYBg: 2.2,
                config: { friction: 28, tension: 300 }
              };
            }
          });
        } else if (removed) {
          set(i => {
            if (i < emailPreviewCards.length) {
              return cardSpringDataTo(emailPreviewCards.length, i);
            }
          });
        }
      }

      switch (_emailViewMode) {
        case EmailViewMode.previewEnteringFull:
          _emailViewMode = EmailViewMode.full;

          dispatch({
            type: "UpdateEmailViewMode",
            payload: EmailViewMode.full
          });
          break;
        case EmailViewMode.fullEnteringPreview:
          _emailViewMode = EmailViewMode.preview;

          dispatch({
            type: "UpdateEmailViewMode",
            payload: EmailViewMode.preview
          });
          break;
        default:
      }

      // if (!down && gone.size === originalSize)
      //   setTimeout(() => gone.clear() || set(i => to(i)), 600);
    }
  );

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return springs.map(({ x, y, h, rotation, scale, scaleXBg, scaleYBg }, i) => (
    <animated.div
      className="card-wrapper"
      key={i}
      style={{
        transform: to(
          [x, y],
          (x, y) =>
            `perspective(100px) translate3d(${x}px, ${y}px, ${-4 *
              (emailPreviewCards.length - i)}px)`
        )
      }}
    >
      <animated.div
        className="card bg"
        style={{
          transform: to([rotation, scaleXBg, scaleYBg], toCardBgTransform)
        }}
      ></animated.div>
      {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which). */}
      <animated.div
        className={`card ${
          _emailViewMode === EmailViewMode.full ? "full" : ""
        }`}
        {...gesture(i)}
        style={{
          height: h,
          transform: to([rotation, scale], toCardTransform)
        }}
        onTouchMove={handleAdditionalActionsOnTouchOver}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        ref={cardRefs.current[i]}
      >
        <EmailPreviewCard mail={emailPreviewCards[i]} />
      </animated.div>
    </animated.div>
  ));
}

export default ZStackCardsView;
