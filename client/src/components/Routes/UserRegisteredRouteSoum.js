import { Navigate } from 'react-router-dom';
import { useEth } from '../../contexts/EthContext';
import { containsKeyInv } from '../Utils/Utils';

const UserRegisteredRouteSoum =  ({ children }) => {
  const { state: { accounts,owner, userErr, userInfo, myArrayLot, networkID, networkIDValid} } = useEth();
  let pathslice, pathslice2;
  if (userInfo !== null) {
    if (userInfo.name !== null) {
      const pathname = window.location.pathname.match(userInfo.name);
      if (pathname !== null) {
      pathslice = pathname.input.slice( pathname.index, pathname.index + userInfo.name.length); // user name
      pathslice2 = Number(pathname.input.slice(window.location.pathname.length - 1));
      };
    };
  };

  return (
    (userErr !== "Vous n'etes pas un utilisateur" && userErr === "") 
    && accounts !== null 
    && userInfo !== null
    && userInfo.name !== null
    && userInfo.name === pathslice
    && containsKeyInv(myArrayLot,'index', pathslice2)
    && accounts !== owner 
    && networkID === networkIDValid
    ) ? children : <Navigate to="/" />;
};

export default UserRegisteredRouteSoum;
