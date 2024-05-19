"use client"
import Web3Context from "../../context/Web3Context";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import Header from "@/components/Header/Header";
import Dice from './dice/Dice';
import { useState } from "react";

const AutoConnectWrapper = ({ children }) => {
  const autoConnect = useAutoRefresh();
  return <>{children}</>;
}

export default function Home() {
  const [counter, setCounter] = useState(0);
  const handleCounter = () => {
    setCounter(counter + 1);
  };

  return (
    <Web3Context>
      <AutoConnectWrapper>
        <div className="main">
          <Header />
          <Dice handleCounter={handleCounter} ></Dice>
        </div>
      </AutoConnectWrapper>
    </Web3Context>
  );
}
