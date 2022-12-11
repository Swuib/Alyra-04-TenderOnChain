import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import toast from 'react-hot-toast';
import Header from '../../Layout/Header/Header';
import NavInfo from '../../Layout/NavInfo/NavInfo';
import './home.css';
import Loader from '../../Layout/Loader/Loader';

const Home = () => {
    const { state: { contract, accounts , userInfo, userErr,networkID, networkIDValid }, waiting } = useEth();
    const [nameForm, setNameForm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (accounts !== null) {
            if (userInfo !== null) {
                if (userErr === "") {
                    if (waiting === false) {
                        navigate(`/Account/${userInfo.name}`);
                    }
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accounts,waiting,networkID]);

    const handleCreate = async e => {
        setLoading(true);
        e.preventDefault();
        await contract.methods.createAccount(nameForm).send({ from: accounts }).then( async res => {
            toast(`Compte ${res.events.userAdded.returnValues.name} enregisté !`,
            {style: { height:'50px', background:'#1dc200',color:'white', fontSize:"15px", padding:'0px 15px'}});
            window.location.reload();
            setLoading(false);
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

    const connect = () => {
        window.ethereum.request({ method: 'eth_requestAccounts' });
    };

    return (
        <>
            <Header/>
            <main>
                {waiting === true ? (
                    <>
                        <span></span>
                        <div className='waiting'>
                            <Loader size={"large"}/>
                        </div>
                    </>
                ) : (
                    <>
                        <section className="section-nav">
                            <NavInfo />
                        </section>
                        <section>
                            <div className="main-container">
                                <div className="left-container">
                                    <p>TenderOnChain est la Marketplace d'appels d'offres du secteur 
                                    privé améliorant la transparence, la sécurité des procédures 
                                    et la concurrence grâce à la technologie blockchain.</p>
                                </div>
                                <div className="rigth-container">
                                    {networkID === networkIDValid ? (
                                        <>
                                            {accounts !== null ? (
                                                <>
                                                    {userErr === "Vous n'etes pas un utilisateur" ? (
                                                        <div className='rigth-sub-container'>
                                                            <p className='title-label'>Créer un compte</p>
                                                            <form onSubmit={handleCreate}>
                                                                <label htmlFor="name">Nom de votre entreprise </label>
                                                                <input type="text" name="name" id="name" className="form-control" required onChange={e =>setNameForm(e.target.value)}/>
                                                                <div className="btn-group">
                                                                    {loading ? (
                                                                        <button  className="myButton" type=""><Loader size={"small"}/></button>
                                                                    ) : (
                                                                        <button  className="myButton" type="submit">Creer votre compte</button>
                                                                    )}
                                                                </div>
                                                            </form>
                                                        </div>
                                                    ) : (
                                                        <Loader size={"small"}/>
                                                    )}
                                                </>
                                            ) : (
                                                <div className='rigth-sub-container'>
                                                    <button className="myButton" onClick={connect}>Se connecter (MetaMask)</button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className='rigth-sub-container'>
                                            <p id="network">Vous n'êtes pas connecté sur le bon réseau !</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </>
    );
};

export default Home;