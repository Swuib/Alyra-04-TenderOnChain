import React, { useReducer, useCallback, useEffect } from "react";
// import { useState } from "react";
import Web3 from "web3";
// import { useLocalStorage } from "../../components/Utils/Utils";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifact => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

        async function isMetaMaskConnected() {
          const {ethereum} = window;
          let accounts = await ethereum.request({method: 'eth_accounts'});
          let owner,userErr,userInfo;
          
          if (accounts.length === 1) {
            accounts = accounts[0].toLowerCase();
            // owner
            owner = await contract.methods.owner().call({ from: accounts });
            owner = owner.toLowerCase();
            // user Info / user error
            await contract.methods.getAccount(accounts).call({from: accounts }).then( res => {
              userInfo = {
                name:res.name,
                isRegistred:res.isRegistred,
                isAuditor:res.isAuditor,
                isApproval:res.isApproval,
                dateApprouval:res.dateApprouval,
                adresseValidateur:res.adresseValidateur
              };
              userErr = "";
            }).catch(error => {
              const errorObject = JSON.parse(error.toString().replace("Error: Internal JSON-RPC error.", ""));
              userInfo = {
                name: null,
                isRegistred: null,
                isAuditor: null,
                isApproval: null,
                dateApprouval: null,
                adresseValidateur: null
              };
              userErr = errorObject.message.replace("VM Exception while processing transaction: revert ", "");
            });
        } else {
            accounts = null;
            userInfo = null;
            userErr = null;
        };
          return {accounts, owner, userErr, userInfo}
        };
        
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        
        let address, contract;
        try {
          // address
          address = artifact.networks[networkID].address;
          // contract
          contract = new web3.eth.Contract(abi, address);
        } catch (err) {
          console.error(err);
        }

        const {accounts, owner, userErr, userInfo} = await isMetaMaskConnected();

        dispatch({
          type: actions.init,
          data: { 
            artifact, 
            web3, 
            accounts, 
            networkID, 
            contract, 
            owner,
            userInfo,
            userErr
          }
        });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
      // window.location.reload();
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
