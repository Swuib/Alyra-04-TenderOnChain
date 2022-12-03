import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UidContext from '../../contexts/App/AppContext';
import { useEth } from '../../contexts/EthContext';

const RegisterAddProposalRoute =  ({ children }) => {
  const { state: { networkID } } = useEth();
  const { owner, user,userErr, workflow } = useContext(UidContext);
  return ((userErr !== "You're not a voter" && userErr === "") && workflow === 1 && user !== null && user !== owner && networkID === 5777) ? children : <Navigate to="/" />;
};

export default RegisterAddProposalRoute;
