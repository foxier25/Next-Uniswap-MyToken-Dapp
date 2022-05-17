const Token = ({ logo, name, symbol, setToken, setTokenModal }) => {
  return (
    <div
      onClick={() => {
        setToken({ symbol, logo })
        setTokenModal(false)
      }}
      className="flex cursor-pointer items-center justify-between px-5 py-3 
    transition ease-in-out hover:bg-gray-800"
    >
      <div className="flex items-center gap-x-2">
        <img
          loading="lazy"
          className="w-10 object-contain"
          src={logo ? logo : '/uniswap.png'}
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = '/uniswap.png'
          }}
        />
        <div>
          <h2 className="font-medium">{name}</h2>
          <h5 className="text-xs text-gray-400">{symbol}</h5>
        </div>
      </div>
    </div>
  )
}

export default Token
