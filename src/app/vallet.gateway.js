import BigNumber from "bignumber.js";
import axios from "axios";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

// Функція для перетворення рядка шестнадцяткового числа у десяткове з округленням до другого знака після коми
function convertHexToDecimal(hexValue) {
  const decimalValue = new BigNumber(hexValue).toString(10);
  const roundedValue = parseFloat(decimalValue).toFixed(2);
  return roundedValue;
}

async function connectToMetaMask() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const tokenBalance = convertHexToDecimal(
        ethers.formatEther(balance._hex)
      );

      console.log("Підключено до MetaMask!");
      console.log("Адреса гаманця:", address);
      console.log("баланс hex гаманця:", balance._hex);
      console.log("Баланс гаманця:", tokenBalance);

      return { address, tokenBalance };
    } catch (error) {
      console.error("Помилка підключення до MetaMask:", error);
    }
  } else {
    console.error("Гаманець MetaMask не знайдено у браузері");
  }
}

// Функція для отримання ціни ETH у доларах
async function getEthPriceInUSD() {
  try {
    const response = await axios.get(
      "https://whitebit.com/api/v1/public/tickers"
    );
    const ethPriceInUSD = response.result.WBT_USD;

    return ethPriceInUSD;
  } catch (error) {
    console.error("Помилка при отриманні ціни ETH:", error);
    return null;
  }
}

export { getEthPriceInUSD, connectToMetaMask };
