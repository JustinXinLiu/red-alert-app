import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import "./App.css";

const calc = (x, y) => [
  -(y - window.innerHeight / 2) / 40,
  (x - window.innerWidth / 2) / 40,
  1.01
];
const trans = (x, y, s) =>
  `perspective(2400px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

function App() {
  const [restShadow, setRestShadow] = useState(false);

  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 2, tension: 400, friction: 36 }
  }));

  return (
    <div className="app">
      <div className="card-container">
        <animated.div
          className={`card ${restShadow ? "rest-shadow" : ""}`}
          onPointerEnter={() => setRestShadow(false)}
          onPointerMove={({ clientX: x, clientY: y }) =>
            set({ xys: calc(x, y) })
          }
          onPointerOut={() => set({ xys: [0, 0, 1] })}
          onTouchEnd={() => setRestShadow(true)}
          style={{ transform: props.xys.interpolate(trans) }}
        />
      </div>
    </div>
  );
}

export default App;
