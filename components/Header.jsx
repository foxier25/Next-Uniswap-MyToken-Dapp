import { FiArrowUpRight } from 'react-icons/fi'
import { CgChevronDown } from 'react-icons/cg'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { username } from '../utils/utils'

const Header = ({ account }) => {
  return (
    <div className="fixed top-0 z-50 flex w-full items-center justify-between p-3 pr-7 md:py-5 md:pr-10">
      <img
        className="mr-10 mb-2 h-12 object-contain"
        src="/uniswap1.png"
        alt="logo"
      />

      <div className="hidden items-center rounded-xl bg-gray-900 p-1 md:flex">
        <div className="headerItem bg-gray-800 font-bold text-white">Swap</div>
        <div className="headerItem">Pool</div>
        <div className="headerItem">Vote</div>
        <div className="headerItem">
          <span>Charts</span>
          <FiArrowUpRight />
        </div>
      </div>

      <div className="flex items-center space-x-3 lg:flex-grow lg:justify-end">
        <div className="hidden items-center gap-x-2 rounded-xl bg-gray-900 p-3 font-medium md:flex">
          <img className="h-6 object-contain" src="/eth.png" alt="eth" />
          <p>Ethereum</p>
          <CgChevronDown />
        </div>

        {account ? (
          <div
            className="border-1 group flex cursor-pointer items-center gap-x-2 rounded-xl border border-gray-900
            bg-[#132b49] p-3 font-medium text-[#3d84e9] transition ease-in-out hover:border-gray-700 hover:bg-[#123156]"
          >
            <Jazzicon diameter={25} seed={jsNumberForAddress(account)} />
            <span className="transition ease-in-out group-hover:text-blue-400">
              {username(account)}
            </span>
          </div>
        ) : (
          <button
            className="border-1 rounded-xl border border-gray-900 
        bg-[#132b49] p-3 font-medium text-[#3d84e9] hover:border-gray-700"
          >
            Connect Wallet
          </button>
        )}

        <HiOutlineDotsVertical
          className="border-1 hidden rotate-90 cursor-pointer rounded-xl border-gray-700 bg-gray-900 p-3
        text-5xl hover:border md:inline"
        />
      </div>
    </div>
  )
}

export default Header
