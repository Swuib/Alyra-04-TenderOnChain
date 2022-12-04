// import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
// import UidContext from '../../contexts/App/AppContext';
import { useEth } from '../../contexts/EthContext';

const RegisterAddProposalRoute =  ({ children }) => {
  const { state: { accounts, userErr,userInfo } } = useEth();
  let pathslice;
  if (userInfo !== null) {
    if (userInfo.name !== null) {
      const pathname = window.location.pathname.match(userInfo.name);
      pathslice = pathname.input.slice( pathname.index, pathname.index + userInfo.name.length);
    }
  }
  
  return (
    (userErr !== "You're not a user" && userErr === "") 
    && accounts !== null 
    && userInfo !== null
    && userInfo.name !== null
    && userInfo.name === pathslice
    /*&& user !== owner 
    && networkID === 5777*/) ? children : <Navigate to="/" />;
};

export default RegisterAddProposalRoute;
