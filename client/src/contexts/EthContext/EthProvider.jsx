import React, { useReducer, useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { ConvertEpochToLocalDate } from "../../components/Utils/Utils";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [waiting, setWaiting] = useState(true);

  const init = useCallback(
    async artifact => {
      if (artifact) {
        // change for deploy <======================
        const networkIDValid = 5;
        // ==use this for testnet===================
        // const networkIDValid = Your network value;
        // =========================================
        setWaiting(true);
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  console.log(web3);
        async function isMetaMaskConnected() {
          const {ethereum} = window;
          let accounts = await ethereum.request({method: 'eth_accounts'});
          let owner = null,
            priceAO = null,
            priceLot = null,
            userErr = null,
            userInfo = null,
            aoLength = null, 
            lotLength = null, 
            userLength=null,
            myParticipationLength = null; 
          let arrayAo = [], 
            arrayLot = [], 
            myArrayAoId = [], 
            myArrayLotId = [], 
            myArrayAo = [], 
            myArrayLot = [], 
            myParticipation = [],
            usersAccount=[];
          
          if (accounts.length === 1 && contract !== undefined && address !== undefined) {
            accounts = accounts[0].toLowerCase();
            // user Info / user error
            await contract.methods.getAccount(accounts).call({from: accounts }).then( res => {
              userInfo = {
                name:res.name.replace(/ /g, "_"),
                isRegistred:res.isRegistred,
                isAuditor:res.isAuditor,
                isApproval:res.isApproval,
                dateApprouval:res.dateApprouval,
                adresseValidateur:res.adresseValidateur,
                countNFTReal:Number(res.countNFTReal),
                countNFTWinner:Number(res.countNFTWinner),
                countParticipation:Number(res.countParticipation)
              };
              userErr = "";
            }).catch(error => {
              setWaiting(false);
              userInfo = {
                name: null,
                isRegistred: null,
                isAuditor: null,
                isApproval: null,
                dateApprouval: null,
                adresseValidateur: null,
                countNFTReal:null,
                countNFTWinner:null,
                countParticipation:null
              };
               console.log(error.toString().replace("Error: execution reverted: Vous n'etes pas un utilisateur", ""));
              
              
              // change for deploy <======================
              const errorObject = JSON.parse(error.toString().replace("Error: execution reverted: Vous n'etes pas un utilisateur", ""));
       console.log(errorObject);
              userErr = errorObject.originalError.message.replace("execution reverted: ", "");
              // ==use this for testnet===================
              // const errorObject = JSON.parse(error.toString().replace("Error: Internal JSON-RPC error.", ""));
              // userErr = errorObject.message.replace("VM Exception while processing transaction: revert ", "");
              // =========================================
              userErr = errorObject.message.replace("VM Exception while processing transaction: revert ", "");
              
            });
       console.log(userErr);
            try {
              
              if (userErr === "") {
  
                // let oldEventsAccount = await contract.getPastEvents('userAdded', {fromBlock: valueBlock, toBlock: 'latest'});
                // owner
                owner = await contract.methods.owner().call({ from: accounts });
                owner = owner.toLowerCase();
                // price AO
                priceAO = await contract.methods.priceAO().call({ from: accounts });
                // price LOT
                priceLot = await contract.methods.priceLot().call({ from: accounts });
                // Ao length
                aoLength= await contract.methods.aoLength().call({ from: accounts });
                aoLength = Number(aoLength);
                // Lot length
                lotLength = await contract.methods.lotLength().call({ from: accounts });
                lotLength = Number(lotLength);
                // user length
                userLength = await contract.methods.userLength().call({ from: accounts });
                userLength = Number(userLength);
                // Participant length
                myParticipationLength = await contract.methods.getParticipationLength(accounts).call({ from: accounts });
                myParticipationLength = Number(myParticipationLength);

                if (userLength > 0) {
                  for (let index = 0; index < userLength; index++) {
                    const users = await contract.methods.users(index).call({ from: accounts });
                    const repuser = await contract.methods.getAccount(accounts).call({from: accounts })
                    usersAccount.push({address:users, name:repuser.name})
                  }                  
                }

                if (aoLength > 0) {
                  for (let i = 0; i < aoLength; i++) {
                    const respAo = await contract.methods.arrayAO(i).call({ from: accounts });
                    arrayAo.push({
                      index:i,
                      adressDDO:respAo.adressDDO, 
                      aoName:respAo.aoName, 
                      createdAt:ConvertEpochToLocalDate(respAo.createdAt), 
                      isOpen:respAo.isOpen, 
                      lastLotId: Number(respAo.lastLotId)
                    });
                    if (accounts === respAo.adressDDO.toLowerCase()) {
                      myArrayAoId.push(i);
                      myArrayAo.push({
                        index:i,
                        adressDDO:respAo.adressDDO, 
                        aoName:respAo.aoName , 
                        createdAt:ConvertEpochToLocalDate(respAo.createdAt), 
                        isOpen:respAo.isOpen, 
                        lastLotId: Number(respAo.lastLotId)
                      });
                    };
                  };
                };
                
                let added = false;
                if (lotLength > 0) {
                  for (let i = 0; i < lotLength; i++) {
                    const respLot = await contract.methods.getArrayLots(i).call({ from: accounts });
                    added = false;
                    for (let a = 0; a < arrayAo.length; a++) {
                      if (arrayAo[a].adressDDO === respLot.adressDDO && !added) {
                        if (usersAccount.length > 0) {
                          for (let b = 0; b < usersAccount.length; b++) {
                            if (usersAccount[b].address === respLot.adressDDO ) {
                              arrayLot.push({
                                index:i,
                                name: usersAccount[b].name, 
                                adressDDO:respLot.adressDDO,
                                aoName:arrayAo[a].aoName, 
                                description:respLot.description,
                                idAO:Number(respLot.idAO),
                                minprice:Number(respLot.minprice), 
                                maxprice:Number(respLot.maxprice), 
                                partLengt:Number(respLot.partLengt), 
                                participants:respLot.part, 
                                categorie:respLot.categorie, 
                                susCategorie:respLot.susCategorie, 
                                TsCloture:ConvertEpochToLocalDate(respLot.TsCloture), 
                                isNftAttributionEmit:respLot.isNftAttributionEmit, 
                                isNftRealisationEmit:respLot.isNftRealisationEmit,
                                TsAtt:ConvertEpochToLocalDate(respLot.TsAtt),
                                winner:respLot.winner, 
                                uriPdf:respLot.URIPDF
                              });
                              added = true;
                              if (accounts === respLot.adressDDO.toLowerCase()) {
                                myArrayLotId.push(i);
                                myArrayLot.push({
                                  index:i,
                                  name:usersAccount[b].name, 
                                  adressDDO:respLot.adressDDO,
                                  aoName:arrayAo[a].aoName, 
                                  description:respLot.description,
                                  idAO:Number(respLot.idAO),
                                  minprice:Number(respLot.minprice), 
                                  maxprice:Number(respLot.maxprice), 
                                  partLengt:Number(respLot.partLengt), 
                                  participants:respLot.part, 
                                  categorie:respLot.categorie, 
                                  susCategorie:respLot.susCategorie, 
                                  TsCloture:ConvertEpochToLocalDate(respLot.TsCloture), 
                                  isNftAttributionEmit:respLot.isNftAttributionEmit, 
                                  isNftRealisationEmit:respLot.isNftRealisationEmit, 
                                  TsAtt:ConvertEpochToLocalDate(respLot.TsAtt),
                                  winner:respLot.winner, 
                                  uriPdf:respLot.URIPDF
                                });
                              };
                            }
                          }
                        }
                      };
                    };
                  };
                };
  
                if (userInfo.countParticipation > 0 ) {
                  for (let i = 0; i < userInfo.countParticipation; i++) {
                    const resParticipation = await contract.methods.getMyParticipation(i).call({ from: accounts });
                    myParticipation.push({
                      Tsprice1:ConvertEpochToLocalDate(resParticipation.Tsprice1),
                      idLot:Number(resParticipation.idLot),
                      isRealisation:resParticipation.isRealisation,
                      isWinner:resParticipation.isWinner,
                      price1:Number(resParticipation.price1)
                    });
                  };
                };
  
              };
            } catch (error) {
              console.log(error);
            }

          } else {
          owner = null;
          accounts = null;
          userInfo = null;
          userErr = null;
          priceLot = null;
          priceAO = null;
          aoLength = null;
          lotLength = null;
          userLength = null;
          arrayAo = [];
          arrayLot = [];
          myArrayAoId = [];
          myArrayAo = [];
          myArrayLotId = [];
          myArrayLot = [];
          myParticipation = [];
        };
          return {
            accounts, 
            owner, 
            priceAO,
            priceLot, 
            userErr, 
            userInfo, 
            aoLength, 
            lotLength, 
            userLength, 
            arrayAo, 
            arrayLot,
            myArrayAoId,
            myArrayAo,
            myArrayLotId,
            myArrayLot,
            myParticipation,
            myParticipationLength,
            usersAccount
          }
        };
        
        const networkID = await web3.eth.net.getId();
        console.log(networkID);
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
        console.log(address, contract);
        const {
          accounts, 
          owner, 
          priceAO, 
          priceLot, 
          userErr, 
          userInfo, 
          aoLength, 
          lotLength, 
          userLength, 
          arrayAo, 
          arrayLot,
          myArrayAoId,
          myArrayAo,
          myArrayLotId,
          myArrayLot,
          myParticipation,
          myParticipationLength,
          usersAccount
        } = await isMetaMaskConnected();
  console.log(waiting);
        setWaiting(false);
  console.log(waiting);
        dispatch({
          type: actions.init,
          data: { 
            artifact, 
            web3, 
            accounts, 
            networkID, 
            contract, 
            owner,
            priceAO,
            priceLot,
            userInfo,
            userErr,
            aoLength,
            arrayAo,
            lotLength,
            userLength,
            arrayLot,
            myArrayAoId,
            myArrayAo,
            myArrayLotId,
            myArrayLot,
            networkIDValid,
            myParticipation,
            myParticipationLength,
            usersAccount
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
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);
  
  return (
    <EthContext.Provider value={{
      state,
      dispatch,
      init,
      waiting
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
