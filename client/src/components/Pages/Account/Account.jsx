import React from 'react';
import { Link } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
// import { useLocation } from 'react-router-dom';
import Header from '../../Layout/Header/Header';
import NavInfo from '../../Layout/NavInfo/NavInfo';

const Account = () => {
    const { state: { userInfo } } = useEth();
    return (
        <>
            <Header/>
            <main>
                <section>
                    <NavInfo />
                </section>
                <section>
                    <div className="main-container">
                        <div className="left-account-container">
                            <Link to={`/Account/${userInfo.name}/MyAO`}>
                                <button className="myButton">Voir mes Appels d’offres</button>
                            </Link>
                            <Link to={`/Account/${userInfo.name}/CreateAO`}>
                                <button className="myButton">Créer un Appel d’offres</button>
                            </Link>
                            <Link to={`/`}>
                                <button className="myButton">Mon Tableau de bord</button>
                            </Link>
                        </div>
                        <div className="rigth-account-container">
                            <Link to={`/Account/${userInfo.name}/MySoum`}>
                                <button className="myButton">Voir mes participations en cours</button>
                            </Link>
                            <Link to={`/Account/${userInfo.name}/Soum`}>
                                <button className="myButton">Voir tous les Appels d’offres</button>
                            </Link>
                            <Link to={`/`}>
                                <button className="myButton">Mon historique</button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Account;