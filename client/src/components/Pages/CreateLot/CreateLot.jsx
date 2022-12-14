import { useState } from 'react';
import axios from "axios";
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { options, getCurrentTimestamp, getDateInISOFormat } from '../../Utils/Utils'
import { useEth } from '../../../contexts/EthContext';
import Header from '../../Layout/Header/Header';
import NavInfo from '../../Layout/NavInfo/NavInfo';
import './createlot.css';
import Loader from '../../Layout/Loader/Loader';
import { Link } from 'react-router-dom';

const CreateLot = () => {
    const { state: { owner, artifact, contract, accounts , userInfo }, init } = useEth();
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [descriptionFormLot, setDescriptionFormLot] = useState("");
    const [dateFormLot, setDateFormLot] = useState("");
    const [timeFormLot, setTimeFormLot] = useState("");
    const [caterogireFormLot, setCaterogireFormLot] = useState("");
    const [susCategoryFormLot, setSelectedSusCategoryFormLot] = useState("");
    const [priceMinFormLot, setPriceMinFormLot] = useState(0);
    const [priceMaxFormLot, setPriceMaxFormLot] = useState(0);
    const [tx, setTX] = useState("");
    const [loading, setLoading] = useState(false);
    const [recorded, setRecorded] = useState(false);
    const [locationState,] = useState(location.state);

    const filterOptions = (category) => {
        return options.find(opt => opt.category === category).items;
    };

    const handleDescription = e => {
        setDescriptionFormLot(e.target.value);
    };

    const handleDate = e => {
        setDateFormLot(e.target.value);
    };

    const handleTime = e => {
        setTimeFormLot(e.target.value);
    };
    
    const handleCategorie = e => {
        setCaterogireFormLot(e.target.value);
        setSelectedCategory(e.target.value);
    };

    const handleSusCategorie = e => {
        setSelectedSusCategoryFormLot(e.target.value);
    };

    const handlePriceMin = e => {
        setPriceMinFormLot(e.target.value);
    };
    
    const handlePriceMax = e => {
        setPriceMaxFormLot(e.target.value);
    };

    const changeHandler = (event) => {
        const files = event.target.files;
        if (files.length !== 1) {
          console.error("Vous devez s??lectionner un seul fichier ");
          return;
        }
        const file = files[0];
        if (file.type !== "application/pdf") {
          console.error("Vous devez s??lectionner un fichier PDF ");
          return;
        }
        setSelectedFile(file);
    };

    const handleCreateLot = async e => {
        e.preventDefault();
        setLoading(true);
        const dateTimeString = `${dateFormLot}T${timeFormLot}`;
        const dateObjectb = new Date(dateTimeString);
        let ts = dateObjectb.getTime();
        ts /= 1000;
        // <========== look for testnet ==================
        // ts += 3600;
        // ts -= 3600;
        var tsRounded = Math.round(ts);
        if (selectedFile.type !== "application/pdf" || descriptionFormLot === "" || tsRounded <=  getCurrentTimestamp() || caterogireFormLot === "" ||
        susCategoryFormLot === "" || priceMinFormLot === 0 || priceMaxFormLot === 0 || priceMinFormLot > priceMaxFormLot) {
            toast(`Les champs du formulaire ne sont pas correct !`,
            {style: { height:'50px', minWidth:'500px', background:'#ff2626',color:'white', fontSize:"15px", padding:'0px 15px'}});
            setLoading(false);
            return;
        }
        let cidfile = null, cidJson = null, cidFileForBc = null;
        const formData = new FormData();
        formData.append('file', selectedFile);
        const metadata = JSON.stringify({name: `TENDERONCHAIN-Lot-${locationState.value.index+1}-Lot-${locationState.value.lastLotId+1}`});
        formData.append('pinataMetadata', metadata);
        const options = JSON.stringify({cidVersion: 0});
        formData.append('pinatLotptions', options);
        await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: `${process.env.REACT_APP_PINATA_JWT}`
            }
        }).catch( err => {
            console.log(err);
        }).then(async res => {
            cidfile = res.data.IpfsHash;
            cidFileForBc = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
            const data = JSON.stringify({
                "pinatLotptions": {
                    "cidVersion": 1
                },
                "pinataMetadata": {
                    "name": `TENDERONCHAIN-Ao-${locationState.value.index+1}-Lot-${locationState.value.lastLotId+1}-JSON`,
                    "keyvalues":{}
                },
                "pinataContent": {
                    "name": `TENDERONCHAIN-Ao-${locationState.value.index+1}-Lot-${locationState.value.lastLotId+1}-JSON`,
                    "external_url": `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`,
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
                        "trait_type": "CREATE_LOT",
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
                console.log(err);
                const config = {
                    method: 'delete',
                    url: `https://api.pinata.cloud/pinning/unpin/${cidfile}`,
                    headers: { 
                      'Authorization': `${process.env.REACT_APP_PINATA_JWT}`
                    }
                };
                await axios(config);
            }).then(async res => {
                cidJson = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
                await contract.methods.createLot(
                    locationState.value.index.toString(),
                    descriptionFormLot,
                    tsRounded,
                    caterogireFormLot,
                    susCategoryFormLot,
                    priceMinFormLot,
                    priceMaxFormLot,
                    cidJson,
                    cidFileForBc,
                ).send({ from: accounts }).then( async res => {
                    setTX(res.events.LotCreated.transactionHash);
                    setRecorded(true);
                    toast(`Lot : ${res.events.LotCreated.returnValues.name} enregist?? !`,
                    {style: { height:'50px', background:'#1dc200',color:'white', fontSize:"15px", padding:'0px 15px'}});
                    setSelectedFile(null);
                    setDescriptionFormLot("");
                    setDateFormLot("");
                    setTimeFormLot("");
                    setCaterogireFormLot("");
                    setSelectedSusCategoryFormLot("");
                    setPriceMinFormLot(0);
                    setPriceMaxFormLot(0);
                    init(artifact);
                    setLoading(false);
                }).catch(async error => {
                    const config = {
                        method: 'delete',
                        url: `https://api.pinata.cloud/pinning/unpin/${cidfile}`,
                        headers: { 
                          'Authorization': `${process.env.REACT_APP_PINATA_JWT}`
                        }
                    };
                    await axios(config);
                    const config2 = {
                        method: 'delete',
                        url: `https://api.pinata.cloud/pinning/unpin/${cidJson}`,
                        headers: { 
                          'Authorization': `${process.env.REACT_APP_PINATA_JWT}`
                        }
                    };
                    await axios(config2);
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
        });
        setLoading(false);
    };

    return (
        <>
            <Header/>
            <main>
                <section className="section-nav">
                    <NavInfo context={locationState}/>
                </section>
                <section>
                    <div id="main-container-Lot">
                        <div id="top-fom-Lot">
                            <div id="ref-lot-title">
                                <p className='title-ref'>Mon adresse Wallet</p>
                                <p className='title-ref'>Entreprise Donneur d???ordres</p>
                                <p className='title-ref'>Nom de l???Appel d???Offres</p>
                            </div>
                            <div id="data-lot-title">
                                <p className='title-ref-data'>{locationState.value.adressDDO}</p>
                                <p className='title-ref-data'>{userInfo.name}</p>
                                <p className='title-ref-data'>{locationState.value.aoName}</p>
                            </div>
                        </div>
                        <div id="bottom-fom-Lot">
                            <form onSubmit={handleCreateLot} id='form-create-lot'>
                                <div id="top-title-container-form">
                                    <div id="form-title-container">
                                        <p className='title-ref-form'>D??signation du Lot:</p>
                                        <p className='title-ref-form'>Cat??gorie du Lot</p>
                                        <p className='title-ref-form'>Sous-cat??rogie du Lot</p>
                                        <p className='title-ref-form'>Valorisation du Lot</p>
                                        <p className='title-ref-form'>Date de cl??ture du Lot</p>
                                        <p className='title-ref-form'>T??l??chargement DCE-Lot</p>
                                    </div>
                                    <div id="form-title-container-input">
                                        <input type="text" id="designation" name="designation"required onChange={handleDescription}/>
                                        <select value={selectedCategory} required onChange={handleCategorie}>
                                            <option value={""}>---</option>
                                            {options.map(opt => <option key={opt.category} value={opt.category}>{opt.category}</option>)}
                                        </select>
                                        <select value={susCategoryFormLot} required onChange={handleSusCategorie}>
                                            <option value={""}>---</option>
                                            {selectedCategory && filterOptions(selectedCategory).map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                        <div id="pricelot">
                                            <div id="min-value">
                                                <p>Min.</p>
                                                <input type="number" id="min" name="min" required onChange={handlePriceMin}/>
                                                <p>???</p>
                                            </div>
                                            <div id="max-value">
                                                <p>Max.</p>
                                                <input type="number" id="max" name="max" required onChange={handlePriceMax}/>
                                                <p>???</p>
                                            </div>
                                        </div>
                                        <input type="date" id="date-cloture" name="date-cloture" required min={getDateInISOFormat()} onChange={handleDate}/>
                                        <input type="time" id="date-cloture-time" name="date-cloture" required  onChange={handleTime}/>
                                        <input type="file" id="dce-lot" name="dce-lot"required onChange={changeHandler}/>
                                    </div>
                                </div>
                                <div id="bottom-form-Lot-submit">
                                    {!recorded ? (
                                        <>
                                            {loading ? (
                                                <button className="myButton" ><Loader size={"small"}/></button>
                                            ) : (
                                                <button className="myButton" type="submit">Publier ce Lot</button>
                                            )}
                                        </>
                                    ) : (
                                        <> 
                                            <Link 
                                                to={`/Account/${userInfo.name}/${locationState.value.index}`} 
                                                state={{value:locationState.value,userInfo:locationState.userInfo, Ao:locationState.value}}
                                            >
                                                <button className="myButton" >Voir lots de l'Appels d'offres</button>
                                            </Link>
                                            <p>{tx}</p>
                                        </>
                                    )}
                                    <Link 
                                        to={`/Account/${userInfo.name}/${locationState.value.index}`} 
                                        state={{value:locationState.value,userInfo:locationState.userInfo, Ao:locationState.value}}
                                    >
                                        <button className="myButton-return" >Voir lots de l'Appels d'offres</button>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default CreateLot;