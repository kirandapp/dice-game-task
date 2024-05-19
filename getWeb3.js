import Web3 from "web3";
import UniversalProvider from "@walletconnect/universal-provider";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

const getWeb3 = async (provider, chainId) => {
    let web3;
    const connectedWallet = localStorage.getItem("connectedWallet");

    if (connectedWallet === "walletConnectV2") {
        try {
            const ethereumProvider = await UniversalProvider.init({
                projectId: projectId,
                logger: "debug",
                relayUrl: "was://relay.walletconnect.com",
                metadata: {
                    name: "React App",
                    description: "React App for WalletConnect",
                    url: "https://walletconnect.com/",
                    icons: ["https://avatars.githubusercontent.com/u/37784886"],
                },
            });

            await ethereumProvider.enable({
                namespaces: {
                    eip155: {
                        methods: [
                            "eth_sendTransaction",
                            "eth_signTransaction",
                            "eth_sign",
                            "personal_sign",
                            "eth_signTypedData",
                        ],
                        chains: ["eip155:4002"],
                        optionalChains: ["eip155:4002"],

                        events: ["chainChangd", "accountsChanged"],
                        rpcMap: {
                            4002: `https://rpc.walletconnect.com/v1/?chainId=eip155:4002&projectId=${projectId}`,
                        },
                    },
                },
                skipPairing: false,
            });

            ethereumProvider.setDefaultChain(`eip155:${chainId}`);
            web3 = new Web3(ethereumProvider);
        } catch (err) {
            throw err;
        }
    } else if (connectedWallet === "metamask") {
        let mprovider = provider.provider;
        await mprovider.enable();
        web3 = new Web3(mprovider);
    }
    return web3;
};

export default getWeb3;