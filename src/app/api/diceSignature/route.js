import Web3 from 'web3';
import { NextResponse } from "next/server";

export async function POST(request) {
    console.log("in API")
    const _web3 = new Web3(process.env.NEXT_PUBLIC_FANTOM_RPC);
    const currentDate = Date.now();
    const randomNum = Math.floor(Math.random() * 6) + 1;
    const message = _web3.utils
        .soliditySha3(
            { t: "uint256", v: randomNum },
            { t: "uint256", v: currentDate }
        )
        .toString("hex");

    const signature = _web3.eth.accounts.sign(
        message,
        process.env.NEXT_PUBLIC_DICE_PRIVATE_KEY
    );
    return NextResponse.json({ randomNum, currentDate, signature: signature.signature });
} 
