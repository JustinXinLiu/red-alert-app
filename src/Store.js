import React, { createContext, useContext } from "react";

export const InitialState = {
  user: undefined,
  authenticated: false,
  error: undefined,
  maxDisplaySize: 4,
  emailPreviewCards: ["", "", "", ""],
  removedEmailPreviewCards: new Set(),
  cardSpringDataFrom: () => ({
    x: 0,
    y: window.outerHeight,
    yContent: 0,
    rotation: 0,
    scale: 1,
    scalgXBg: 1,
    scaleYBg: 1
  }),
  cardSpringDataTo: (count, i) => ({
    x: 0,
    y: (count - 1 - i) * -18,
    yContent: 0,
    scale: 1,
    scaleXBg: 1,
    scaleYBg: 1,
    rotation: 0,
    delay: i * 50
  }),
  touchState: { overInbox: false, overReminder: false },
  enterEmailView: false
};

export const Reducer = (state, action) => {
  switch (action.type) {
    case "getUserDetails":
      return {
        ...state,
        ...action.payload
      };
    case "handleError":
      return {
        ...state,
        ...action.payload
      };
    case "getEmailPreviews":
      return {
        ...state,
        emailPreviewCards: action.payload
      };
    case "removeEmailPreviewCard":
      const i = action.payload;
      state.emailPreviewCards.splice(i, 1);
      return {
        ...state
      };
    case "showInboxActions":
      return {
        ...state,
        touchState: { overInbox: true, overReminder: false }
      };
    case "showReminderActions":
      return {
        ...state,
        touchState: { overInbox: false, overReminder: true }
      };
    case "hideActions":
      return {
        ...state,
        touchState: { overInbox: false, overReminder: false }
      };
    case "archiveEmail":
      return {
        ...state
      };
    case "ignoreEmail":
      return {
        ...state
      };
    case "remindEmailInTime":
      return {
        ...state
      };
    case "enterFullEmailView":
      return {
        ...state,
        enterEmailView: true
      };
    case "exitFullEmailView":
      return {
        ...state,
        enterEmailView: false
      };

    default:
      throw new Error("Unexpected action!");
  }
};

export const Store = createContext();

export const StoreProvider = ({ value, children }) => (
  <Store.Provider value={value}>{children}</Store.Provider>
);

export const useStateValue = () => useContext(Store);
