import React from 'react';
import { Link } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Header from '../../Layout/Header/Header';
import NavInfo from '../../Layout/NavInfo/NavInfo';
import Loader from '../../Layout/Loader/Loader';
import './account.css';

const Account = () => {
    const { state: { userInfo },waiting } = useEth();
    return (
        <>
            <Header/>
            <main>
                <section className="section-nav">
                    <NavInfo />
                </section>
                <section> 
                    <div id="main-container-account">
                        <div id="top-account-container">
                            <p>
                                TenderOnChain est la Marketplace d'appels d'offres du secteur 
                                privé améliorant la transparence, la sécurité des procédures 
                                et la concurrence grâce à la technologie blockchain.
                            </p>
                        </div>
                        <div id="bottom-account-container">
                            {waiting === true ? (
                                <div className='waiting'>
                                    <Loader size={"large"}/>
                                </div>
                            ) : (
                                <>
                                    <div id="left-account-container">
                                        <Link to={`/Account/${userInfo.name}/MyAO`}>
                                            <button className="myButton">Voir mes Appels d’offres</button>
                                        </Link>
                                        <Link to={`/Account/${userInfo.name}/CreateAO`}>
                                            <button className="myButton">Créer un Appel d’offres</button>
                                        </Link>
                                    </div>
                                    <div id="rigth-account-container">
                                        <Link to={`/Account/${userInfo.name}/MySoum`}>
                                            <button className="myButton">Voir mes participations en cours</button>
                                        </Link>
                                        <Link to={`/Account/${userInfo.name}/Soum`}>
                                            <button className="myButton">Voir tous les Appels d’offres</button>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Account;