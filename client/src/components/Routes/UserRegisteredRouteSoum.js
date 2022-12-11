import { Navigate } from 'react-router-dom';
import { useEth } from '../../contexts/EthContext';
import { containsInv } from '../Utils/Utils';

const UserRegisteredRouteSoum =  ({ children }) => {
  const { state: { accounts,owner, userErr, userInfo, myArrayLotId, networkID, networkIDValid} } = useEth();
  let pathslice, pathslice2;
  if (userInfo !== null) {
    if (userInfo.name !== null) {
      const pathname = window.location.pathname.match(userInfo.name);
      if (pathname !== null) {
        pathslice = pathname.input.slice( pathname.index, pathname.index + userInfo.name.length);
        const numberPattern = /\d+/;
        const numberMatch = pathname.input.match(numberPattern);
        if (numberMatch !== null) {
          pathslice2 = Number(numberMatch[0]);
        };
      };
    };
  };

  return (
    (userErr !== "Vous n'etes pas un utilisateur" && userErr === "") 
    && accounts !== null 
    && userInfo !== null
    && userInfo.name !== null
    && userInfo.name === pathslice
    && containsInv(myArrayLotId, pathslice2)
    && accounts !== owner 
    && networkID === networkIDValid
    ) ? children : <Navigate to="/" />;
};

export default UserRegisteredRouteSoum;
