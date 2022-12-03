import React from 'react';
import { useLocation } from 'react-router-dom';

const Account = () => {
    const location = useLocation();
    console.log(location.pathname.replace("/Account/", ""));
    return (
        <div>
            Account
        </div>
    );
};

export default Account;