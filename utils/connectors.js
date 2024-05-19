import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

const metamask = initializeConnector((actions) => new MetaMask({ actions }));

const SUPPORTED_CHAINS = {
    4002: {
        urls: ["https://rpc.testnet.fantom.network"],
        name: "Fantom Testnet",
        nativeCurrency: {
            name: "Fantom",
            symbol: "ftm",
            decimals: 18,
        },
        blockExplorerUrls: ["https://testnet.ftmscan.com/"],
    },
};

const [mainnet, ...optionalChains] = Object.keys(SUPPORTED_CHAINS).map(Number);

const walletConnectV2 = initializeConnector((actions) => new WalletConnectV2({
    actions,
    options: {
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
        chains: [mainnet],
        optionalChains,
        showQrModal: true,
    },
}));

const connectors = [metamask, walletConnectV2];

export default connectors;