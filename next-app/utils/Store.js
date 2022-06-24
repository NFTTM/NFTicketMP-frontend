import { createContext, useReducer } from "react";
export const Store = createContext();
const initialState = {
  walletConencted: false,
  correctNetworkConnected: false,
  account: '',
  provider: null,
  signer: null,
}

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_WALLET_CONNECTED":
      console.log("UPDATE_WALLET_CONNECTED..", action.payload)
      return { ...state, walletConencted: action.payload };
    case "UPDATE_CORRECT_NETWORK_CONNECTED":
      return { ...state, correctNetworkConnected: action.payload}
    case "UPDATE_ACCOUNT":
      console.log("UPDATE_ACCOUNT..", action.payload)
      return { ...state, account: action.payload };
    case "UPDATE_PROVIDER":
      return { ...state, provider: action.payload };
    case "UPDATE_SIGNER":
      return { ...state, signer: action.payload };
    case "RESET_ACCOUNT":
      return { ...state, walletConencted: false, walletAddress: '' };
    case "RESET_PROVIDER":
      return { ...state, provider: null };
    case "RESET_SIGNER":
      return { ...state, signer: null };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}