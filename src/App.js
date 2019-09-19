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
    emailPreviewCards: ["", "", "", ""],
    cardSpringDataFrom: () => ({
      x: 0,
      y: window.outerHeight,
      rot: 0,
      scale: 1
    }),
    cardSpringDataTo: (count, i) => ({
      x: 0,
      y: (count - 1 - i) * -18,
      scale: 1,
      rot: 0,
      delay: i * 100
    }),
    touchState: { overInbox: false, overReminder: false }
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "showInboxActions":
        return {
          ...state,
          cardSpringDataFrom: () => undefined,
          touchState: { overInbox: true, overReminder: false }
        };
      case "showReminderActions":
        return {
          ...state,
          cardSpringDataFrom: () => undefined,
          touchState: { overInbox: false, overReminder: true }
        };
      case "hideActions":
        return {
          ...state,
          touchState: { overInbox: false, overReminder: false }
        };

      default:
        throw new Error("Unexpected action!");
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
