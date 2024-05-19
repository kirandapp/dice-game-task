"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import useDiceGame from "../../../hooks/useDiceGame";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { rollUnder, rollOver } from "../../../utils/calls";
import "./Dice.css";

const _web3FTM = new Web3(process.env.NEXT_PUBLIC_FANTOM_RPC);

const Dice = ({ handleCounter }) => {
    const [betAmount, setBetAmount] = useState(0);
    const [profit, setProfit] = useState(0);
    const [randomNumber, setRandomNumber] = useState(null);
    const [minBet, setMinBet] = useState(0);
    const [maxBet, setMaxBet] = useState(0);
    const [step, setStep] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalRollUnderBids, setTotalRollUnderBids] = useState(0);
    const [totalRollOverBids, setTotalRollOverBids] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);

    const { account } = useWeb3React();
    const diceGameInstance = useDiceGame();

    const videoRef = useRef(null);

    useEffect(() => {
        const calculateAmount = async () => {
            try {
                const winamount = new BigNumber(
                    _web3FTM.utils.toWei(betAmount, "ether") *
                    new BigNumber(
                        await diceGameInstance.methods.getWinningRate().call()
                    ).div(new BigNumber(10000))
                );
                const winamountInEth = _web3FTM.utils.fromWei(
                    winamount.toString(),
                    "ether"
                );
                // const winamount = betAmount * 1.97;
                setProfit(winamountInEth);
            } catch (error) {
                console.error("An error occurred while fetching bet amounts:", error);
                setProfit(0);
            }
        };
        if (
            Number(betAmount) >= Number(minBet) &&
            Number(betAmount) <= Number(maxBet)
        ) {
            calculateAmount();
            // setProfit(betAmount * 1.97)
        } else {
            setProfit(0);
        }
    }, [betAmount, minBet, maxBet]);

    const handleBetAmountChange = (event) => {
        setBetAmount(Number(event.target.value));
    };

    const handleMax = () => {
        if (Number(walletBalance) < Number(maxBet)) {
            const maxBalance = (Number(walletBalance) * 0.95).toFixed(2);
            setBetAmount(maxBalance);
        } else {
            setBetAmount(maxBet);
        }
    };

    const playVideo = async (rollType) => {
        if (!account) {
            alert("No account detected. Please connect to a wallet.");
            return;
        }
        if (!betAmount) {
            alert("Please input the correct bet amount.");
            return;
        }
        if (
            Number(betAmount) < Number(minBet) ||
            Number(betAmount) > Number(maxBet)
        ) {
            alert("Please input within range of bet amount.");
            return;
        }
        const { randomNum, currentDate, signature } = await fetchSignature();
        const betAmountInWei = _web3FTM.utils.toWei(betAmount, "ether");
        try {
            if (rollType == "under") {
                console.log("\nROLL UNDER\n");
                await rollUnder(
                    account,
                    diceGameInstance._address,
                    betAmountInWei,
                    randomNum,
                    currentDate,
                    signature
                );
            } else if (rollType == "over") {
                console.log("\nROLL OVER\n");
                await rollOver(
                    account,
                    diceGameInstance._address,
                    betAmountInWei,
                    randomNum,
                    currentDate,
                    signature
                );
            } else {
                console.log("Invalid roll type : ", rollType);
                return;
            }
            setRandomNumber(Number(randomNum));

            setTimeout(() => {
                videoRef.current.src = `/Images/${randomNum}.png`;
            }, 4400);

            // console.log("Play one ", randomNum);
            if (videoRef.current) {
                videoRef.current.src = `Images/${randomNum}.png`;
                videoRef.current.play();
                setBetAmount(0);
            }
            fetchWalletBalance();
            handleCounter();
        } catch (error) {
            console.log("Error playing video: ", error);
            setBetAmount(0);
            if (error.code === 4001) {
                console.error("Transaction rejected by user.");
            }
        }
    };

    useEffect(() => {
        const min = 1;
        const max = 6;
        const random = Math.floor(Math.random() * (max - min + 1)) + min;
        setRandomNumber(random);
        if (videoRef.current) {
            // videoRef.current.src = `/Animation/dice${random}.webm`;
            videoRef.current.src = "/Images/Dice.png";
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const minbet = await diceGameInstance.methods.minBetAmount().call();
            const minbetInEth = _web3FTM.utils.fromWei(minbet, "ether");
            const maxbet = await diceGameInstance.methods.maxBetAmount().call();
            const maxbetInEth = _web3FTM.utils.fromWei(maxbet, "ether");
            setMinBet(minbetInEth);
            setMaxBet(maxbetInEth);
            setStep((maxbetInEth - minbetInEth) / 10000);
        } catch (error) {
            console.error("An error occurred while fetching bet amounts:", error);
        }
    };

    const fetchWalletBalance = async () => {
        try {
            const balanceInWei = await _web3FTM.eth.getBalance(account);
            const balance = _web3FTM.utils.fromWei(balanceInWei, "ether");
            const formattedBnbBalance = parseFloat(balance).toFixed(4);
            const totalProfit = await diceGameInstance.methods.profit(account).call();
            const totalProfitInEth = _web3FTM.utils.fromWei(totalProfit, "ether");
            const totalRollUnder = await diceGameInstance.methods.rollUnderBids(account).call();
            const totalRollOver = await diceGameInstance.methods.rollOverBids(account).call();
            setWalletBalance(formattedBnbBalance);
            setTotalProfit(totalProfitInEth);
            setTotalRollUnderBids(Number(totalRollUnder));
            setTotalRollOverBids(Number(totalRollOver));
        } catch (e) {
            throw e;
        }
    };

    useEffect(() => {
        if (account) {
            fetchWalletBalance();
        } else {
            setWalletBalance(0);
            setTotalProfit(0);
            setTotalRollUnderBids(0);
            setTotalRollOverBids(0);
        }
    }, [account]);

    async function fetchSignature() {
        try {
            console.log("calling diceSignature API");
            const response = await axios.post("/api/diceSignature");
            return response.data;
        } catch (error) {
            console.error('There was an error fetching the signature:', error);
        }
    }

    return (
        <div className="dice-container">
            <h1 className="dice-title">DICE ROLL</h1>
            <div className="dice-info">
                <p>Wallet Balance: <span className="value">{walletBalance} FTM</span></p>
                <p>Min Bet: <span className="value">{minBet} FTM</span></p>
                <p>Max Bet: <span className="value">{maxBet} FTM</span></p>
            </div>
            <img ref={videoRef} className="dice-image" alt="Dice" />
            <div className="dice-actions">
                <div className="dice-action" onClick={() => playVideo("under")}>
                    <path fill="black" />
                    <p>ROLL UNDER</p>
                </div>
                <div className="dice-action" onClick={() => playVideo("over")}>
                    <path fill="black" />
                    <p>ROLL OVER</p>
                </div>
            </div>
            <div className="bet-amount-container">
                <p>Bet Amount</p>
                <input
                    type="number"
                    min={minBet}
                    max={maxBet}
                    step={step}
                    value={betAmount}
                    onChange={handleBetAmountChange}
                />
                <button onClick={handleMax}>MAX</button>
            </div>
            <div className="profit-container">
                <div className="profit-item">
                    <p>Expected Profit</p>
                    <input value={`${profit} FTM`} readOnly />
                </div>
                <div className="profit-item">
                    <p>Total Profit</p>
                    <input value={`${totalProfit} FTM`} readOnly />
                </div>
            </div>
            <div className="profit-container">
                <div className="profit-item">
                    <p>Total Roll Under Bids</p>
                    <input value={`${totalRollUnderBids} FTM`} readOnly />
                </div>
                <div className="profit-item">
                    <p>Total Roll Over Bids</p>
                    <input value={`${totalRollOverBids} FTM`} readOnly />
                </div>
            </div>
        </div>
    );

};

export default Dice;