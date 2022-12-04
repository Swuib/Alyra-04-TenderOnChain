import React from 'react';
import Header from '../../Layout/Header/Header';
import NavInfo from '../../Layout/NavInfo/NavInfo';

const Soum = () => {
    return (
        <>
            <Header/>
            <main>
                <section>
                    <NavInfo />
                </section>
                <section>
                    <div className="main-container">
                        SOUM
                    </div>
                </section>
            </main>
        </>
    );
};

export default Soum;