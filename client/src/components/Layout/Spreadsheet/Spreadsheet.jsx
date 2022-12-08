import { useState } from "react";
import Loader from "../Loader/Loader";
import './spreadsheet.css';

const Spreadsheet = ({array,column}) => {
    const [datas,] = useState(array);
    const [searchTermName, setSearchTermName] = useState("");

    const hanleSearchName = e => {
        const value = e.target.value;
        setSearchTermName(value);
    };
    const hanleSearchDate = e => {
        const value = e.target.value;
        console.log(value);
        // setSearchTerm(value);
    };

    console.log(datas);
    console.log(searchTermName);
    return (
        <div id='array'>
            <div id='top-array'>
                <input type="text" placeholder="Rechercher par nom AO" onChange={hanleSearchName} />
                <input type="date" placeholder="Rechercher par date" onChange={hanleSearchDate} />
            </div>
            <div id='bottom-array'>
                <div id='title-data-array'>
                    {column.map((value, key)=> {
                        console.log(value);
                        return(
                            <div key={`column-${key}`} className='column'>{value}</div>
                        )
                    })}
                </div>
                <div id='data-array'>
                    {datas !== undefined ? (
                        <>
                            {datas
                                .filter( (value) => { // barre de recherche de input text (filtre par nom)
                                    console.log('value');
                                    console.log(value);
                                    return value.name.toLowerCase().includes(searchTermName.toLowerCase())
                                }).map((value, key) => {
                                console.log(value);
                                return(
                                    <div key={`data-${key}`} className='data'>
                                        {column.length === 5 && (
                                            <>
                                                <div className="tr-data">{value.index}</div>
                                                <div className="tr-data">{value.name}</div>
                                                <div className="tr-data">{value.date}</div>
                                                <div className="tr-data">{value.status === true ? "terminé" : "En cours"}</div>
                                                <div className="tr-data"><button >Voir</button></div>
                                            </>
                                        )}
                                    </div>
                                )
                            })}
                        </>
                    ) : (
                        <Loader />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Spreadsheet;