import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useEth } from '../../../contexts/EthContext';
import Header from '../../Layout/Header/Header';
import Loader from '../../Layout/Loader/Loader';
import NavInfo from '../../Layout/NavInfo/NavInfo';
import './createao.css';

const CreateAo = () => {
    const { state: { contract, accounts , userInfo } } = useEth();
    const [nameFormAo, setNameFormAo] = useState("");
    const [loading, setLoading] = useState(false);

    const handelCreateAo = async e => {
        setLoading(true);
        e.preventDefault();
        await contract.methods.createAO(nameFormAo).send({ from: accounts }).then( async res => {
            console.log(res);
            toast(`Compte ${res.events.userAdded.returnValues.name} enregisté !`,
            {style: { height:'50px', background:'#1dc200',color:'white', fontSize:"15px", padding:'0px 15px'}});
            setLoading(false);
        }).catch(error => {
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
    };
    return (
        <>
            <Header />
            <main>
                <section>
                    <NavInfo />
                </section>
                <section>
                    <div className="main-container-CreateAo">
                        <form onSubmit={handelCreateAo}>
                            <div className="top-form-ao">
                                <div className="descript-form-ao">
                                    <p>Mon adresse Wallet</p>
                                    <p>Entreprise Donneur d’ordres</p>
                                    <p>Nom de l’Appel d’offres</p>
                                </div>
                                <div className="input-form-ao">
                                    <p>{accounts.slice(0, -35)}...{accounts.slice(-6)}</p>
                                    <p>{userInfo.name}</p>
                                    <input type="text" name="name" id="name" className="form-control" required onChange={e =>setNameFormAo(e.target.value)}/>
                                </div>
                            </div>
                            <div className="bottom-form-ao">
                                {loading ? (
                                    <button  className="myButton" type=""><Loader size={"small"}/></button>
                                ) : (
                                    <button  className="myButton" type="submit">Creer votre compte</button>
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