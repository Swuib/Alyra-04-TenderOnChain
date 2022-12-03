import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import toast from 'react-hot-toast';
import Header from '../../Layout/Header/Header';
import NavInfo from '../../Layout/NavInfo/NavInfo';
import './home.css';
import Loader from '../../Layout/Loader/Loader';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../contexts/Redux/actions/init.actions';
// import { useEffect } from 'react';

const Home = () => {
    const { state: { contract, accounts } } = useEth();
    const { user:{ name }, userErr:{ userError } } = useSelector((state) => state);
    const [nameForm, setNameForm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    console.log('Home Page');
    // console.log('userconnected : ' + userConnected);
    // console.log('isRegistred : ' + isRegistred);
    console.log('userError : ' + userError);
    console.log(contract);

    // useEffect(() => {
    //     if (contract !== undefined && contract !== null && accounts !== null) {
    //         // if (isRegistred === true) {
    //             const fetchData = async () => {
    //                 await contract.methods.getAccount(accounts).call({from: accounts }).then( res => {
    //                     dispatch(setUser(res));
    //                     dispatch(setUserErr(""));
    //                 }).catch(error => {
    //                     const errorObject = JSON.parse(error.toString().replace("Error: Internal JSON-RPC error.", ""));
    //                     dispatch(setUserErr(errorObject.message.replace("VM Exception while processing transaction: revert ", "")));
    //                 });
    //             };
    //             fetchData();
    //         // }
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [accounts]);
    

    const handelCreate = async e => {
        setLoading(true);
        e.preventDefault();
        await contract.methods.createAccount(nameForm).send({ from: accounts }).then( async res => {
            // const resProposalId = parseInt(res.events.Voted.returnValues.proposalId, 10);
            // const add = res.from;
            // console.log(res.events.userAdded.returnValues.name);
            // setRegisteredAdress(
            //     Object.values({
            //     ...RegisteredAdress, [UserIndexForRegisteredAdress]: 
            //     {...RegisteredAdress[UserIndexForRegisteredAdress],address:add.toLowerCase(), voteCount: resProposalId }}));
            // setProposalData(
            //     Object.values({
            //     ...ProposalData, [vote]: 
            //     {...ProposalData[vote], voteCount: voteCountProposal +1 }}));
            // setUserInfo({hasVoted:true, isRegistered:userInfo.isRegistered, votedProposalId:`${vote}`});
            const resUser = await contract.methods.getAccount(accounts).call({ from: accounts });
            dispatch(setUser(resUser));
            toast(`Compte ${res.events.userAdded.returnValues.name} enregisté !`,
            {style: { height:'50px', background:'#1dc200',color:'white', fontSize:"15px", padding:'0px 15px'}});
            setLoading(false);
            navigate(`/Account/${res.events.userAdded.returnValues.name}`);
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

    const connect = () => {
        window.ethereum.request({ method: 'eth_requestAccounts' });
    };

    return (
        <>
            <Header/>
            <main>
                <section>
                    <NavInfo />
                </section>
                <section>
                    <div className="main-container">
                        <div className="left-container">
                            <p>TenderOnChain est la Marketplace d'appels d'offres du secteur 
                            privé améliorant la transparence, la sécurité des procédures 
                            et la concurrence grâce à la technologie blockchain.</p>
                        </div>
                        {accounts !== null ? (
                            <>
                                {userError === '' ? 
                                    navigate(`/Account/${name}`)
                                : (
                                    <div className="rigth-container">
                                        <p className='title-label'>Créer un compte</p>
                                        <form onSubmit={handelCreate}>
                                            <label htmlFor="exampleInputEmail1">Nom de votre entreprise </label>
                                            <input type="text" name="address" id="address" className="form-control" required onChange={e =>setNameForm(e.target.value)}/>
                                            <div className="btn-group">
                                                {loading ? (
                                                    <Loader size={"small"}/>
                                                ) : (
                                                    <button  className="myButton" type="submit">Creer votre compte</button>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="rigth-container">
                                <p className='title-label'>Se connecter</p>
                                <button className="add-button" onClick={connect}>Connect MetaMask</button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;