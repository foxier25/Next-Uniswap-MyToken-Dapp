import { motion } from 'framer-motion'
import { IoMdClose } from 'react-icons/io'

const ErrorModel = ({ transactionFailed, selectedNetwork, closeModal }) => {
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
      className="absolute z-50 flex h-screen w-screen items-center backdrop-blur-sm"
    >
      <div
        onClick={() => transactionFailed && closeModal(false)}
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
        className="relative mx-auto max-w-lg rounded-lg bg-gradient-to-b from-[#251d27] to-[#161719] p-10 shadow-lg"
      >
        {transactionFailed && (
          <IoMdClose
            onClick={() => closeModal(false)}
            className="hover:bg-spotify absolute top-3 right-5 cursor-pointer rounded-full border-2 border-gray-300
    p-1 text-3xl text-gray-300 transition ease-out hover:text-black"
          />
        )}

        {selectedNetwork && (
          <div className="flex flex-col items-center">
            <img className="w-20 object-contain" src="eth.gif" alt="eth" />
            <h2 className="mt-5 w-2/3 animate-pulse text-center text-lg text-gray-100">
              Please change the network to ropsten testnet and refresh!
            </h2>
          </div>
        )}
        {transactionFailed && (
          <div className="flex flex-col items-center">
            <img className="w-20 object-contain" src="failed.gif" alt="eth" />
            <h2 className="mt-5 w-2/3 animate-pulse text-center text-lg text-gray-100">
              Transaction Failed!
            </h2>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default ErrorModel
