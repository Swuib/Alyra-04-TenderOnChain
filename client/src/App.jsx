import "./App.css";
import { useEth } from "./contexts/EthContext";
import { Toaster } from 'react-hot-toast';
import Routes from './components/Routes';

const App = () => {
  const  {state}  = useEth();
  console.log('-----------------------APP-----------------------');
  console.log(state);
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