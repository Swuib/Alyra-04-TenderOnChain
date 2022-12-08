import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Account from '../Pages/Account/Account';


import UserRegisteredRoute from './UserRegisteredRoute';
import UserRegisteredRouteAo from './UserRegisteredRouteAo';
import UserRegisteredRouteSoum from './UserRegisteredRouteSoum';

import Home from '../Pages/Home/Home';

import MyAo from '../Pages/MyAo/MyAo';
import CreateAo from '../Pages/CreateAo/CreateAo';
import CreateLot from '../Pages/CreateLot/CreateLot';
import DetailsMyAo from '../Pages/DetailsMyAo/DetailsMyAo';

import MySoum from '../Pages/MySoum/MySoum';
import Soum from '../Pages/Soum/Soum';

import Auditor from '../Pages/Auditor/Auditor';
import Owner from '../Pages/Owner/Owner';
import DetailsMyLot from '../Pages/DetailsMyLot/DetailsMyLot';
import DetailsMyLotSoum from '../Pages/DetailsMyLotSoum/DetailsMyLotSoum';
import DetailsMySoum from '../Pages/DetailsMySoum/DetailsMySoum';

const index = () => { 
    return (
        <BrowserRouter >
            <Routes >
                <Route index element={<Home />}/>
                <Route path="/Account/:id" element={<UserRegisteredRoute><Account /></UserRegisteredRoute>}/>
                
                <Route path="/Account/:id/MyAO" element={<UserRegisteredRoute><MyAo /></UserRegisteredRoute>}/>
                <Route path="/Account/:id/CreateAO" element={<UserRegisteredRoute><CreateAo /></UserRegisteredRoute>}/>
                
                <Route path="/Account/:id/:id" element={<UserRegisteredRouteAo><DetailsMyAo /></UserRegisteredRouteAo>}/>
                <Route path="/Account/:id/:id/CreateLot" element={<UserRegisteredRouteAo><CreateLot /></UserRegisteredRouteAo>}/>
                <Route path="/Account/:id/:id/DetailLot" element={<UserRegisteredRouteAo><DetailsMyLot /></UserRegisteredRouteAo>}/>
                <Route path="/Account/:id/:id/DetailLot/DetailSoum" element={<UserRegisteredRouteAo><DetailsMyLotSoum /></UserRegisteredRouteAo>}/>

                <Route path="/Account/:id/Soum" element={<UserRegisteredRoute><Soum /></UserRegisteredRoute>}/>
                <Route path="/Account/:id/MySoum" element={<UserRegisteredRoute><MySoum /></UserRegisteredRoute>}/>
                <Route path="/Account/:id/SoumDetail/:id" element={<UserRegisteredRouteSoum><DetailsMySoum /></UserRegisteredRouteSoum>}/>

                <Route path="/Auditor" element={<UserRegisteredRoute><Auditor /></UserRegisteredRoute>}/>
                <Route path="/Owner" element={<UserRegisteredRoute><Owner /></UserRegisteredRoute>}/>

                <Route path="*" element={<Navigate _replace_ to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default index;