import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Header from '../../Layout/Header/Header';
import Loader from '../../Layout/Loader/Loader';
import NavInfo from '../../Layout/NavInfo/NavInfo';
import { compareDate, convertDateToLocal, ConvertEpochToLocalDate } from '../../Utils/Utils';
import './detailsmylot.css'

const DetailsMyLot = () => {
    const { state: {artifact, owner, userInfo, contract, accounts },init } = useEth();
    const location = useLocation();
    const [locationState,] = useState(location.state);
    const [participant, setParticipant] = useState();
    const [participantSelected, setParticipantSelected] = useState();
    const [loading, setLoading] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [waiting, setWaiting] = useState(false);
    
    useEffect(() => {
        if (!compareDate(locationState.value.TsCloture)) {
            if (locationState.value.partLengt > 0) {
                const fetechdata = async () => {
                    setWaiting(true);
                    let arrayUser = [];
                    let oldEventsAccount = await contract.getPastEvents('userAdded', { fromBlock: 0, toBlock: 'latest' });
                    if (oldEventsAccount.length > 0) {
                        for (let i = 0; i < oldEventsAccount.length; i++) {
                          arrayUser.push(oldEventsAccount[i].returnValues.user);
                        };
                    };
                    let arrPart =[];
                    for (let i = 0; i < arrayUser.length; i++) {
                        try {
                            const respUser = await contract.methods.getAccount(arrayUser[i]).call({from: accounts })
                            for (let a = 0; a < respUser.countParticipation; a++) {
                                const respPart = await contract.methods.getParticipation(arrayUser[i],a, locationState.value.index).call({ from: accounts });
                                if (locationState.value.index === Number(respPart.idLot)) {
                                    if (respPart.isWinner === true) {
                                        setParticipantSelected({
                                            addr:arrayUser[i],
                                            name:respUser.name,
                                            indexPart:a,
                                            isApproval:respUser.isApproval,
                                            countNFTReal:Number(respUser.countNFTReal),
                                            countNFTWinner:Number(respUser.countNFTWinner),
                                            Tsprice1:ConvertEpochToLocalDate(respPart.Tsprice1),
                                            idLot:Number(respPart.idLot),
                                            isRealisation:respPart.isRealisation,
                                            isWinner:respPart.isWinner,
                                            price1:Number(respPart.price1)
                                        });
                                    } 
                                    arrPart.push({
                                        addr:arrayUser[i],
                                        name:respUser.name,
                                        indexPart:a,
                                        isApproval:respUser.isApproval,
                                        countNFTReal:Number(respUser.countNFTReal),
                                        countNFTWinner:Number(respUser.countNFTWinner),
                                        Tsprice1:ConvertEpochToLocalDate(respPart.Tsprice1),
                                        idLot:Number(respPart.idLot),
                                        isRealisation:respPart.isRealisation,
                                        isWinner:respPart.isWinner,
                                        price1:Number(respPart.price1)
                                    });
                                }
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    setParticipant(arrPart);
                    setWaiting(false);
                }
                fetechdata();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectWinner = async () => {
        setLoading(true);
        const data = JSON.stringify({
            "pinatLotptions": {
                "cidVersion": 1
            },
            "pinataMetadata": {
                "name": `TENDERONCHAIN-Attribution-Ao-${locationState.value.idAO+1}-Lot-${locationState.value.index+1}-JSON`,
                "keyvalues":{}
            },
            "pinataContent": {
                "name": `TENDERONCHAIN-Attribution-Ao-${locationState.value.idAO+1}-Lot-${locationState.value.index+1}-JSON`,
                "attributes": [
                    {
                    "trait_type": "AO",
                    "value": `${locationState.value.idAO+1}`
                    },
                    {
                    "trait_type": "LOT",
                    "value": `${locationState.value.index+1}`
                    },
                    {
                    "trait_type": "OWNER",
                    "value": `${owner}`
                    },
                    {
                    "trait_type": "PARTICIPATION",
                    "value": `${participantSelected.addr}`
                    },
                    {
                    "trait_type": "ALLOCATION",
                    "value": `${participantSelected.addr}`
                    },
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
            console.log(err);
        }).then(async res => {
            const cidJson = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
            await contract.methods.attribution(
                1, 
                location.state.value.idAO, 
                participantSelected.idLot, 
                participantSelected.indexPart, 
                participantSelected.addr, 
                cidJson
                ).send({ from: accounts }).then( async res => {
                toast(`L'entreprise ${participantSelected.name} à été selectionné pour le lot ${location.state.value.index+1} !`,
                {style: { height:'50px', background:'#1dc200',color:'white', fontSize:"15px", padding:'0px 15px'}});
                setParticipantSelected(prevArray => [...prevArray, {isApproval:true}]);
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
                    toast(errorObject.value.data.message.replace("VM Exception while processing transaction:",""),
                    {style: { height:'50px', background:'#ff2626',color:'white', fontSize:"15px", padding:'0px 15px'}});
                    
                }
                setLoading(false);
            });
        });
        setLoading(false);
    }

    const handleSelectRealisation = async () => {
        setLoading(true);
        const data = JSON.stringify({
            "pinatLotptions": {
                "cidVersion": 1
            },
            "pinataMetadata": {
                "name": `TENDERONCHAIN-Realisation-Ao-${locationState.value.idAO+1}-Lot-${locationState.value.index+1}-JSON`,
                "keyvalues":{}
            },
            "pinataContent": {
                "name": `TENDERONCHAIN-Realisation-Ao-${locationState.value.idAO+1}-Lot-${locationState.value.index+1}-JSON`,
                "attributes": [
                    {
                    "trait_type": "AO",
                    "value": `${locationState.value.idAO+1}`
                    },
                    {
                    "trait_type": "LOT",
                    "value": `${locationState.value.index+1}`
                    },
                    {
                    "trait_type": "OWNER",
                    "value": `${owner}`
                    },
                    {
                    "trait_type": "PARTICIPATION",
                    "value": `${participantSelected.addr}`
                    },
                    {
                    "trait_type": "ALLOCATION",
                    "value": `${participantSelected.addr}`
                    },
                    {
                    "trait_type": "REALIZATION",
                    "value": `${participantSelected.addr}`
                    },
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
            console.log(err);
        }).then(async res => {
            const cidJson = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
            await contract.methods.attribution(2, location.state.value.idAO, participantSelected.idLot, participantSelected.indexPart, participantSelected.addr, cidJson).send({ from: accounts }).then( async res => {
                toast(`L'entreprise ${participantSelected.name} à été selectionné pour le lot ${location.state.value.index+1} !`,
                {style: { height:'50px', background:'#1dc200',color:'white', fontSize:"15px", padding:'0px 15px'}});
                setParticipantSelected(prevArray => [...prevArray, {isRealisation:true}]);
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
                    toast(errorObject.value.data.message.replace("VM Exception while processing transaction:",""),
                    {style: { height:'50px', background:'#ff2626',color:'white', fontSize:"15px", padding:'0px 15px'}});
                    
                }
                setLoading(false);
            });
        });
        setLoading(false);
    }
    
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
                                        <p className='title-ref'></p>
                                        <p className='title-ref'>Mon adresse Wallet</p>
                                        <p className='title-ref'>Entreprise Donneur d’ordres</p>
                                        <p className='title-ref'>N° Appel d’offres</p>
                                        <p className='title-ref'>Nom de l’Appel d’Offres</p>
                                    </div>
                                    <div id="container-details-lot-top-left-top-rigth">
                                        <p className='title-ref-data'></p>
                                        <p className='title-ref-data'>{location.state.Ao.adressDDO}</p>
                                        <p className='title-ref-data'>{location.state.value.idAO+1}</p>
                                        <p className='title-ref-data'>{location.state.Ao.index+1}</p>
                                        <p className='title-ref-data'>{location.state.Ao.aoName}</p>

                                    </div>
                                </div>
                                <div id="container-details-lot-top-left-bottom">
                                    <div id="container-details-lot-top-left-bottom-left">
                                        <p className='title-ref'></p>
                                        <p className='title-ref'>N° du Lot</p>
                                        <p className='title-ref'>Désignation du Lot</p>
                                        <p className='title-ref'>Catégorie du Lot</p>
                                        <p className='title-ref'>Sous-catérogie du Lot</p>
                                        <p className='title-ref'>Valorisation du Lot</p>
                                        <p className='title-ref'>Date de clôture du Lot</p>
                                        <p className='title-ref'>Document DCE</p>
                                        <p className='title-ref'></p>
                                    </div>
                                    <div id="container-details-lot-top-left-bottom-rigth">
                                        <p className='title-ref-data'></p>
                                        <p className='title-ref-data'>{location.state.value.index+1}</p>
                                        <p className='title-ref-data'>{location.state.value.description}</p>
                                        <p className='title-ref-data'>{location.state.value.categorie}</p>
                                        <p className='title-ref-data'>{location.state.value.susCategorie}</p>
                                        <p className='title-ref-data'>{location.state.value.minprice}-{location.state.value.maxprice} €</p>
                                        <p className='title-ref-data'>{convertDateToLocal(location.state.value.TsCloture)}</p>
                                        <p className='title-ref-data'>
                                        <a href={`${location.state.value.uriPdf}`} target="_blank" rel="noreferrer">
                                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
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
                            </div>
                            <div id="container-details-lot-top-rigth">
                                <div></div>
                                {!waiting ? (
                                    <Link 
                                        to={`/Account/${userInfo.name}/${locationState.value.idAO}`} 
                                        state={{value:locationState.oldState.value,userInfo:locationState.oldState.userInfo, Ao:locationState.oldState.value}}
                                    >
                                        <button className="myButton-return">Retour au lots de l'Appels d'offres ⮐</button>
                                    </Link>
                                ) : (
                                    <button className="myButton-return" ><Loader size={"small"}/></button>
                                )}
                                <div></div>
                                <div id="container-details-lot-top-rigth-attribution-container">
                                    {participantSelected !== undefined && (
                                        <>
                                            {submit || participantSelected.isWinner ? (
                                                <div id="container-details-lot-top-rigth-attribution-container-selected">
                                                    <p id="title-corp">Valider la réalistaion :</p>
                                                    <p id="corp">{participantSelected.name}</p>
                                                    <div id="container-details-lot-top-rigth-attribution-container-selected-action">
                                                        {loading ? (
                                                            <button className="myButton" ><Loader size={"small"}/></button>
                                                        ) : (
                                                            <>
                                                                {!participantSelected.isRealisation && (
                                                                    <button className="myButton" onClick={handleSelectRealisation}>Valider la réalistaion</button>
                                                                )}
                                                            </>
                                                        )}
                                                        <span></span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div id="container-details-lot-top-rigth-attribution-container-selected">
                                                    <p id="title-corp">Valider l'attribution :</p>
                                                    <p id="corp">{participantSelected.name}</p>
                                                    <div id="container-details-lot-top-rigth-attribution-container-selected-action">
                                                        {loading ? (
                                                            <button className="myButton" ><Loader size={"small"}/></button>
                                                        ) : (
                                                            <button className="myButton" onClick={handleSelectWinner}>Attribuer ce Lot</button>
                                                        )}
                                                        <span></span>
                                                        <button className="myButton-return" onClick={()=>{setParticipantSelected()}}>Annuler</button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div id="container-details-lot-bottom">
                            <div id="top-bottom-details-details-lot">
                                {compareDate(locationState.value.TsCloture) ?(
                                    <p>Soumissions en cours ...</p>
                                ) : (
                                    <p>Liste des Soumissionaire pour ce lot</p>
                                )}
                            </div>
                            <div id="bottom-bottom-details-lot">
                                <div id='td-array-my-ao-soum-details-lot'>
                                    <div id='title-data-array-my-ao-soum-details-lot'>
                                        <p className='column-my-ao'>Nom du soumissionaire</p>
                                        <p className='column-my-ao'>Horodatage Soumission</p>
                                        <p className='column-my-ao'>Montant de l’offre</p>
                                        <p className='column-my-ao'>Attribution</p>
                                        <p className='column-my-ao'>Réalisation</p>
                                        <p className='column-my-ao'> </p>
                                    </div>
                                    <div id='data-array-my-ao-soum-details-lot'>
                                        {!compareDate(locationState.value.TsCloture) ? (
                                            <>
                                                {locationState.value.partLengt > 0 ? (
                                                    <>
                                                        {participant !== undefined && (
                                                            <>  
                                                                 {participant.length > 0 && (
                                                                    <>
                                                                        {participant.map((value, key) => {
                                                                            return(
                                                                                <div key={key} className='data-myao-soum'>   
                                                                                    <div className="tr-data">{value.name}</div>
                                                                                    <div className="tr-data">{convertDateToLocal(value.Tsprice1)}</div>
                                                                                    <div className="tr-data">{value.price1}</div>
                                                                                    <div className="tr-data">{value.isWinner ? "✅" : ""}</div>
                                                                                    <div className="tr-data">{value.isRealisation ? "✅" : ""}</div>
                                                                                    {!value.isWinner ? (
                                                                                        <>
                                                                                            {participantSelected === undefined && (
                                                                                                <div className="tr-data">
                                                                                                    <button className='small-button' onClick={()=>{setParticipantSelected(value)}}>Attribuer ce lot</button>
                                                                                                </div>
                                                                                            )}
                                                                                        </>
                                                                                    ) : (<></>)}
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
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
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default DetailsMyLot;