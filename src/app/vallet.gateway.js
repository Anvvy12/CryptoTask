import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import axios from "axios";
import { Web3Provider } from "@ethersproject/providers";

// Функція для перетворення рядка шестнадцяткового числа у десяткове з округленням до другого знака після коми
function convertHexToDecimal(hexValue) {
  const decimalValue = new BigNumber(hexValue).toString(10);
  const roundedValue = parseFloat(decimalValue).toFixed(2);
  return roundedValue;
}

// Функція для підключення до гаманця MetaMask та отримання інформації про баланс
async function connectToMetaMask() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const tokenBalance = convertHexToDecimal(balance._hex);

      console.log("Підключено до MetaMask!");
      console.log("Адреса гаманця:", address);
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
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const ethPriceInUSD = response.data.ethereum.usd;

    return ethPriceInUSD;
  } catch (error) {
    console.error("Помилка при отриманні ціни ETH:", error);
    return null;
  }
}

export { getEthPriceInUSD, connectToMetaMask };
