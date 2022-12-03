import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UidContext from '../../contexts/App/AppContext';
import { useEth } from '../../contexts/EthContext';

const OwnerAddUserRoute =  ({ children }) => {
  const { state: { networkID } } = useEth();
  const {owner, user, userErr, workflow} = useContext(UidContext);
  return (((owner === user || (userErr !== "You're not a voter" && userErr === "")) && workflow === 0 && user !== null && networkID === 5777)) ? children : <Navigate to="/" />;
};

export default OwnerAddUserRoute;
