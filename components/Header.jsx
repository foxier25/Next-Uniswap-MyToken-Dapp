import ConnectWallet from './ConnectWallet'

const Header = () => {
  return (
    <div className="fixed top-0 z-50 flex w-full items-center justify-between p-3 pr-7 md:py-5 md:pr-10">
      <div className="flex items-center space-x-3 lg:flex-grow lg:justify-end">
              <ConnectWallet />
      </div>
    </div>
  )
}

export default Header
