import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEth } from '../../../contexts/EthContext';
import Header from '../../Layout/Header/Header';
import Loader from '../../Layout/Loader/Loader';
import NavInfo from '../../Layout/NavInfo/NavInfo';
import './detailsmyao.css';
import { convertDateToLocal } from '../../Utils/Utils';

const DetailsMyAo = () => {
    const { state: {artifact,contract,accounts, userInfo, myArrayLot },init,waiting } = useEth();
    const location = useLocation();
    const [edit, setedit] = useState(false);
    const [loadingMyAo, setLoadingMyAo] = useState(false);
    const [editName, seteditName] = useState(location.state.value.aoName);
    const [locationState,] = useState(location.state);
    const [myArrayLotFilted, seteMyArrayLotFiltred] = useState([]);
    
    useEffect(() => {
        let arr=[];
        if (myArrayLot.length > 0) {
            setLoadingMyAo(true);
            for (let i = 0; i < myArrayLot.length; i++) {
                if(locationState.value.index === myArrayLot[i].idAO) {
                    arr.push(myArrayLot[i]);
                };
            };
            seteMyArrayLotFiltred(arr);
            setLoadingMyAo(false);
        }
    }, [locationState.value.index, myArrayLot]);

    const handleEdit = () => {
        setedit(!edit);
    };

    const handleChangeName = e => {
        seteditName(e.target.value);
    };

    const handleSubmit = async () => {
        setLoadingMyAo(true);
        await contract.methods.editAO(locationState.value.index, editName).send({ from: accounts }).then( async res => {
            toast(`Modification du nom enregisté !`,
            {style: { height:'50px', background:'#1dc200',color:'white', fontSize:"15px", padding:'0px 15px'}});
            init(artifact);
            setLoadingMyAo(false);
        }).catch(error => {
            if(error.code === 4001)
                toast(`${error.message}`,
                {style: { height:'50px', minWidth:'500px', background:'#ff2626',color:'white', fontSize:"15px", padding:'0px 15px'}});
            else {
                const errorObject = JSON.parse(error.message.replace("[ethjs-query] while formatting outputs from RPC '", "").slice(0, -1));
                toast(errorObject.value.data.message.replace("VM Exception while processing transaction:",""),
                {style: { height:'50px', background:'#ff2626',color:'white', fontSize:"15px", padding:'0px 15px'}});
            }
            setLoadingMyAo(false);
        });
    };

    return (
        <>
            <Header/>
            <main>
                <section className="section-nav">
                    <NavInfo context={locationState}/>
                </section>
                <section>
                    {!loadingMyAo ? (
                        <div className="main-container-details">
                            {locationState !== null && (
                                <div id='details-my-ao-container'>
                                    <div id='top-details-my-ao-container'>
                                        <div id="left-top-details">
                                            <p></p>
                                            <p>Mon adresse Wallet</p>
                                            <p>Entreprise Donneur d’ordres</p>
                                            <p>N° Appel d’offres</p>
                                            <p>Nom de l’Appel d’Offres</p>
                                            <p></p>
                                        </div>
                                        <div id="rigth-top-details">
                                            <p></p>
                                            <p>{locationState.value.adressDDO}</p>
                                            <p>{locationState.userInfo.name}</p>
                                            <p>{locationState.value.index+1}</p>
                                            <div id='last-button'>
                                                {edit ? (
                                                    <>
                                                        <input type="text" onChange={handleChangeName} value={editName}/>
                                                        <div className="button-edit-container">
                                                            <span></span>
                                                            <button onClick={handleEdit} className="buttonEdit">Annuler</button>
                                                            <span></span>
                                                            <button onClick={handleSubmit} className="buttonEdit">Valider</button>
                                                            <span></span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p>{editName}</p>
                                                        <div className="button-edit-container">
                                                        <span></span>
                                                            <button className="buttonEdit" onClick={handleEdit} style={{margin:"0 36px"}} >
                                                                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                                    viewBox="0 0 31.982 31.982">
                                                                    <path d="M3.952,23.15L0,31.955l8.767-3.992l0.018,0.019L3.938,23.13L3.952,23.15z M4.602,22.463L24.634,2.432l4.849,4.848
                                                                        L9.45,27.312L4.602,22.463z M30.883,0.941c-2.104-1.963-4.488-0.156-4.488-0.156l4.851,4.843
                                                                        C31.244,5.627,33.124,3.375,30.883,0.941z"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <p></p>
                                        </div>
                                    </div>
                                    <div id='bottom-details-my-ao-container'>
                                        <div id="top-bottom-details">
                                            <div id="left-top-bottom-details">
                                                <p>Liste des Lots</p>
                                            </div>
                                            <div id="rigth-top-bottom-details">
                                                <Link to={`${window.location.pathname}/CreateLot`} state={{value:locationState.value,userInfo, Ao:locationState.value}}>
                                                    <button className="myButton">Ajouter un Lot</button>
                                                </Link>
                                                <span></span>
                                                <Link to={`/Account/${locationState.userInfo.name}/MyAO`}>
                                                    <button className="myButton-return">Retour aux appel d'offres ⮐</button>
                                                </Link>
                                            </div>
                                        </div>
                                        <div id="bottom-bottom-details">
                                            <div id='td-array-my-ao'>
                                                <div id='title-data-array-my-ao'>
                                                    <div className='column-my-ao'>N° du Lot</div>
                                                    <div className='column-my-ao'>Désignation du Lot</div>
                                                    <div className='column-my-ao'>Catégorie du Lot</div>
                                                    <div className='column-my-ao'>Sous-catérgorie du Lot</div>
                                                    <div className='column-my-ao'>Valorisation du Lot</div>
                                                    <div className='column-my-ao'>Date de clôture du Lot</div>
                                                    <div className='column-my-ao'>Document DCE</div>
                                                    <div className='column-my-ao'> </div>
                                                </div>
                                                <div id='data-array-my-ao'>
                                                {waiting === true ? (
                                                    <div className='waiting'>
                                                        <Loader size={"large"}/>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {myArrayLotFilted.length > 0 ? (
                                                            <>
                                                                {myArrayLotFilted.map((value, key) => {
                                                                    return(
                                                                        <div key={`data-${key}-${value.index}`} className='data-myao'>   
                                                                            <div className="tr-data">{value.index + 1}</div>
                                                                            <div className="tr-data">{value.description}</div>
                                                                            <div className="tr-data">{value.categorie}</div>
                                                                            <div className="tr-data">{value.susCategorie}</div>
                                                                            <div className="tr-data">{value.minprice}-{value.maxprice} €</div>
                                                                            <div className="tr-data">{convertDateToLocal(value.TsCloture)}</div>
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
                                                                            <div className="tr-data">
                                                                                <Link 
                                                                                    to={`/Account/${userInfo.name}/${value.idAO}/DetailLot`} 
                                                                                    state={{value, oldState:locationState, userInfo, Ao:locationState.value}}
                                                                                >
                                                                                    <button className='small-button'>Voir</button>
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </>
                                                        ) : (
                                                            <p>Aucun lot enregistré</p>
                                                        )}
                                                    </>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Loader />
                    )}
                </section>
            </main>
        </>
    );
};

export default DetailsMyAo;