import { Navigate } from 'react-router-dom';
import { useEth } from '../../contexts/EthContext';
import { contains } from '../Utils/Utils';

const UserRegisteredRouteAo =  ({ children }) => {
  const { state: { accounts,owner, userErr, userInfo, myArrayAoId, networkID, networkIDValid } } = useEth();
  let pathslice, pathslice2;

  if (userInfo !== null) {
    if (userInfo.name !== null) {
      const pathname = window.location.pathname.match(userInfo.name);
      if (pathname !== null) {
        pathslice = pathname.input.slice( pathname.index, pathname.index + userInfo.name.length);
        pathslice2 = pathname.input.slice(pathname.index + userInfo.name.length + 1,pathname.index + userInfo.name.length + 2);
      };
    };
  };
  

  
  return (
    (userErr !== "Vous n'etes pas un utilisateur" && userErr === "") 
    && accounts !== null 
    && userInfo !== null
    && userInfo.name !== null
    && userInfo.name === pathslice
    && contains(myArrayAoId, pathslice2)
    && accounts !== owner 
    && networkID === networkIDValid
    ) ? children : <Navigate to="/" />;
};

export default UserRegisteredRouteAo;
