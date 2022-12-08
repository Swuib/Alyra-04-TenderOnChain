import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Header from '../../Layout/Header/Header';
import NavInfo from '../../Layout/NavInfo/NavInfo';
import './detailsmylotsoum.css'

const DetailsMyLotSoum = () => {
    const { state: { accounts, contract} } = useEth();
    const [soum, setSoum] = useState(null)
    const location = useLocation();
    const [locationState,] = useState(location.state);
    console.log(location.state);
    console.log(soum);
    
    useEffect(() => {
        // if (contract !== undefined) {
        //     const fetchData = async () => {
        //         const respSoum = await contract.methods.getAccount().call({ from: accounts });
        //         console.log(respSoum);
        //         setSoum(respSoum);
        //     }
        //     fetchData();
        // }
    }, [])

    return (
        <>
            <Header/>
            <main>
                <section className="section-nav">
                    <NavInfo context={locationState}/>
                </section>
                <section>
                    <div className="main-container">
                        OWNER
                    </div>
                </section>
            </main>
        </>
    );
};

export default DetailsMyLotSoum;