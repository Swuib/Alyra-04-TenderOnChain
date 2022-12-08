import React from 'react';
import Header from '../../Layout/Header/Header';
import NavInfo from '../../Layout/NavInfo/NavInfo';

const MySoum = () => {
    return (
        <>
            <Header/>
            <main>
                <section className="section-nav">
                    <NavInfo />
                </section>
                <section>
                    <div className="main-container">
                        my soum
                    </div>
                </section>
            </main>
        </>
    );
};

export default MySoum;