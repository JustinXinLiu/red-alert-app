import React, { createContext, useContext } from "react";

export const InitialState = {
  user: undefined,
  authenticated: false,
  error: undefined,
  maxDisplaySize: 5,
  emailPreviewCards: ["", "", "", ""],
  removedEmailPreviewCards: new Set(),
  cardSpringDataFrom: () => ({
    x: 0,
    y: window.outerHeight,
    rotation: 0,
    scale: 1
  }),
  cardSpringDataTo: (count, i) => ({
    x: 0,
    y: (count - 1 - i) * -18,
    scale: 1,
    rotation: 0,
    delay: i * 100
  }),
  touchState: { overInbox: false, overReminder: false }
};

export const Reducer = (state, action) => {
  switch (action.type) {
    case "getUserDetails":
      return {
        ...state,
        ...action.payload
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

    default:
      throw new Error("Unexpected action!");
  }
};

export const Store = createContext();

export const StoreProvider = ({ value, children }) => (
  <Store.Provider value={value}>{children}</Store.Provider>
);

export const useStateValue = () => useContext(Store);
