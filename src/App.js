import React, { useState } from "react";
import { useSprings, animated, interpolate } from "react-spring";
import { useDrag } from "react-use-gesture";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import "./App.css";
import { AppBar } from "./components";

const cards = ["", "", "", ""];
// const originalSize = cards.length;

// This is just helpers, they curate spring data, values that are later being interpolated into css
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: window.outerHeight });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const transform = (r, s) =>
  `perspective(1500px) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

function ZStackCardView() {
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out

  // This is just helpers, they curate spring data, values that are later being interpolated into css
  const to = i => ({
    x: 0,
    y: (cards.length - 1 - i) * -18,
    scale: 1,
    rot: 0,
    delay: i * 100
  });

  const [props, set] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i)
  })); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
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
          cards.splice(index, 1);
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
          : (cards.length - 1 - i) * -18;
        const rot = isGone
          ? xDelta / 40 + dir * 10 * velocity
          : down
          ? xDelta / 40
          : 0; // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1; // Active cards lift up a bit

        // console.log("yDir", yDir);

        return {
          x,
          y,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
        };
      });

      if (last && !down) {
        set(i => {
          if (i < cards.length) return to(i);
        });
      }

      // if (!down && gone.size === originalSize)
      //   setTimeout(() => gone.clear() || set(i => to(i)), 600);
    }
  );
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return props.map(({ x, y, rot, scale }, i) => (
    <animated.div
      className="card-wrapper"
      key={i}
      style={{
        transform: interpolate(
          [x, y],
          (x, y) => `perspective(100px) translate3d(${x}px, ${y}px, ${4 * i}px)`
        )
      }}
    >
      {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
      <animated.div
        className="card"
        {...bind(i)}
        style={{
          transform: interpolate([rot, scale], transform),
          backgroundImage: `url(${cards[i]})`
        }}
      />
    </animated.div>
  ));
}

const theme = createMuiTheme({
  palette: {
    primary: { 500: "#fccb1e" },
    // theme.palette.action.active
    action: { active: "rgba(3,2,1,0.2)" }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <div className="header">
          <AppBar />
        </div>

        <ZStackCardView />
      </div>
    </ThemeProvider>
  );
}

export default App;
