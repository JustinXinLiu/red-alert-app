import React, { useState } from "react";
import { useSpring, useSprings, animated, interpolate } from "react-spring";
import { useDrag } from "react-use-gesture";
import "./App.css";

const cards = [
  "https://images.unsplash.com/photo-1566863244489-a5e7946f46f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1566863244489-a5e7946f46f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1566863244489-a5e7946f46f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1566863244489-a5e7946f46f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1566863244489-a5e7946f46f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1566863244489-a5e7946f46f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80"
];

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({
  x: 0,
  y: i * 12,
  scale: 1,
  rot: 0,
  delay: i * 100
});
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: window.outerHeight });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const transform = (r, s) =>
  `perspective(1500px) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

function ZStackCardView() {
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
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
      direction: [xDir],
      velocity
    }) => {
      const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      if (!down && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      set(i => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        console.log("isGone", isGone);
        console.log("down", down);

        const x = isGone ? (window.innerWidth / 2) * dir : down ? xDelta : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const y = isGone ? window.innerHeight : down ? yDelta : i * 12;
        const rot = isGone
          ? xDelta / 40 + dir * 10 * velocity
          : down
          ? xDelta / 40
          : 0; // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1; // Active cards lift up a bit

        return {
          x,
          y,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
        };
      });
      if (!down && gone.size === cards.length)
        setTimeout(() => gone.clear() || set(i => to(i)), 600);
    }
  );
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return props.map(({ x, y, rot, scale }, i) => (
    <animated.div
      className="outer"
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
        className="inner"
        {...bind(i)}
        style={{
          transform: interpolate([rot, scale], transform),
          backgroundImage: `url(${cards[i]})`
        }}
      />
    </animated.div>
  ));
}

// const calc = (x, y) => [
//   -(y - window.innerHeight / 2) / 40,
//   (x - window.innerWidth / 2) / 40,
//   1.01
// ];
// const transform = (x, y, s) =>
//   `perspective(2400px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

function App() {
  // const [restShadow, setRestShadow] = useState(false);

  // const [props, set] = useSpring(() => ({
  //   xys: [0, 0, 1],
  //   config: { mass: 2, tension: 400, friction: 36 }
  // }));

  return (
    <div className="app">
      <div className="card-container">
        {/* <animated.div
          className={`card ${restShadow ? "rest-shadow" : ""}`}
          onPointerEnter={() => setRestShadow(false)}
          onPointerMove={({ clientX: x, clientY: y }) =>
            set({ xys: calc(x, y) })
          }
          onPointerOut={() => set({ xys: [0, 0, 1] })}
          onTouchEnd={() => setRestShadow(true)}
          style={{ transform: props.xys.interpolate(transform) }}
        /> */}

        <ZStackCardView />
      </div>
    </div>
  );
}

export default App;
