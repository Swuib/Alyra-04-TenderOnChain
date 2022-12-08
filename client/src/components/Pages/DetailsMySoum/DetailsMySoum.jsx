import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Header from '../../Layout/Header/Header';
import NavInfo from '../../Layout/NavInfo/NavInfo';
import toast from 'react-hot-toast';
import './detailsmysoum.css';
import axios from 'axios';
import Loader from '../../Layout/Loader/Loader';
import { convertDateToLocal } from '../../Utils/Utils';

const DetailsMySoum = () => {
    const { state: {artifact,owner, contract, accounts, myParticipation,priceLot },init } = useEth();
    const location = useLocation();
    const [locationState,] = useState(location.state);
    const [loading, setLoading] = useState(false);
    const [loadingLoop, setLoadingLoop] = useState(true);
    const [participed, setParticiped] = useState(true);
    const [submit, setSubmit] = useState(true);
    const [participedData, setParticipedData] = useState({});
    const [value, setVavlue] = useState(0);
    console.log(locationState);
    console.log(myParticipation[0]);


    useEffect(() => {
        if (myParticipation.length > 0) {
            for (let i = 0; i < myParticipation.length; i++) {
                if (myParticipation[i].idLot === locationState.value.index) {
                    setParticiped(false);
                    setParticipedData({
                        Tsprice1 : convertDateToLocal(myParticipation[i].Tsprice1),
                        idLot: myParticipation[i].idLot,
                        isRealisation: myParticipation[i].isRealisation,
                        isWinner: myParticipation[i].isWinner,
                        price1: myParticipation[i].price1
                    });
                }
            }
        }
        setLoadingLoop(false);
    }, [locationState.value.index, myParticipation])
    


    // createParticipation
    const handleChange = e => {
        setVavlue(e.target.value);
    };

    const handleParticipate = async e => {
        e.preventDefault();
        setLoading(true);
        if (value < locationState.value.minprice || value > locationState.value.maxprice) {
            toast(`Votre proposition dois etre dans la fourchete de Prix !`,
            {style: { height:'50px', background:'#ff2626',color:'white', fontSize:"15px", padding:'0px 15px'}});
            return;
        };

        const data = JSON.stringify({
            "pinatLotptions": {
                "cidVersion": 1
            },
            "pinataMetadata": {
                "name": `TENDERONCHAIN-Participation-Ao-${locationState.value.index+1}-Lot-${locationState.value.lastLotId+1}-JSON`,
                "keyvalues":{}
            },
            "pinataContent": {
                "name": `TENDERONCHAIN-Participation-Ao-${locationState.value.index+1}-Lot-${locationState.value.lastLotId+1}-JSON`,
                "attributes": [
                    {
                    "trait_type": "AO",
                    "value": `${locationState.value.index+1}`
                    },
                    {
                    "trait_type": "LOT",
                    "value": `${locationState.value.lastLotId+1}`
                    },
                    {
                    "trait_type": "OWNER",
                    "value": `${owner}`
                    },
                    {
                    "trait_type": "PARTICIPATION",
                    "value": `${accounts}`
                    }
                ]
            }
        });
        const config = {
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            headers: { 
              'Authorization': `${process.env.REACT_APP_PINATA_JWT}`, 
              'Content-Type': 'application/json',
            },
            data: data
        };
        await axios(config).catch(async err => {
            console.log('error upload json');
            console.log(err);
        }).then(async res => {
            const cidJson = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
            await contract.methods.createParticipation(locationState.value.index, value, cidJson).send({ from: accounts,value:priceLot }).then( async res => {
                console.log(res);
    
                // toast(`Participation ${res.events.LotCreated.returnValues.name} enregisté !`,
                // {style: { height:'50px', background:'#1dc200',color:'white', fontSize:"15px", padding:'0px 15px'}});
                setVavlue(0);
                init(artifact);
                setLoading(false);
                setSubmit(true);
            }).catch(async error => {
                const config = {
                    method: 'delete',
                    url: `https://api.pinata.cloud/pinning/unpin/${cidJson}`,
                    headers: { 
                        'Authorization': `${process.env.REACT_APP_PINATA_JWT}`
                    }
                };
                await axios(config);
                if(error.code === 4001)
                    toast(`${error.message}`,
                    {style: { height:'50px', minWidth:'500px', background:'#ff2626',color:'white', fontSize:"15px", padding:'0px 15px'}});
                else {
                    const errorObject = JSON.parse(error.message.replace("[ethjs-query] while formatting outputs from RPC '", "").slice(0, -1));
                    console.log(errorObject);
                    toast(errorObject.value.data.message.replace("VM Exception while processing transaction:",""),
                    {style: { height:'50px', background:'#ff2626',color:'white', fontSize:"15px", padding:'0px 15px'}});
                    
                }
                setLoading(false);
            });
        });
        setLoading(false);
    };
    return (
        <>
            <Header/>
            <main>
                <section className="section-nav">
                    <NavInfo />
                </section>
                <section>
                    <div id="main-container-details-mysoum">
                        <div id="top-left-details-mysoum-container">
                            <div id="title-top-container-left">
                                <p className='title-ref'></p>
                                <p className='title-ref'>Mon adresse Wallet</p>
                                <p className='title-ref'>Entreprise Donneur d’ordres</p>
                                <p className='title-ref'>N° Appel d’offres</p>
                                <p className='title-ref'>N° du Lot</p>
                                <p className='title-ref'>Nom de l’Appel d’Offres</p>
                                <p className='title-ref'>Catégorie du Lot</p>
                                <p className='title-ref'>Sous-catérogie du Lot</p>
                                <p className='title-ref'>Fourchette de Prix</p>
                                <p className='title-ref'>Date de clôture</p>
                                <p className='title-ref'>Document DCE</p>
                                <p className='title-ref'></p>
                            </div>
                            <div id="title-top-container-rigth">
                                <p className='title-ref-data'></p>
                                <p className='title-ref-data'>{accounts}</p>
                                <p className='title-ref-data'>{locationState.value.aoName}</p>
                                <p className='title-ref-data'>{locationState.value.index}</p>
                                <p className='title-ref-data'>{locationState.value.idAO}</p>
                                <p className='title-ref-data'>{locationState.value.description}</p>
                                <p className='title-ref-data'>{locationState.value.categorie}</p>
                                <p className='title-ref-data'>{locationState.value.susCategorie}</p>
                                <p className='title-ref-data'>{locationState.value.minprice}-{locationState.value.maxprice} €</p>
                                <p className='title-ref-data'>{locationState.value.TsCloture}</p>
                                <p className='title-ref-data'>
                                    <a href={`${locationState.value.uriPdf}`} target="_blank" rel="noreferrer">
                                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                            width="22px" height="22px" 
                                            viewBox="0 0 91.201 91.201" >
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
                                <p className='title-ref-data'></p>
                            </div>
                        </div>
                        <div id="top-rigth-details-mysoum-container">
                            affichage NFT Attribution
                        </div>
                        <div id="bottom-left-details-mysoum-container">
                            <div id="title-bottom-container-left">
                                <p className='title-ref'>Mon Entreprise</p>
                                <p className='title-ref'>Ma proposition</p>
                                {/* {compareDate(locationState.value.TsCloture) && (
                                    <>
                                        date futur
                                    </>
                                )} */}
                                <p className='title-ref'>Date soumission</p>
                                {locationState.value.isNftAttributionEmit ? (
                                    <p className='title-ref'>Date attribution</p>
                                ) : (
                                    <p className='title-ref'></p>
                                )}
                            </div>
                            <div id="title-bottom-container-rigth">
                                <p className='title-ref-data'>{locationState.userInfo.name}</p>
                                {/* {compareDate(locationState.value.TsCloture) ? (
                                    <>
                                        date futur
                                    </>
                                ) : (
                                    <>
                                        date passé
                                    </>
                                )} */}
                                {loadingLoop ? (
                                    <Loader />
                                ) : (
                                    <>
                                        {participed ? (
                                            <form onSubmit={handleParticipate}>
                                                <div>
                                                    <input type="number" required onChange={handleChange}/>
                                                    <p>€</p>
                                                </div>
                                                {submit ? (
                                                    <p>Enregistré !</p>
                                                ) : (
                                                    <>
                                                        {loading ? (
                                                            <button className="myButton" ><Loader size={"small"}/></button>
                                                        ) : (
                                                            <button className="myButton" type="submit">Envoyer mon offre</button>
                                                        )}
                                                    </>
                                                )}
                                            </form>
                                        ) : (
                                            <>
                                                <p className='title-ref-data'>{participedData.price1}</p>
                                                <p className='title-ref-data'>{participedData.Tsprice1}</p>
                                                {locationState.value.isNftAttributionEmit ? (
                                                    <p className='title-ref-data'>{locationState.value.TsAtt}</p>
                                                ) : (
                                                    <p className='title-ref'></p>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div id="bottom-rigth-details-mysoum-container">
                            Ce lot vous a été attribué ! Positionnement Prix : 2ème sur 3 participants
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default DetailsMySoum;