import React from 'react';
import Header from '../../Layout/Header/Header';
import NavInfo from '../../Layout/NavInfo/NavInfo';

const Owner = () => {
    return (
        <>
            <Header/>
            <main>
                <section>
                    <NavInfo />
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

export default Owner;