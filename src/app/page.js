"use client";
import React, { useEffect, useState } from "react";
import { getEthPriceInUSD, connectToMetaMask } from "./vallet.gateway";

function Home() {
  const [data, setData] = useState({
    address: "",
    tokenBalance: 0,
    price: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [ethPriceInUSD, accountData] = await Promise.all([
          getEthPriceInUSD(),
          connectToMetaMask(),
        ]);

        setData({
          address: accountData.address,
          tokenBalance: accountData.tokenBalance,
          price: ethPriceInUSD,
        });
      } catch (error) {
        console.error("Помилка при отриманні даних:", error);
      }
    }

    fetchData();
  }, []);

  const tokenValueInUSD = (data.tokenBalance * data.price).toFixed(2);

  return (
    <div>
      <h3>Адреса гаманця: {data.address}</h3>
      <p>Баланс Ether: {data.tokenBalance} ETH</p>
      <p>Вартість: ${tokenValueInUSD} USD</p>
    </div>
  );
}

export default Home;
