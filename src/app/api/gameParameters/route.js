import Web3 from 'web3';
import BigNumber from "bignumber.js";
import diceABI from "../../../../contracts/DICE_GAME.json";
import { NextResponse } from 'next/server';



export async function POST(request) {
    console.log("IN API of gameParameter");
    try {
        const _web3 = new Web3(process.env.NEXT_PUBLIC_FANTOM_RPC);
        const contract = new _web3.eth.Contract(diceABI, process.env.NEXT_PUBLIC_DICE_GAME_ADDRESS);
        let minBet = await contract.methods.minBetAmount().call();
        minBet = _web3.utils.fromWei(minBet, 'ether');
        let maxBet = await contract.methods.maxBetAmount().call();
        maxBet = _web3.utils.fromWei(maxBet, 'ether');
        let winningRate = await contract.methods.getWinningRate().call();
        winningRate = Number(winningRate);
        
        return NextResponse.json({ minBet, maxBet, winningRate });
    } catch (error) {
        console.error('Error fetching game parameters:', error);
        return NextResponse.json({ error: 'Failed to fetch game parameters' });
    }
}