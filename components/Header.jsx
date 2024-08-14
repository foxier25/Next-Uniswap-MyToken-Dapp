import { FiArrowUpRight } from 'react-icons/fi'
import { CgChevronDown } from 'react-icons/cg'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { username } from '../utils/utils'
import Connect from '../components/Connect'

const Header = ({ account }) => {
  return (
    <div className="fixed top-0 z-50 flex w-full items-center justify-between p-3 pr-7 md:py-5 md:pr-10">
      <div className="flex items-center space-x-3 lg:flex-grow lg:justify-end">
              <Connect />
      </div>
    </div>
  )
}

export default Header
