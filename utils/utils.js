import { ethers } from 'ethers'
import axios from 'axios'
import uniswap from '../contracts_data/Uniswap-address.json'
import uniswapAbi from '../contracts_data/Uniswap.json'

export const toWei = (num) => ethers.utils.parseEther(num.toString())
export const toEth = (num) => ethers.utils.formatEther(num)

export const WETHAddress = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
export const RRMAddress = "0x1d3999858b8f589072944e55c31Af0F32cF8F7D1";

export const getContract = async (signer) => {
  const contract = new ethers.Contract(uniswap.address, uniswapAbi.abi, signer)
  return contract
}

const apiKey = "D56UARBKYISM7N1191ER9N39FQFXBYTSJI"; // Etherscan API key

// Function to fetch ABI from Etherscan
const fetchAbi = async (contractAddress) => {
  const url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === "1") {
      return JSON.parse(data.result);
    } else {
      throw new Error('Error fetching ABI: ' + data.result);
    }
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

export const setTransaction = async (contract, _tokenA, _tokenB, _amountA, _amountB, _receiver) => {
  const amountA = ethers.utils.parseEther(_amountA); // Assuming _amountA is in Ether
  const amountB = ethers.utils.parseEther(_amountB); // Assuming _amountB is in Ether

  const abi = await fetchAbi(_tokenA);
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const myTokenContract = new ethers.Contract(_tokenA, abi, provider.getSigner())
  const tx1 = await myTokenContract.approve(contract.address, amountA);
  const receipt = await tx1.wait(); // Wait for the transaction to be mined
  
  console.log("Approval transaction receipt:", receipt);

  const tx2 = await (
    await contract.performSwap(_tokenA, _tokenB, amountA, amountB, _receiver)
  ).wait()
}

export const getSwapAmount = async (contract, _tokenA, _tokenB, _amountA) => {
  const amountA = ethers.utils.parseEther(_amountA); // Assuming _amountA is in Ether
  const tokenBAmount = await contract.getMinOutputAmount(_tokenA, _tokenB, amountA);
  const tokenB18Amount = ethers.utils.formatEther(tokenBAmount);
  return tokenB18Amount;
}

export const username = (address) => {
  let temp1 = address.substring(0, 5)
  let temp2 = address.substring(address.length - 3)
  return temp1 + '...' + temp2
}

export const date_time = (unixTime) => {
  const date = new Date(unixTime * 1000)
  return date
}
