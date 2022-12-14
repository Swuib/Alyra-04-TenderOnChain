import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Header from '../../Layout/Header/Header';
import Loader from '../../Layout/Loader/Loader';
import NavInfo from '../../Layout/NavInfo/NavInfo';
import { convertDateToLocal } from '../../Utils/Utils';
import "./myao.css";

const MyAo = () => {
    const { state: { userInfo, myArrayAo },waiting } = useEth();
    const [searchTermName, setSearchTermName] = useState("");
    const [searchByDate, setSearchByDate] = useState("");

    const hanleSearchName = e => {
        const value = e.target.value;
        setSearchTermName(value);
    };

    const hanleSearchDate = e => {
        setSearchByDate(e.target.value);
    };

    return (
        <>
            <Header />
            <main>
                <section className="section-nav">
                    <NavInfo />
                </section>
                <section id='section-bottom-myao'>
                    <div className="add-container">
                    </div>
                    <div id="array-ao">
                        <div id='array-ao-sub'>
                            <div id='top-array'>
                                <div id="top-array-myao-left">
                                    <input type="text" placeholder="Rechercher par nom AO" onChange={hanleSearchName} />
                                    <input type="date" placeholder="Rechercher par date" onChange={hanleSearchDate} />
                                </div>
                                <div id="top-array-myao-rigth">
                                    <Link to={`/Account/${userInfo.name}/CreateAO`}>
                                        <button className='myButton'>Créer un Appel d’offres</button>
                                    </Link>
                                    <span></span>
                                    <Link to={`/Account/${userInfo.name}`}>
                                        <button className='myButton-return'>Retour au compte ⮐</button>
                                    </Link>
                                </div>
                            </div>
                            <div id='bottom-array'>
                                <div id='title-data-array'>
                                    <div className='column'>N°Ao</div>
                                    <div className='column'>Nombre de lot</div>
                                    <div className='column'>Nom de l'appel d'offre</div>
                                    <div className='column'>Date de création</div>
                                    <div className='column'>Statut</div>
                                    <div className='column'>      </div>
                                </div>
                                <div id='data-array'>
                                {waiting === true ? (
                                    <div className='waiting'>
                                        <Loader size={"large"}/>
                                    </div>
                                ) : (
                                    <>
                                        {myArrayAo.length > 0 ? (
                                            <>
                                                {myArrayAo
                                                    .filter( (value) => {
                                                        return value.aoName.toLowerCase().includes(searchTermName.toLowerCase())
                                                    })
                                                    .filter( (value) => {
                                                        return value.createdAt.includes(searchByDate)
                                                    })
                                                    .map((value, key) => {
                                                    return(
                                                        <div key={`data-${key}`} className='data'>   
                                                            <div className="tr-data">{value.index+1}</div>
                                                            <div className="tr-data">{value.lastLotId}</div>
                                                            <div className="tr-data">{value.aoName}</div>
                                                            <div className="tr-data">{convertDateToLocal(value.createdAt)}</div>
                                                            <div className="tr-data">{value.isOpen === false ? "En cours" : "terminé"}</div>
                                                            <div className="tr-data">
                                                                <Link 
                                                                    to={`/Account/${userInfo.name}/${value.index}`} 
                                                                    state={{value,userInfo,Ao:value}}
                                                                >
                                                                    <button className='small-button'>Voir</button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        ) : (
                                            <Loader />
                                        )}
                                    </>
                                )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default MyAo;