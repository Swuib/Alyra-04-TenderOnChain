import { Link } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import './header.css';

const Header = () => {
    const { state: { accounts } } = useEth();

    return (
        <header>
            <div id="left-header">
                <Link to='/'>
                    <p>TenderOnChain</p>
                </Link>
            </div>
            <div id="middle-header">
                
            </div>
            <div id="rigth-header">
                <div className="address-container">
                    {accounts !== null ? (
                        <p className="add">{accounts.slice(0, -35)}...{accounts.slice(-6)}</p>
                    ) : (
                        <p className="add">not conected</p>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;