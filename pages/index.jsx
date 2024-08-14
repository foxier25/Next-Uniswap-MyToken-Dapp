import '@web3modal/scaffold'
import { ethers } from 'ethers'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BsArrowDownShort } from 'react-icons/bs'
import { CgChevronDown } from 'react-icons/cg'
import ErrorModel from '../components/ErrorModel'
import Header from '../components/Header'
import TokenModal from '../components/TokenModal'
import {
  getContract,
  RRMAddress,
  setTransaction,
  getSwapAmount,
  WETHAddress
} from '../utils/utils'

const Home = () => {
  const [tokenModal, setTokenModal] = useState(false)
  const [isSwapToken, setIsSwapToken] = useState(false)
  const [tokenA, setTokenA] = useState(null)
  const [tokenB, setTokenB] = useState(null)
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)
  const [isSwapping, setIsSwapping] = useState(false)
  const [swapDetails, setSwapDetails] = useState({
    tokenAAmount: "0",
    tokenBAmount: "0",
    tokenAAddress: null,
    tokenBAddress: null,
    receiver: null,
  })
  const [alert, setAlert] = useState(false)

  useEffect(() => {
    web3Handler()
  }, [])

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
    setIsSwapping(true)
    let flag = true;
    if (tokenA.symbol == "RRM") {
      flag = false;
      setSwapDetails({...swapDetails, tokenAAddress: RRMAddress, tokenBAddress: WETHAddress});
    }
    else {
      setSwapDetails({ ...swapDetails, tokenAAddress: WETHAddress, tokenBAddress: RRMAddress});
    }
    console.log("info----   ",
      flag ? WETHAddress : RRMAddress,
      flag ? RRMAddress : WETHAddress,
      swapDetails.tokenAAmount,
      swapDetails.tokenBAmount,
      swapDetails.receiver);

    setTransaction(contract,
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
  }

  const callGetSwapAmount = async (e) => {
    if(e.target.value == null || e.target.value == "" || parseFloat(e.target.value, 10) == 0) {
      setSwapDetails({ ...swapDetails, tokenBAmount: "0", tokenAAmount: e.target.value })
      return
    }
    if(!(!tokenA || !tokenB || tokenA && tokenB && tokenA.symbol == tokenB.symbol || tokenA == tokenB)) {
      let flag = true;
      if (tokenA.symbol == "RRM") flag = false;
      const tokenBAmount = await getSwapAmount(contract,
        flag ? WETHAddress : RRMAddress,
        flag ? RRMAddress : WETHAddress,
        e.target.value
      );
      setSwapDetails({ ...swapDetails, tokenBAmount: tokenBAmount.toString(), tokenAAmount: e.target.value })
    }
  }

  return (
    <div
      className="h-min-screen flex h-screen max-h-screen w-screen select-none 
    flex-col justify-between bg-gradient-to-b from-[#2D242F] to-[#191b1f] text-white"
    >
      <main className="h-screen overflow-hidden p-3 md:p-5">
        <Header/>

        <div className="m-5 mx-auto mt-28 max-w-lg rounded-3xl bg-gray-900 p-3 md:mt-40">
          <div className="mb-3 ml-2 flex items-center justify-between text-lg font-medium">
            <span>Swap</span>
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
                step={0.00001}
                onChange={async (e) => {
                  callGetSwapAmount(e);
                }
                }
              />
              <div
                onClick={() => { setTokenModal(true); setIsSwapToken(true); }}
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
              className="absolute left-0 right-0 top-[37%] m-auto rounded-2xl border-4
              border-gray-900 bg-gray-800 p-1 text-4xl text-gray-500 transition ease-out"
            />
            <div
              className="border-1 flex items-center justify-between rounded-xl
          border  border-gray-900 bg-gray-800 py-4 px-2 hover:border-gray-700"
            >
              <input
                className="w-2/3 bg-transparent p-1 text-2xl font-bold outline-none text-gray-400"
                type="number"
                disabled
                placeholder="0.0"
                value={swapDetails.tokenBAmount}
                onChange={(e) =>
                  setSwapDetails({ ...swapDetails, tokenBAmount: e.target.value })
                }
              />
              <div
                onClick={() => { setTokenModal(true); setIsSwapToken(false); }}
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
          </form>
          {
            account ? (
              <button
                disabled={isSwapping || !tokenA || !tokenB || tokenA && tokenB && tokenA.symbol == tokenB.symbol || tokenA == tokenB}
                type="submit"
                onClick={(e) => performSwap(e)}
                className={`mt-2 flex w-full items-center justify-center gap-x-2 rounded-xl  bg-[#132b49] p-3
              font-medium text-[#3d84e9] transition ease-in-out ${!(isSwapping || !tokenA || !tokenB || tokenA && tokenB && tokenA.symbol == tokenB.symbol || tokenA == tokenB) && 'hover:bg-[#163152]'
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
      </main>

      <AnimatePresence>
        {tokenModal && (isSwapToken ?
          <TokenModal setTokenModal={setTokenModal} setToken={setTokenA} />
          : <TokenModal setTokenModal={setTokenModal} setToken={setTokenB} />
        )}
        {alert && <ErrorModel transactionFailed closeModal={setAlert} />}
        {/* {networkApproved && <ErrorModel selectedNetwork />} */}
      </AnimatePresence>
    </div>
  )
}

export default Home
