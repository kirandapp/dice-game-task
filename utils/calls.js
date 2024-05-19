import BigNumber from "bignumber.js";
import diceABI from "../contracts/DICE_GAME.json";
import { useWeb3React } from "@web3-react/core";
import { Signature } from "ethers";

export const rollUnder = async (
    connectedWallet,
    address,
    betAmount,
    randomNumber,
    currentDate,
    signature
) => {
    // console.log("connectedWallet, address, betAmount, randomNumber, currentDate, signature ",connectedWallet, address, betAmount, randomNumber, currentDate, signature);
    try {
        let _web3 = window.web3;
        console.log("_web3", _web3);
        if (address) {
            const contract = new _web3.eth.Contract(diceABI, address);
            const rollunder = await contract.methods.rollUnder(
                randomNumber,
                currentDate,
                signature
            );

            // Estimating the gas limit
            const estimatedGas = await rollunder.estimateGas({
                from: connectedWallet,
                value: betAmount,
            });
            const gasMargin = 10;
            const gasLimit = calculateGasMargin(estimatedGas, gasMargin);
            console.log("gasLimit - ", gasLimit);

            // Getting the current gas price from the network
            const currentGasPrice = await _web3.eth.getGasPrice();
            const gasPriceIncrease = 5;
            const gasPrice =
                gasPriceIncrease > 0
                    ? calculateGasPriceMargin(currentGasPrice, gasPriceIncrease)
                    : currentGasPrice;
            console.log("gasPrice - ", gasPrice);

            const tx = await _web3.eth.sendTransaction({
                from: connectedWallet,
                to: address,
                data: rollunder.encodeABI(),
                value: betAmount,
                gas: "300000",
                gasPrice: gasPrice,
            });
        }
    } catch (e) {
        throw e;
    }
};
export const rollOver = async (
    connectedWallet,
    address,
    betAmount,
    randomNumber,
    currentDate,
    signature
) => {
    // console.log("connectedWallet, address, betAmount, randomNumber, currentDate, signature ",connectedWallet, address, betAmount, randomNumber, currentDate, signature);
    try {
        let _web3 = window.web3;
        console.log("_web3", _web3);
        if (address) {
            const contract = new _web3.eth.Contract(diceABI, address);
            const rollover = await contract.methods.rollOver(
                randomNumber,
                currentDate,
                signature
            );

            // Estimating the gas limit
            const estimatedGas = await rollover.estimateGas({
                from: connectedWallet,
                value: betAmount,
            });
            const gasMargin = 10;
            const gasLimit = calculateGasMargin(estimatedGas, gasMargin);
            console.log("gasLimit - ", gasLimit);

            // Getting the current gas price from the network
            const currentGasPrice = await _web3.eth.getGasPrice();
            const gasPriceIncrease = 5;
            const gasPrice =
                gasPriceIncrease > 0
                    ? calculateGasPriceMargin(currentGasPrice, gasPriceIncrease)
                    : currentGasPrice;
            console.log("gasPrice - ", gasPrice);

            const tx = await _web3.eth.sendTransaction({
                from: connectedWallet,
                to: address,
                data: rollover.encodeABI(),
                value: betAmount,
                gas: "300000",
                gasPrice: gasPrice,
            });
        }
    } catch (e) {
        throw e;
    }
};

export function calculateGasMargin(value, margin) {
    const estimatedGas = new BigNumber(value);
    const addtionalGas = estimatedGas.times(margin).div(100);
    const marginGas = estimatedGas.plus(addtionalGas);
    return marginGas.toFixed(0);
}
export function calculateGasPriceMargin(value, margin) {
    const estimatedGasPrice = new BigNumber(value);
    const addtionalGasPrice = estimatedGasPrice.times(margin).div(100);

    const marginGasPrice = estimatedGasPrice.plus(addtionalGasPrice);
    return marginGasPrice.toFixed(0);
}
