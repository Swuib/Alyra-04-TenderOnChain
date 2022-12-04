import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Header from '../../Layout/Header/Header';
import NavInfo from '../../Layout/NavInfo/NavInfo';

const MyAo = () => {
    const { state: { contract,accounts, userInfo } } = useEth();


    useEffect(() => {
        if (contract !== null ) {
            const fetchdata = async () => {
                await contract.methods.tableauAO(0).call({ from: accounts }).then( async res => {
                    console.log(res);
                    // toast(`Compte ${res.events.userAdded.returnValues.name} enregisté !`,
                    // {style: { height:'50px', background:'#1dc200',color:'white', fontSize:"15px", padding:'0px 15px'}});
                    // setLoading(false);
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
                    // setLoading(false);
                });
            }
            fetchdata();
        }

    }, [contract])
    

    return (
        <>
            <Header />
            <main>
                <section>
                    <NavInfo />
                </section>
                <section>
                    <div className="add-container">
                        <Link to={`/Account/${userInfo.name}/CreateAO`}>
                            <button className='myButton'>Créer un Appel d’offres</button>
                        </Link>
                    </div>
                    <div id="array-ao">

                    </div>
                </section>
            </main>
        </>
    );
};

export default MyAo;