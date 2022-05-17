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
} from '../utils/utils'
import Transaction from '../components/Transaction'
import ErrorModel from '../components/ErrorModel'

const Home = () => {
  const [tokenModal, setTokenModal] = useState(false)
  const [token, setToken] = useState(null)
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)
  const [transfers, setTransfers] = useState(null)
  const [receivers, setReceivers] = useState(null)
  const [isSwapping, setIsSwapping] = useState(false)
  const [swapDetails, setSwapDetails] = useState({
    price: null,
    address: null,
  })
  const [networkApproved, setNetworkApproved] = useState(false)
  const [alert, setAlert] = useState(false)

  useEffect(() => {
    web3Handler()
  }, [])

  useEffect(async () => {
    contract && setTransfers(await getMyTransfers(contract))
    contract && setReceivers(await getMyReceivers(contract))
  }, [contract])

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    setAccount(accounts[0])
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const { chainId } = await provider.getNetwork()

    if (chainId == 3) {
      const signer = provider.getSigner()
      setContract(await getContract(signer))
    } else {
      setNetworkApproved(true)
    }
  }

  const sendEth = async (e) => {
    e.preventDefault()
    if (swapDetails.price && swapDetails.account) return
    if (swapDetails.price <= 0) return
    if (swapDetails.account == account) return
    if (!ethers.utils.isAddress(swapDetails.address)) return
    setIsSwapping(true)
    await setTransaction(contract, swapDetails.address, swapDetails.price)
      .then(() => {
        setIsSwapping(false)
        setSwapDetails({
          price: null,
          address: null,
        })
      })
      .catch((error) => {
        setIsSwapping(false)
        setAlert(true)
      })
    setTransfers(await getMyTransfers(contract))
  }

  return (
    <div
      className="h-min-screen flex h-screen max-h-screen w-screen select-none 
    flex-col justify-between bg-gradient-to-b from-[#2D242F] to-[#191b1f] text-white"
    >
      <Head>
        <title>Uniswap 1.0</title>
        <link rel="icon" href="/uniswap1.png" />
      </Head>

      <main className="h-screen overflow-hidden p-3 md:p-5">
        <Header account={account} />
        <div className="m-5 mx-auto mt-28 max-w-lg rounded-3xl bg-gray-900 p-3 md:mt-40">
          <div className="mb-3 ml-2 flex items-center justify-between text-lg font-medium">
            <span>Swap</span>
            <AiOutlineSetting className="mr-2 cursor-pointer text-xl hover:text-gray-300" />
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
                  setSwapDetails({ ...swapDetails, price: e.target.value })
                }
              />
              <div
                onClick={() => setTokenModal(true)}
                className="flex cursor-pointer items-center gap-x-2 rounded-2xl bg-gray-700 
            px-3 py-2 font-medium transition ease-in-out hover:bg-gray-600"
              >
                <img
                  className="h-6 object-contain"
                  src={token ? token.logo : '/eth.png'}
                  alt="eth"
                />
                {token ? <p>{token.symbol}</p> : <p>Eth</p>}
                <CgChevronDown />
              </div>
            </div>

            <BsArrowDownShort
              className="absolute left-0 right-0 top-[27%] m-auto cursor-pointer rounded-2xl border-4
              border-gray-900 bg-gray-800 p-1 text-4xl
          text-gray-500 transition ease-out hover:bg-gray-700 hover:text-gray-300"
            />

            <div
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
            </div>

            {account ? (
              <button
                disabled={isSwapping}
                type="submit"
                onClick={(e) => sendEth(e)}
                className={`mt-2 flex w-full items-center justify-center gap-x-2 rounded-xl  bg-[#132b49] p-3
              font-medium text-[#3d84e9] transition ease-in-out ${
                !isSwapping && 'hover:bg-[#163152]'
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
              >
                Connect Wallet
              </button>
            )}
          </form>
        </div>

        <div className="fixed bottom-10 right-10">
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
        </div>
      </main>

      <AnimatePresence>
        {tokenModal && (
          <TokenModal setTokenModal={setTokenModal} setToken={setToken} />
        )}
        {alert && <ErrorModel transactionFailed closeModal={setAlert} />}
        {networkApproved && <ErrorModel selectedNetwork />}
      </AnimatePresence>
    </div>
  )
}

export default Home
