import { Navigate } from 'react-router-dom';
import { useEth } from '../../contexts/EthContext';

const OwnerRoute =  ({ children }) => {
  const { state: {owner,accounts, networkID ,networkIDValid} } = useEth();
  return owner === accounts && networkID === networkIDValid ? children : <Navigate to="/" />;
};

export default OwnerRoute;
