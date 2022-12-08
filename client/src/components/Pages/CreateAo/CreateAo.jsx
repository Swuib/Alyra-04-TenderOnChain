import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Header from '../../Layout/Header/Header';
import Loader from '../../Layout/Loader/Loader';
import NavInfo from '../../Layout/NavInfo/NavInfo';
import './createao.css';

const CreateAo = () => {
    const { state: { artifact,contract, accounts , userInfo, priceAO }, init } = useEth();
    const [nameFormAo, setNameFormAo] = useState("");
    const [tx, setTX] = useState("");
    const [loading, setLoading] = useState(false);
    const [recorded, setRecorded] = useState(false);
    const navigate = useNavigate();
    

    const handleCreateAo = async e => {
        setLoading(true);
        e.preventDefault();
        await contract.methods.createAO(nameFormAo).send({ from: accounts, value:priceAO }).then( async res => {
            setTX(res.events.AoCreated.transactionHash);
            setRecorded(true);
            toast(`Appel d'offre : ${res.events.AoCreated.returnValues.name} enregisté !`,
            {style: { height:'50px', background:'#1dc200',color:'white', fontSize:"15px", padding:'0px 15px'}});
            setLoading(false);
            init(artifact);
        }).catch(error => {
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
    };

    const handleNavigate = () => {
        navigate(`/Account/${userInfo.name}/MyAO`);
    };

    return (
        <>
            <Header />
            <main>
                <section className="section-nav">
                    <NavInfo />
                </section>
                <section>
                    <div id="main-container-CreateAo">
                        <form onSubmit={handleCreateAo} id="form-ao">
                            <div id="top-form-ao">
                                <div id="input-form-ao-title">
                                    <div id="descript-form-ao">
                                        <p>Mon adresse Wallet</p>
                                        <p>Entreprise Donneur d’ordres</p>
                                    </div>
                                    <div id="data-form-ao">
                                        <p>{accounts.slice(0, -35)}...{accounts.slice(-6)}</p>
                                        <p>{userInfo.name}</p>
                                    </div>
                                </div>
                                <div id="input-form-ao">
                                    <input type="text" name="name" id="name" className="form-control" required onChange={e =>setNameFormAo(e.target.value)}/>
                                </div>
                            </div>
                            <div id="bottom-form-ao">
                                {!recorded ? (
                                    <>
                                        {loading ? (
                                            <button className="myButton" ><Loader size={"small"}/></button>
                                        ) : (
                                            <button className="myButton" type="submit">Creer un Appel d'offre</button>
                                        )}
                                    </>
                                    ) : (
                                        <> 
                                            <button className="myButton" onClick={handleNavigate}>Voir mes Appels d'offres</button>
                                            <p>{tx}</p>
                                        </>
                                    )}
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
};

export default CreateAo;