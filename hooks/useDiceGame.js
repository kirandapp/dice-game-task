import useContract from "./useContract";

import abi from "../contracts/DICE_GAME.json";

const useDiceGame = () => {
    return useContract(
        process.env.NEXT_PUBLIC_DICE_GAME_ADDRESS,
        abi,
        process.env.NEXT_PUBLIC_FANTOM_CHAINID
    );
};

export default useDiceGame;