import { useState, useEffect } from "react";

let globalState = {};
let listeners = [];
let actions = {};

export const useStore = () => {
  /**
   * Custom global store managment system made with the purpuse of replacing
   * Redux library due to incompatibility with managment of complex type
   * states (i.e. MediaStream).
   *
   * For more info check: https://redux.js.org/style-guide/style-guide
   *
   */
  const setState = useState(globalState)[1];

  const dispatch = (actionID, payload = undefined) => {
    const newState = actions[actionID](globalState, payload);
    globalState = { ...globalState, ...newState };

    for (const listener of listeners) {
      listener(globalState);
    }
  };

  useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((listener) => listener !== setState);
    };
  }, [setState]);

  return [globalState, dispatch];
};

export const initStore = (userActions, initialState) => {
  if (initialState) {
    globalState = { ...globalState, ...initialState };
  }
  actions = { ...actions, ...userActions };
};
