import React, { useState, useEffect, useRef } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";
import connectors from "../../utils/connectors";

const injected = connectors[0][0];
const walletConnectV2 = connectors[1][0];

const DEFAULT_CHAINID = parseInt(process.env.NEXT_PUBLIC_FANTOM_CHAINID);

const ConnectWallet = ({ setActiveModal }) => {
    const { connector, account, chainId } = useWeb3React();
    const [activatingConnector, setActivatingConnector] = useState();
    const onboarding = useRef();

    //connect metamask function
    const onConnectMetamaskFunc = () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            setActivatingConnector(injected);
            Promise.resolve(injected.activate(DEFAULT_CHAINID)).catch((e) => {
                injected.resetState();
                setActivatingConnector();
                localStorage.removeItem("connectedWallet");
                console.debug("\nFailed to connect to metamask");
            });
            localStorage.setItem("connectedWallet", "metamask");
        } else {
            onboarding.current.startOnboarding();
        }
    };

    // coneect connectwallet function
    const onConnectWithWalletConnect = () => {
        setActivatingConnector(walletConnectV2);
        Promise.resolve(walletConnectV2.activate()).catch((e) => {
            walletConnectV2.resetState();
            setActivatingConnector();
            localStorage.removeItem("connectedWallet");
            console.debug("\nFailed to connect to WalletConnectV2");
        });
        localStorage.setItem("connectedWallet", "WalletConnectV2");
    };

    useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled) {
            if (account && account.length > 0) {
                onboarding?.current?.stopOnboarding();
            }
        }
    }, [account]);

    useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    return (
        <div>
            <div>
                <div className="flex justify-left gap-10 pt-8">
                    <img
                        src="/Images/metamask.png"
                        onClick={() => {
                            onConnectMetamaskFunc(1);
                            setActiveModal(false);
                        }}
                        alt="metamask"
                        className="trnasition-all  cursor-pointer hover:scale-95"
                    />
                </div>
                <div className="flex justify-left mt-5">
                    <button
                        onClick={() => setActiveModal(false)}
                        className=" text-white bg-[#e52123] px-10 py-2 rounded-3xl active:scale-95 hover:bg-red-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

};

export default ConnectWallet;