import { motion } from 'framer-motion'
import { date_time, username } from '../utils/utils'
import TimeAgo from 'react-timeago'
import { FaEthereum } from 'react-icons/fa'
import { FiArrowUpRight } from 'react-icons/fi'

const Transaction = ({
  framerIndex,
  receiver,
  timeStamp,
  txAmount,
  txHash,
  loading,
}) => {
  return (
    <motion.div
      initial={{ x: 100 }}
      animate={{
        x: 0,
        transition: {
          duration: 0.2,
          delay: framerIndex * 0.1,
        },
      }}
      className={`mb-2 flex cursor-pointer items-center gap-x-1 rounded-lg bg-gray-900 
    px-4 py-2 transition-all ease-in-out hover:bg-gray-800 ${
      loading &&
      '!hover:bg-gray-800 h-10 w-[28rem] animate-pulse !cursor-default !bg-gray-800'
    }`}
    >
      {!loading && (
        <>
          <FaEthereum />
          <span>{txAmount}</span>
          <p>sent to</p>
          <span className="text-orange-400 hover:underline">
            {username(receiver)}
          </span>
          <span className="ml-3">•</span>
          <TimeAgo date={date_time(timeStamp)} />
          <div
            className="flex cursor-pointer items-center gap-x-1
       text-blue-600 transition-all ease-in-out hover:text-blue-500"
          >
            <img
              className="ml-4 mr-1 w-4 object-contain invert"
              src="etherscan.webp"
              alt="etherscan"
            />
            <a
              href={'https://sepolia.etherscan.io/tx/' + txHash}
              target="_blank"
            >
              View on Etherscan
            </a>
            <FiArrowUpRight />
          </div>
        </>
      )}
    </motion.div>
  )
}

export default Transaction
