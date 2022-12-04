import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Account from '../Pages/Account/Account';
import CreateAccount from '../Pages/CreateAccount/CreateAccount';

// import OwnerRoute from './OwnerRoute';
import UserRegisteredRoute from './UserRegisteredRoute';

import Home from '../Pages/Home/Home';
import MyAo from '../Pages/MyAo/MyAo';
import MySoum from '../Pages/MySoum/MySoum';
import CreateAo from '../Pages/CreateAo/CreateAo';
import Soum from '../Pages/Soum/Soum';

import Auditor from '../Pages/Auditor/Auditor';
import Owner from '../Pages/Owner/Owner';

const index = () => { 
    return (
        <BrowserRouter >
            <Routes >
                <Route index element={<Home />}/>
                <Route path="/createAccount" element={<CreateAccount />}/>
                <Route path="/Account/:id" element={<UserRegisteredRoute><Account /></UserRegisteredRoute>}/>
                
                <Route path="/Account/:id/MyAO" element={<UserRegisteredRoute><MyAo /></UserRegisteredRoute>}/>
                <Route path="/Account/:id/CreateAO" element={<UserRegisteredRoute><CreateAo /></UserRegisteredRoute>}/>
                <Route path="/Account/:id/MySoum" element={<UserRegisteredRoute><MySoum /></UserRegisteredRoute>}/>
                <Route path="/Account/:id/Soum" element={<UserRegisteredRoute><Soum /></UserRegisteredRoute>}/>

                <Route path="/Auditor" element={<UserRegisteredRoute><Auditor /></UserRegisteredRoute>}/>
                <Route path="/Owner" element={<UserRegisteredRoute><Owner /></UserRegisteredRoute>}/>

                <Route path="*" element={<Navigate _replace_ to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default index;