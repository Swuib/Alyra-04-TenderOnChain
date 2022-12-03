import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifact => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        // const accounts = await web3.eth.requestAccounts();
        async function isMetaMaskConnected() {
          const {ethereum} = window;
          let accounts = await ethereum.request({method: 'eth_accounts'});
          console.log(accounts);
          if (accounts.length === 1) {
            accounts = accounts[0].toLowerCase();
            // dispatch(web3Init());
            // accountConnected = true;
        } else {
            accounts=null
            // dispatch(web3Clear());
            // accountConnected = false;
        };
          return accounts
        };
        const accounts = await isMetaMaskConnected();
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        let address, contract;
        try {
          // address
          address = artifact.networks[networkID].address;
          // contract
          contract = new web3.eth.Contract(abi, address);
          console.log('contract');
          console.log(contract);

        } catch (err) {
          console.error(err);
        }

        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/TenderOnChain.json");
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged","disconnect"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
