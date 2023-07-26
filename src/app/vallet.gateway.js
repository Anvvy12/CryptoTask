import BigNumber from "bignumber.js";
import axios from "axios";
import { Web3Provider } from "@ethersproject/providers";
import { Contract, ethers } from "ethers";

// Функція для перетворення рядка шестнадцяткового числа у десяткове
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
      const walletAddress = await signer.getAddress();
      const balance = await provider.getBalance(walletAddress);
      const tokenBalance = convertHexToDecimal(
        ethers.formatEther(balance._hex)
      );

      try {
        const network = await provider.getNetwork();
        const networkAdres = network.ensAddress;
        const abi = await fetchDataABI(networkAdres).then(
          (data) => data.result
        );
        const contract = new Contract(networkAdres, abi, provider);
        const contractName = contract;
        const networktName = network;

        const listAccounts = await provider.getBlock();
        console.log("listAccounts: ", listAccounts);
        console.log("networktName: ", networktName);
        console.log("contractName: ", contractName);
        console.log("networkAdres: ", networkAdres);
      } catch (error) {
        console.log("Error: ", error);
      }

      console.log("Підключено до MetaMask!");
      console.log("Адреса гаманця:", walletAddress);
      console.log("баланс hex гаманця:", balance._hex);
      console.log("Баланс гаманця:", tokenBalance);

      return { walletAddress, tokenBalance };
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

async function fetchDataABI(adress) {
  return await fetch(
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${adress}&apikey=1DVI5Q65BCXGSZ93JZ13GBIJB85QHIJ5V1`
  ).then((responce) => responce.json());
}
