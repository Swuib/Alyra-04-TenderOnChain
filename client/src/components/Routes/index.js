import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Account from '../Pages/Account/Account';
import CreateAccount from '../Pages/CreateAccount/CreateAccount';

// import OwnerRoute from './OwnerRoute';
// import RegisterAddProposalRoute from './RegisterAddProposalRoute';
// import OwnerOrVoterRoute from './OwnerOrVoterRoute';
// import OwnerAddUserRoute from './OwnerAddUserRoute';

import Home from '../Pages/Home/Home';
// import AddUser from '../Pages/AddUser/AddUser';
// import WorkFlow from '../Pages/Workflow/WorkFlow';
// import AddProposal from '../Pages/AddProposal/AddProposal';
// import Proposal from '../Pages/Proposal/Proposal';
// import Statistics from '../Pages/Statistics/Statistics';

const index = () => { 
    return (
        <BrowserRouter >
            <Routes >
                <Route index element={<Home />}/>
                <Route path="/createAccount" element={<CreateAccount />}/>
                <Route path="/Account/:id" element={<Account />}/>

                {/* <Route path="/addUser" element={<OwnerAddUserRoute><AddUser /></OwnerAddUserRoute>}/>
                <Route path="/WorkFlow" element={<OwnerRoute><WorkFlow /></OwnerRoute>}/>
                <Route path="/Statistics" element={<OwnerRoute><Statistics /></OwnerRoute>}/>

                <Route path="/addProposal" element={<RegisterAddProposalRoute><AddProposal /></RegisterAddProposalRoute>}/>
                <Route path="/Proposal" element={<OwnerOrVoterRoute><Proposal /></OwnerOrVoterRoute>}/> */}

                <Route path="*" element={<Navigate _replace_ to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default index;