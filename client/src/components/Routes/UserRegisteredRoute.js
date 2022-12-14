import { Navigate } from 'react-router-dom';
import { useEth } from '../../contexts/EthContext';

const RegisterAddProposalRoute =  ({ children }) => {
  const { state: { accounts, owner, userErr, userInfo, networkID, networkIDValid} } = useEth();
  let pathslice;
  if (userInfo !== null) {
    if (userInfo.name !== null) {
      const pathname = window.location.pathname.match(userInfo.name);
      if (pathname !== null) {
      pathslice = pathname.input.slice( pathname.index, pathname.index + userInfo.name.length);
      }
    }
  }
  
  return (
    (userErr !== "Vous n'etes pas un utilisateur" && userErr === "") 
    && accounts !== null 
    && userInfo !== null
    && userInfo.name !== null
    && userInfo.name === pathslice
    && accounts !== owner 
    && networkID === networkIDValid
    ) ? children : <Navigate to="/" />;
};

export default RegisterAddProposalRoute;
