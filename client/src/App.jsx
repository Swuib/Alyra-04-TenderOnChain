import "./App.css";
import { useEth } from "./contexts/EthContext";
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import Routes from './components/Routes';
import { useDispatch } from 'react-redux';
import { clearData, setOwner, setUser, setUserErr } from "./contexts/Redux/actions/init.actions";

const App = () => {
  const dispatch = useDispatch();
  const { state: { contract, accounts, networkID } } = useEth();

  console.log(contract,accounts,networkID);
  useEffect(() => {
    if (contract !== undefined) {
      if (accounts !== null) {
        if (accounts.length > 0 ) {
          const fetchData = async () => {
            // const resUser = await contract.methods.getAccount(accounts).call({ from: accounts });
            // dispatch(setUser(resUser));
            const resOwner = await contract.methods.owner().call({ from: accounts });
            const owner = resOwner.toLowerCase();
            dispatch(setOwner(owner));
            // const resWorkflow = await contract.methods.workflowStatus().call({ from: accounts[0] });
            // setOwner(resOwner.toLowerCase());
            // setUser(accounts[0].toLowerCase());
            // setWorkFlow(parseInt(resWorkflow));
            await contract.methods.getAccount(accounts).call({from: accounts }).then( res => {
              dispatch(setUser(res));
              dispatch(setUserErr(""));
            }).catch(error => {
              const errorObject = JSON.parse(error.toString().replace("Error: Internal JSON-RPC error.", ""));
              dispatch(setUserErr(errorObject.message.replace("VM Exception while processing transaction: revert ", "")));
            });
          };
          fetchData();
        }
      } else {
        dispatch(clearData());
      }
    } else {
      dispatch(clearData());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);
  


  return (
    <>
    <Toaster
          id="toaster"
          position="bottom-center"
          reverseOrder={false}
          gutter={8}
          containerClassName="Toaster-container"
          containerStyle={{zIndex: "999999999999999999999999"}}
          toastOptions={{
            // Define default options
            className: '',
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
        
            // Default options for specific types
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
            error: {
              duration: 3000,
              theme: {
                primary: 'red',
                secondary: 'black',
              },
            },
          }}/>
      <Routes />
    </>
  );
};

export default App;