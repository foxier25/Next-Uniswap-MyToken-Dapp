import Head from 'next/head'
import Header from '../components/Header'
import { AiOutlineSetting } from 'react-icons/ai'
import { CgChevronDown } from 'react-icons/cg'
import { BsArrowDownShort } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import TokenModal from '../components/TokenModal'
import { ethers } from 'ethers'
import {
  getContract,
  getMyReceivers,
  getMyTransfers,
  setTransaction,
  WETHAddress,
  RRMAddress
} from '../utils/utils'
import Transaction from '../components/Transaction'
import ErrorModel from '../components/ErrorModel'

const Home = () => {
  const [tokenModal, setTokenModal] = useState(false)
  const [isSwapToken, setIsSwapToken] = useState(false)
  const [tokenA, setTokenA] = useState(null)
  const [tokenB, setTokenB] = useState(null)
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)
  const [transfers, setTransfers] = useState(null)
  const [receivers, setReceivers] = useState(null)
  const [isSwapping, setIsSwapping] = useState(false)
  const [swapDetails, setSwapDetails] = useState({
    tokenAAmount: null,
    tokenBAmount: null,
    tokenAAddress: null,
    tokenBAddress: null,
    receiver: null,
  })
  const [networkApproved, setNetworkApproved] = useState(false)
  const [alert, setAlert] = useState(false)

  // useEffect(() => {
  //   web3Handler()
  // }, [])

  // useEffect(async () => {
  //   contract && setTransfers(await getMyTransfers(contract))
  //   contract && setReceivers(await getMyReceivers(contract))
  // }, [contract])

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    setAccount(accounts[0])
    setSwapDetails({ ...swapDetails, receiver: accounts[0] });
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const { chainId } = await provider.getNetwork()
    console.log("wallet connected!");
    if (chainId == 11155111) {
      const signer = provider.getSigner()
      setContract(await getContract(signer))
    } else {
      setNetworkApproved(true)
    }
  }

  const performSwap = async (e) => {
    e.preventDefault()
    // if (swapDetails.tokenAAmount && swapDetails.account) return
    // if (swapDetails.tokenAAmount <= 0) return
    // if (swapDetails.account == account) return
    // if (!ethers.utils.isAddress(swapDetails.address)) return
    setIsSwapping(true)
    let flag = true;
    if(tokenA.symbol == "RRM") {
      flag = false;
      await setSwapDetails({ ...swapDetails, tokenAAddress: RRMAddress, tokenBAddress: WETHAddress }), console.log("--RRM");
    }
    else {
      await setSwapDetails({ ...swapDetails, tokenAAddress: WETHAddress, tokenBAddress: RRMAddress }), console.log("--ETH");
    }

    // console.log("info----   ",swapDetails.tokenAAddress, swapDetails.tokenBAddress, swapDetails.tokenAAmount, swapDetails.tokenBAmount, swapDetails.receiver);
    console.log("info----   ", flag ? WETHAddress : RRMAddress, flag ? RRMAddress : WETHAddress, swapDetails.tokenAAmount, swapDetails.tokenBAmount, swapDetails.receiver);
    // await setTransaction(contract, swapDetails.tokenAAddress, swapDetails.tokenBAddress, swapDetails.tokenAAmount, swapDetails.tokenBAmount, swapDetails.receiver)
    await setTransaction(contract, 
      flag ? WETHAddress : RRMAddress, 
      flag ? RRMAddress : WETHAddress, 
      swapDetails.tokenAAmount, 
      swapDetails.tokenBAmount, 
      swapDetails.receiver)  
    .then(() => {
        setIsSwapping(false)
        setSwapDetails({
          tokenAAmount: null,
          address: null,
        })
      })
      .catch((error) => {
        console.log(error);
        setIsSwapping(false)
        setAlert(true)
      })
    // setTransfers(await getMyTransfers(contract))
  }

  return (
    <div
      className="h-min-screen flex h-screen max-h-screen w-screen select-none 
    flex-col justify-between bg-gradient-to-b from-[#2D242F] to-[#191b1f] text-white"
    >
      <main className="h-screen overflow-hidden p-3 md:p-5">
        <Header account={account} />
     
        <div className="m-5 mx-auto mt-28 max-w-lg rounded-3xl bg-gray-900 p-3 md:mt-40">
          <div className="mb-3 ml-2 flex items-center justify-between text-lg font-medium">
            <span>Swap</span>
            {/* <AiOutlineSetting className="mr-2 cursor-pointer text-xl hover:text-gray-300" /> */}
          </div>

          <form className="relative">
            <div
              className="border-1 flex items-center justify-between rounded-xl
          border  border-gray-900 bg-gray-800 py-4 px-2 hover:border-gray-700"
            >
              <input
                className="w-2/3 bg-transparent p-1 text-2xl font-bold outline-none"
                type="number"
                placeholder="0.0"
                step={0.001}
                onChange={(e) =>
                  setSwapDetails({ ...swapDetails, tokenAAmount: e.target.value })
                }
              />
              <div
                onClick={() => {setTokenModal(true); setIsSwapToken(true);}}
                className="flex cursor-pointer items-center gap-x-2 rounded-2xl bg-gray-700 
            px-3 py-2 font-medium transition ease-in-out hover:bg-gray-600"
              >
                {
                (tokenA && tokenA.logo) && <img
                className="h-6 object-contain"
                src={tokenA ? tokenA.logo : '/eth.png'}
                alt="eth"
              />
                }
                {tokenA ? <p>{tokenA.symbol}</p> : <p>---</p>}
                <CgChevronDown />
              </div>
            </div>

            <BsArrowDownShort
              className="absolute left-0 right-0 top-[27%] m-auto cursor-pointer rounded-2xl border-4
              border-gray-900 bg-gray-800 p-1 text-4xl
          text-gray-500 transition ease-out hover:bg-gray-700 hover:text-gray-300"
            />
            <div
              className="border-1 flex items-center justify-between rounded-xl
          border  border-gray-900 bg-gray-800 py-4 px-2 hover:border-gray-700"
            >
              <input
                className="w-2/3 bg-transparent p-1 text-2xl font-bold outline-none"
                type="number"
                placeholder="0.0"
                step={0.001}
                onChange={(e) =>
                  setSwapDetails({ ...swapDetails, tokenBAmount: e.target.value })
                }
              />
              <div
                onClick={() => {setTokenModal(true); setIsSwapToken(false);}}
                className="flex cursor-pointer items-center gap-x-2 rounded-2xl bg-gray-700 
            px-3 py-2 font-medium transition ease-in-out hover:bg-gray-600"
              >
                {
                (tokenB && tokenB.logo) && <img
                  className="h-6 object-contain"
                  src={tokenB ? tokenB.logo : '/eth.png'}
                  alt="eth"
                />
                }
                {tokenB ? <p>{tokenB.symbol}</p> : <p>---</p>}
                <CgChevronDown />
              </div>
            </div>
            {/* <div
              className="border-1 mt-1 flex items-center justify-between rounded-xl
          border  border-gray-900 bg-gray-800 py-4 px-2 hover:border-gray-700"
            >
              <input
                className="w-full bg-transparent p-1 text-lg text-gray-200 
                outline-none placeholder:text-lg"
                type="text"
                placeholder="Address"
                onChange={(e) =>
                  setSwapDetails({ ...swapDetails, address: e.target.value })
                }
              />
            </div> */}


          </form>
          {
            account ? (
              <button
                disabled={isSwapping || !tokenA || !tokenB || tokenA && tokenB && tokenA.symbol == tokenB.symbol}
                type="submit"
                // onClick={(e) => performSwap(e)}
                className={`mt-2 flex w-full items-center justify-center gap-x-2 rounded-xl  bg-[#132b49] p-3
              font-medium text-[#3d84e9] transition ease-in-out ${
                !(isSwapping || !tokenA || !tokenB || tokenA && tokenB && tokenA.symbol == tokenB.symbol || tokenA == tokenB) && 'hover:bg-[#163152]'
              }`}
              >
                {isSwapping ? (
                  <>
                    <img
                      className="w-10 object-contain"
                      src="unicorn.gif"
                      alt="loader"
                    />
                    <span>Swapping</span>
                  </>
                ) : (
                  <span>Swap Now</span>
                )}
              </button>
            ) : (
              <button
                className="mt-2 w-full rounded-xl bg-[#132b49]  p-3 font-medium
              text-[#3d84e9] transition ease-in-out hover:bg-[#163152]"
              onClick={() => web3Handler()}
              >
                Connect Wallet
              </button>
            )}
        </div>

        {/* <div className="fixed bottom-10 right-10">
          {transfers
            ? [...transfers]
                .reverse()
                .slice(0, 3)
                .map(
                  (
                    { id, receiver, timeStamp, txAmount, txHash },
                    framerIndex
                  ) => (
                    <Transaction
                      key={id}
                      framerIndex={framerIndex}
                      receiver={receiver}
                      timeStamp={timeStamp}
                      txAmount={txAmount}
                      txHash={txHash}
                    />
                  )
                )
            : Array.from(Array(3)).map((_, framerIndex) => (
                <Transaction
                  key={framerIndex}
                  framerIndex={framerIndex}
                  loading
                />
              ))}
        </div> */}
      </main>

      <AnimatePresence>
        {tokenModal && ( isSwapToken ?
          <TokenModal setTokenModal={setTokenModal} setToken={setTokenA} />
          :<TokenModal setTokenModal={setTokenModal} setToken={setTokenB} />
        )}
        {alert && <ErrorModel transactionFailed closeModal={setAlert} />}
        {/* {networkApproved && <ErrorModel selectedNetwork />} */}
      </AnimatePresence>
    </div>
  )
}

export default Home
