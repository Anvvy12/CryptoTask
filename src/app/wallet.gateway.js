import BigNumber from "bignumber.js";
import axios from "axios";
import { Web3Provider } from "@ethersproject/providers";
import { Contract, ethers } from "ethers";

const result = BigNumber(0.3).minus(0.1);
console.log(result.c / 10 ** 14);

async function connectToMetaMask() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();
      const balance = await provider.getBalance(walletAddress);
      const tokenBalance = ethers.formatEther(balance._hex);
      const blockNumber = await provider.getBlockNumber();
      console.log("blockNumber: ", blockNumber);

      try {
        const network = await provider.getNetwork();
        const networkAdres = network.ensAddress;
        const networkName = network.name;
        const abi = await fetchDataABI(networkAdres).then(
          (data) => data.result
        );
        const contract = new Contract(networkAdres, abi, provider);

        const block = await provider.getBlock();
        console.log("Block: ", block);
        console.log("networkName: ", networkName);
        console.log("contract: ", contract);
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
