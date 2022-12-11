import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Header from '../../Layout/Header/Header';
import Loader from '../../Layout/Loader/Loader';
import NavInfo from '../../Layout/NavInfo/NavInfo';
import { compareDate, convertDateToLocal, getDateInISOFormat, options } from '../../Utils/Utils';
import './soum.css';

const Soum = () => {
    const { state: { userInfo, arrayLot,accounts },waiting } = useEth();
    const [loading, setLoading] = useState(false);
    const [searchTermName, setSearchTermName] = useState("");
    const [searchByDate, setSearchByDate] = useState("");
    const [arrayLotFiltred, setArrayLotFiltred] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [susCategory, setSelectedSusCategory] = useState("");

    const hanleSearchName = e => {
        const value = e.target.value;
        setSearchTermName(value);
    };

    const hanleSearchDate = e => {
        setSearchByDate(e.target.value);
    };

    const handleCategorie = e => {
        if (e.target.vale === undefined) {
            setSelectedSusCategory("");
        }
        setSelectedCategory(e.target.value);
    };

    const handleSusCategorie = e => {
        setSelectedSusCategory(e.target.value);
    };

    const filterOptions = (category) => {
        return options.find(opt => opt.category === category).items;
    };
    
    useEffect(() => {
        setLoading(true);
        let filtred = [];
        if (arrayLot.length > 0) {
            for (let i = 0; i < arrayLot.length; i++) {
                if (compareDate(arrayLot[i].TsCloture)) {
                    filtred.push(arrayLot[i]);
                };
            };
            setArrayLotFiltred(filtred);
            setLoading(false);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrayLot]);

    return (
        <>
            <Header/>
            <main>
                <section className="section-nav">
                    <NavInfo />
                </section>
                <section>
                    <div className="main-container-soum">
                        <div className="add-container">
                        </div>
                        <div id="array-ao">
                            <div id='array-soum'>
                                <div id='top-array-soum'>
                                    <div id="top-array-soum-left">
                                        <div id="title-filter">
                                            <p>Filtres :</p>
                                        </div>
                                        <div id="filter">
                                            <input type="text" placeholder="Rechercher par Entreprise" onChange={hanleSearchName} />
                                            <input type="date" placeholder="Rechercher par date" min={getDateInISOFormat()} onChange={hanleSearchDate} />
                                            <select value={selectedCategory} required onChange={handleCategorie}>
                                                <option value={""}>Catégories</option>
                                                {options.map(opt => <option key={opt.category} value={opt.category}>{opt.category}</option>)}
                                            </select>
                                            <select value={susCategory} required onChange={handleSusCategorie}>
                                                <option value={""}>Sous-catégories</option>
                                                {selectedCategory && filterOptions(selectedCategory).map(item => <option key={item} value={item}>{item}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div id="top-array-soum-rigth">
                                        <Link to={`/Account/${userInfo.name}/MySoum`}>
                                            <button className='myButton'>Voir mes participations</button>
                                        </Link>
                                        <span></span>
                                        <Link to={`/Account/${userInfo.name}`}>
                                            <button className='myButton-return'>Retour au compte ⮐</button>
                                        </Link>
                                    </div>
                                </div>
                                <div id='bottom-array'>
                                    <div id='title-data-array-soum'>
                                        <div className='column'>N°Ao</div>
                                        <div className='column'>N° Lot</div>
                                        <div className='column'>Nom entrpsie</div>
                                        <div className='column'>Catégorie</div>
                                        <div className='column'>Sous-Catégorie</div>
                                        <div className='column'>Date Clôture</div>
                                        <div className='column'>Valorisation</div>
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
                                            {!loading ? (
                                                <>
                                                    {arrayLotFiltred
                                                        // The name filter
                                                        .filter( (value) => {
                                                            return value.aoName.toLowerCase().includes(searchTermName.toLowerCase())
                                                        })
                                                        // The date filter
                                                        .filter( (value) => {
                                                            return value.TsCloture.includes(searchByDate)
                                                        })
                                                        // The cat filter
                                                        .filter( (value) => {
                                                            return value.categorie.includes(selectedCategory)
                                                        })
                                                        // The suscat filter
                                                        .filter( (value) => {
                                                            return value.susCategorie.includes(susCategory)
                                                        })
                                                        .map((value, key) => {
                                                            return(
                                                                <div key={`data-${key}`} className='data-soum'>   
                                                                    <div className="tr-data">{value.idAO+1}</div>
                                                                    <div className="tr-data">{value.index+1}</div>
                                                                    <div className="tr-data">{value.aoName}</div>
                                                                    <div className="tr-data">{value.categorie}</div>
                                                                    <div className="tr-data">{value.susCategorie}</div>
                                                                    <div className="tr-data">{convertDateToLocal(value.TsCloture)}</div>
                                                                    <div className="tr-data">{value.minprice}-{value.maxprice} €</div>
                                                                    <div className="tr-data">{"En cours"}</div>
                                                                    {accounts !== value.adressDDO.toLowerCase() && (
                                                                        <div className="tr-data">
                                                                            <Link 
                                                                                to={`/Account/${userInfo.name}/SoumDetail/${value.index}`} 
                                                                                state={{value,userInfo,arrayLot,context:'Soum'}}
                                                                            >
                                                                                <button className='small-button'>Voir</button>
                                                                            </Link>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        })
                                                    }
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
                    </div>
                </section>
            </main>
        </>
    );
};

export default Soum;