import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Header from '../../Layout/Header/Header';
import NavInfo from '../../Layout/NavInfo/NavInfo';
import './detailsmylot.css'

const DetailsMyLot = () => {
    const { state: { userInfo } } = useEth();
    const location = useLocation();
    const [locationState,] = useState(location.state);
    return (
        <>
            <Header/>
            <main>
                <section className="section-nav">
                    <NavInfo context={locationState}/>
                </section>
                <section>
                    <div id="main-container-details-lot">    
                        <div id="container-details-lot-top">
                            <div id="container-details-lot-top-left">
                                <div id="container-details-lot-top-left-top">
                                    <div id="container-details-lot-top-left-top-left">
                                        <p className='title-ref'>Mon adresse Wallet</p>
                                        <p className='title-ref'>Entreprise Donneur d’ordres</p>
                                        <p className='title-ref'>N° Appel d’offres</p>
                                        <p className='title-ref'>Nom de l’Appel d’Offres</p>
                                    </div>
                                    <div id="container-details-lot-top-left-top-rigth">
                                        <p className='title-ref-data'>{location.state.Ao.adressDDO}</p>
                                        <p className='title-ref-data'>{location.state.value.idAO+1}</p>
                                        <p className='title-ref-data'>{location.state.Ao.index+1}</p>
                                        <p className='title-ref-data'>{location.state.Ao.aoName}</p>

                                    </div>
                                </div>
                                <div id="container-details-lot-top-left-bottom">
                                    <div id="container-details-lot-top-left-bottom-left">
                                        <p className='title-ref'>N° du Lot</p>
                                        <p className='title-ref'>Désignation du Lot</p>
                                        <p className='title-ref'>Catégorie du Lot</p>
                                        <p className='title-ref'>Sous-catérogie du Lot</p>
                                        <p className='title-ref'>Valorisation du Lot</p>
                                        <p className='title-ref'>Date de clôture du Lot</p>
                                        <p className='title-ref'>Document DCE</p>
                                    </div>
                                    <div id="container-details-lot-top-left-bottom-rigth">
                                        <p className='title-ref-data'>{location.state.value.index+1}</p>
                                        <p className='title-ref-data'>{location.state.value.description}</p>
                                        <p className='title-ref-data'>{location.state.value.categorie}</p>
                                        <p className='title-ref-data'>{location.state.value.susCategorie}</p>
                                        <p className='title-ref-data'>{location.state.value.minprice}-{location.state.value.maxprice} €</p>
                                        <p className='title-ref-data'>{location.state.value.TsCloture}</p>
                                        <p className='title-ref-data'>
                                        <a href={`${location.state.value.uriPdf}`} target="_blank" rel="noreferrer">
                                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                                width="91.201px" height="91.201px" viewBox="0 0 91.201 91.201" >
                                                <path d="M45.182,37.845c-1.118,0-1.842,0.099-2.269,0.197v14.502c0.427,0.099,1.118,0.099,1.743,0.099
                                                    c4.538,0.032,7.497-2.467,7.497-7.76C52.186,40.279,49.488,37.845,45.182,37.845z"/>
                                                <path d="M25.817,37.78c-1.021,0-1.71,0.099-2.072,0.197v6.543c0.428,0.099,0.953,0.132,1.677,0.132
                                                    c2.664,0,4.308-1.348,4.308-3.617C29.73,38.996,28.317,37.78,25.817,37.78z"/>
                                                <path d="M58.984,0H12.336v91.201h66.529V27.05L55.23,10.73L58.984,0z M32.656,46.165c-1.71,1.61-4.241,2.335-7.2,2.335
                                                    c-0.659,0-1.25-0.033-1.711-0.1v7.924H18.78V34.459c1.545-0.264,3.715-0.461,6.773-0.461c3.091,0,5.294,0.592,6.775,1.776
                                                    c1.414,1.118,2.367,2.959,2.367,5.129C34.695,43.074,33.971,44.915,32.656,46.165z M60.764,34.163h13.549v4.11h-8.517v5.063h7.958
                                                    v4.076h-7.958v8.912h-5.032V34.163z M57.479,44.717c0,4.242-1.543,7.168-3.682,8.977c-2.335,1.94-5.887,2.862-10.226,2.862
                                                    c-2.598,0-4.44-0.166-5.689-0.329V34.459c1.842-0.296,4.242-0.461,6.775-0.461c4.208,0,6.938,0.756,9.076,2.369
                                                    C56.033,38.076,57.479,40.805,57.479,44.717z"/>
                                                <polygon points="63.652,0 60.613,8.694 78.865,21.297 		"/>
                                            </svg>
                                        </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div id="container-details-lot-top-rigth">

                            </div>
                        </div>
                        <div id="container-details-lot-bottom">
                            <div id="top-bottom-details">
                                <p>Soumissions en cours de ce Lot</p>
                            </div>
                            <div id="bottom-bottom-details">
                                <div id='td-array-my-ao-soum'>
                                    <div id='title-data-array-my-ao-soum'>
                                        <div className='column-my-ao'>Nom du soumissionaire</div>
                                        <div className='column-my-ao'>Horodatage Soumission</div>
                                        <div className='column-my-ao'>Montant de l’offre</div>
                                        <div className='column-my-ao'>Attribution</div>
                                        <div className='column-my-ao'>Réalisation</div>
                                        <div className='column-my-ao'> </div>
                                    </div>
                                    <div id='data-array-my-ao-soum'>
                                        {location.state.value.myArrayLot !== undefined ? (
                                            <>
                                                {location.state.value.myArrayLot.length > 0 ? (
                                                <>
                                                    {location.state.value.myArrayLot.map((value, key) => {
                                                        console.log(value)
                                                        if(location.state.value.index === value.index)
                                                        return(
                                                            <div key={`data-${key}-${value.index}`} className='data-myao-soum'>   
                                                                <div className="tr-data">{value.index + 1}</div>
                                                                <div className="tr-data">{value.description}</div>
                                                                <div className="tr-data">{value.categorie}</div>
                                                                <div className="tr-data">{value.susCategorie}</div>
                                                                <div className="tr-data">{value.minprice}-{value.maxprice} €</div>
                                                                <div className="tr-data">{value.TsCloture}</div>
                                                                <div className="tr-data">
                                                                    <a href={`${value.uriPdf}`} target="_blank" rel="noreferrer">
                                                                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                                                            width="91.201px" height="91.201px" viewBox="0 0 91.201 91.201" >
                                                                            <path d="M45.182,37.845c-1.118,0-1.842,0.099-2.269,0.197v14.502c0.427,0.099,1.118,0.099,1.743,0.099
                                                                                c4.538,0.032,7.497-2.467,7.497-7.76C52.186,40.279,49.488,37.845,45.182,37.845z"/>
                                                                            <path d="M25.817,37.78c-1.021,0-1.71,0.099-2.072,0.197v6.543c0.428,0.099,0.953,0.132,1.677,0.132
                                                                                c2.664,0,4.308-1.348,4.308-3.617C29.73,38.996,28.317,37.78,25.817,37.78z"/>
                                                                            <path d="M58.984,0H12.336v91.201h66.529V27.05L55.23,10.73L58.984,0z M32.656,46.165c-1.71,1.61-4.241,2.335-7.2,2.335
                                                                                c-0.659,0-1.25-0.033-1.711-0.1v7.924H18.78V34.459c1.545-0.264,3.715-0.461,6.773-0.461c3.091,0,5.294,0.592,6.775,1.776
                                                                                c1.414,1.118,2.367,2.959,2.367,5.129C34.695,43.074,33.971,44.915,32.656,46.165z M60.764,34.163h13.549v4.11h-8.517v5.063h7.958
                                                                                v4.076h-7.958v8.912h-5.032V34.163z M57.479,44.717c0,4.242-1.543,7.168-3.682,8.977c-2.335,1.94-5.887,2.862-10.226,2.862
                                                                                c-2.598,0-4.44-0.166-5.689-0.329V34.459c1.842-0.296,4.242-0.461,6.775-0.461c4.208,0,6.938,0.756,9.076,2.369
                                                                                C56.033,38.076,57.479,40.805,57.479,44.717z"/>
                                                                            <polygon points="63.652,0 60.613,8.694 78.865,21.297 		"/>
                                                                        </svg>
                                                                    </a>
                                                                </div>
                                                                <div className="tr-data"><Link to={`/Account/${userInfo.name}/${location.state.value.index}/DetailLot/DetailSoum`} state={{value:location.state.value,userInfo, Ao:location.state.Ao,SoumInfo:value}}><button className='small-button'>Voir</button></Link></div>
                                                            </div>
                                                        )
                                                        else
                                                        return(<></>)
                                                    })}
                                                </>
                                                ) : (
                                                    <p>Aucun soumissionnaire n'a répondu pour cette Appel d'offre.</p>
                                                )}
                                            </>
                                        ) : (
                                            <p>La date de cloture n'est pas terminé !</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Link to={`/Account/${userInfo.name}/${locationState.value.index}`} state={{value:locationState.value,userInfo:locationState.userInfo, Ao:locationState.value}}>
                                <button className="myButton">Voir lots de l'Appels d'offres</button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default DetailsMyLot;