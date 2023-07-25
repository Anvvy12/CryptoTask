import BigNumber from "bignumber.js";
import axios from "axios";
import { Web3Provider } from "@ethersproject/providers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./contract";
import { ethers } from "ethers";

// Функція для перетворення рядка шестнадцяткового числа у десяткове з округленням до другого знака після коми
function convertHexToDecimal(hexValue) {
  const decimalValue = new BigNumber(hexValue).toString(10);
  const roundedValue = parseFloat(decimalValue);
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

// Функція для отримання ціни WBT у доларах
async function getEthPriceInUSD() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=whitebit&vs_currencies=usd"
    );
    const ethPriceInUSD = response.data.whitebit.usd;

    return ethPriceInUSD;
  } catch (error) {
    console.error("Помилка при отриманні ціни WBT:", error);
    return null;
  }
}

// const TransactionLink = (transactionHash) => {
//   const etherscanBaseUrl = `https://etherscan.io/tx/${transactionHash}`;

//   console.log(`etherscanBaseUrl`, etherscanBaseUrl);
// };

// TransactionLink(
//   "0xf6d4f689ee7dc9989855a00682e6ef02f90d06023bab16d63befc8a548442724"
// );

export { getEthPriceInUSD, connectToMetaMask };

// const provider = new Web3Provider(window.ethereum);
// const signer = provider.getSigner();

// const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

// async function getContractData() {
//   try {
//     const result = await contract.totalSupply();
//     console.log("Результат:", result);
//   } catch (error) {
//     console.error("Помилка:", error);
//   }
// }

// getContractData();
