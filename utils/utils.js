import { ethers } from 'ethers'
import uniswap from '../contracts_data/Uniswap-address.json'
import uniswapAbi from '../contracts_data/Uniswap.json'

export const toWei = (num) => ethers.utils.parseEther(num.toString())
export const toEth = (num) => ethers.utils.formatEther(num)

export const getContract = async (signer) => {
  const contract = new ethers.Contract(uniswap.address, uniswapAbi.abi, signer)
  return contract
}

export const getMyTransfers = async (contract) => {
  const transfers = await contract.getTransfers()
  let temp = []
  for (let i = 0; i < transfers.length; i++) {
    let obj = {
      id: ethers.BigNumber.from(transfers[i].id).toNumber(),
      receiver: transfers[i].receiver,
      sender: transfers[i].sender,
      timeStamp: ethers.BigNumber.from(transfers[i].timeStamp).toNumber(),
      txHash: transfers[i].txHash,
      txAmount: toEth(ethers.BigNumber.from(transfers[i].txAmount)),
    }
    temp.push(obj)
  }
  return temp
}

export const getMyReceivers = async (contract) => {
  const transfers = await contract.getReceivers()
  let temp = []
  for (let i = 0; i < transfers.length; i++) {
    let obj = {
      id: ethers.BigNumber.from(transfers[i].id).toNumber(),
      receiver: transfers[i].receiver,
      sender: transfers[i].sender,
      timeStamp: ethers.BigNumber.from(transfers[i].timeStamp).toNumber(),
      txHash: transfers[i].txHash,
      txAmount: toEth(ethers.BigNumber.from(transfers[i].txAmount)),
    }
    temp.push(obj)
  }
  return temp
}

export const setTransaction = async (contract, _receiver, _amount) => {
  const tx = await (
    await contract.sendEth(_receiver, { value: toWei(_amount) })
  ).wait()
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
