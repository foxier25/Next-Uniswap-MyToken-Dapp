import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { BiEdit } from 'react-icons/bi'
import Token from './Token'
import data from '../MockAPI/uniswapData'
import trendingData from '../MockAPI/trendingData'

const TokenModal = ({ setTokenModal, setToken}) => {
  const [tokens, setTokens] = useState([])
  const [filteredTokens, setFilteredTokens] = useState(null)

  useEffect(() => {
    fetchTokens()
  }, [])

  const fetchTokens = async () => {
    // const req = await fetch('https://tokens.uniswap.org').then((res) =>
    //   res.json()
    // )
    // setTokens(req.tokens)
    setTokens(data)
  }

  const filterTokens = (searchText) => {
    if (!searchText) {
      setFilteredTokens(null)
      return
    }
    const filter = tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(searchText) ||
        token.symbol.includes(searchText)
    )
    setFilteredTokens(filter)
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.3,
        },
      }}
      exit={{
        opacity: 0,
      }}
      className="absolute z-40 flex h-screen w-screen items-center backdrop-blur-sm"
    >
      <div
        onClick={() => setTokenModal(false)}
        className="absolute h-screen w-screen"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          transition: {
            duration: 0.3,
          },
        }}
        exit={{
          scale: 0,
        }}
        className="relative mx-auto w-[30rem] max-w-lg space-y-2 rounded-xl bg-gray-900"
      >
        <div className="m-5 flex items-center justify-between">
          <h2 className="text-lg font-medium">Select a token</h2>
          <IoMdClose
            onClick={() => setTokenModal(false)}
            className="hover:bg-spotify cursor-pointer p-1 text-3xl 
            text-gray-300 transition ease-out hover:text-white"
          />
        </div>

        <div className="mx-5">
          <input
            autoFocus
            className="w-full rounded-xl border border-gray-700 bg-transparent 
          py-3 px-2 outline-none focus:border-blue-600"
            type="text"
            placeholder="Search name or paste address"
            onChange={(e) => {
              filterTokens(e.target.value)
            }}
          />
        </div>

        <div className="grid grid-cols-4 gap-x-2 gap-y-2 px-5 py-3">
          {trendingData.map(({ symbol, logoURI }, i) => (
            <div
              onClick={() => {
                logoURI ? setToken({ symbol, logo: logoURI }) : setToken({ symbol})
                setTokenModal(false)
              }}
              key={i}
              className="flex cursor-pointer items-center gap-x-2 rounded-xl 
            border border-gray-600 p-2 transition ease-in-out hover:bg-gray-800"
            >
              {logoURI && <img
                className="h-6 object-contain"
                src={logoURI}
                alt="trendingToken"
              />}
              <h3 className="font-medium">{symbol}</h3>
            </div>
          ))}
        </div>

        <div className="h-72 overflow-y-scroll border-t border-gray-800">
          {filteredTokens
            ? filteredTokens.map(({ logoURI, name, symbol }, i) => (
                <Token
                  logo={logoURI}
                  name={name}
                  symbol={symbol}
                  key={i}
                  setToken={setToken}
                  setTokenModal={setTokenModal}
                />
              ))
            : tokens.map(({ logoURI, name, symbol }, i) => (
                <Token
                  logo={logoURI}
                  name={name}
                  symbol={symbol}
                  key={i}
                  setToken={setToken}
                  setTokenModal={setTokenModal}
                />
              ))}
        </div>
        <div
          className="flex cursor-pointer items-center justify-center gap-x-2 rounded-b-xl 
        bg-gray-800 px-5 py-4 text-lg text-blue-500 hover:text-blue-400"
        >
          <BiEdit />
          <span>Manage Token Lists</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TokenModal
