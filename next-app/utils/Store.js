import { createContext, useReducer } from "react";
export const Store = createContext();
const initialState = {
  walletAddress: '',
}

function reducer(state, action) {
  switch (action.type) {
    case "CHANGE_WALLET_ADDRESS":
      return { ...state, walletAddress: action.payload };

  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}