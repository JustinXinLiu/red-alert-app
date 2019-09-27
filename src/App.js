import React, { useReducer, useEffect } from "react";
import { StoreProvider, Reducer, InitialState } from "./Store";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import "./App.scss";
import { AppBar, ActionBar, ZStackCardsView } from "./components";
import config from "./Config";
import { UserAgentApplication } from "msal";
import { getUserDetails, getMails } from "./services/GraphService";

const theme = createMuiTheme({
  palette: {
    primary: { 500: "#fccb1e" },
    // theme.palette.action.active
    action: { active: "rgba(3,2,1,0.2)" }
  },
  // shadows: ["none"],
  MuiButtonBase: {
    disableRipple: true
  }
});

function App() {
  const [state, dispatch] = useReducer(Reducer, InitialState);

  useEffect(() => {
    const userAgentApp = new UserAgentApplication({
      auth: {
        clientId: config.appId
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
      }
    });

    async function getUserProfile(userAgentApp) {
      try {
        // Get the access token silently
        // If the cache contains a non-expired token, this function
        // will just return the cached token. Otherwise, it will
        // make a request to the Azure OAuth endpoint to get a token

        const accessToken = await userAgentApp.acquireTokenSilent({
          scopes: config.scopes
        });

        if (accessToken) {
          // Get the user's profile from Graph.
          const user = await getUserDetails(accessToken);
          console.log("user", user);

          dispatch({
            type: "getUserDetails",
            payload: {
              user: {
                displayName: user.displayName,
                email: user.mail || user.userPrincipalName
              },
              authenticated: true,
              error: null
            }
          });

          const emails = await getMails(accessToken);
          console.log("emails", emails);
        }
      } catch (err) {
        handleError(err);
      }
    }

    async function login(userAgentApp) {
      try {
        await userAgentApp.loginPopup({
          scopes: config.scopes,
          prompt: "select_account"
        });
        await getUserProfile(userAgentApp);
      } catch (err) {
        handleError(err);
      }
    }

    const user = userAgentApp.getAccount();

    if (user) {
      getUserProfile(userAgentApp);
    } else {
      login(userAgentApp);
    }
  }, []);

  return (
    <StoreProvider value={[state, dispatch]}>
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
    </StoreProvider>
  );

  function handleError(err) {
    console.log(`%c [FETCH ERROR]: "${err}"`, "color: red; font-weight: bold");
    let error = {};
    if (typeof err === "string") {
      const errParts = err.split("|");
      error =
        errParts.length > 1
          ? { message: errParts[1], debug: errParts[0] }
          : { message: err };
    } else {
      error = {
        message: err.message,
        debug: JSON.stringify(err)
      };
    }
    dispatch({
      type: "handleError",
      payload: {
        user: {},
        authenticated: false,
        error: error
      }
    });
  }
}

export default App;
