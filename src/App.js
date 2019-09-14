import React from "react";
import { StateProvider } from "./state";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import "./App.css";
import { AppBar, ActionBar, ZStackCardsView } from "./components";

const theme = createMuiTheme({
  palette: {
    primary: { 500: "#fccb1e" },
    // theme.palette.action.active
    action: { active: "rgba(3,2,1,0.2)" }
  }
});

function App() {
  const initialState = {
    touchState: { overInbox: false, overReminder: false }
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "movePointerOverInbox":
        return {
          ...state,
          touchState: action.touchState
        };
      case "movePointerOverReminder":
        return {
          ...state,
          touchState: action.touchState
        };
      case "movePointerOut":
        return {
          ...state,
          touchState: action.touchState
        };

      default:
        return state;
    }
  };

  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <ThemeProvider theme={theme}>
        <div className="app">
          <div className="header">
            <AppBar />
          </div>

          <ZStackCardsView />

          <div className="footer">
            <ActionBar />
          </div>
        </div>
      </ThemeProvider>
    </StateProvider>
  );
}

export default App;
