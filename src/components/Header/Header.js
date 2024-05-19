import React, { useState } from 'react';
import { HiOutlineLogout } from 'react-icons/hi';
import ConnectWallet from '../ConnectWallet';
import { useWeb3React } from '@web3-react/core';
import './Header.css'; // Import your CSS file

export default function Header() {
    const [activeModal, setActiveModal] = useState(false);
    const { account, connector, chainId } = useWeb3React();

    const logout = () => {
        if (connector?.deactivate) {
            connector.deactivate();
        } else {
            connector.resetState();
        }
        localStorage.removeItem('connectedWallet');
    };

    return (
        <div className="header-container">
            {account ? (
                <button className="account-button" onClick={logout}>
                    <div>
                        {account.slice(0, 5)}...{account.slice(-5)}
                    </div>
                </button>
            ) : (
                <button className="connect-button" onClick={() => setActiveModal(true)}>
                    <a href="#">CONNECT</a>
                </button>
            )}
            {activeModal && (
                <div className="modal-overlay">
                    <div className="connect-wallet-container">
                        <ConnectWallet setActiveModal={setActiveModal} />
                        <button className="close-button" onClick={() => setActiveModal(false)}>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
