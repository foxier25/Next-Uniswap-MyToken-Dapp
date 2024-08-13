
async function main() {
  const PRIVATE_KEY = "0x3011ee2293ad66d2790cd20c9740d1f2b859533b6e939365fa09962f13f02f06";
  // Connect to the Sepolia network with a private key
  const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/a5fa20d5b3e44dabb3df2c581fe3b2b5');
  const deployer = new ethers.Wallet(PRIVATE_KEY, provider);


  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', (await deployer.getBalance()).toString())

  // deploy contracts here:
  const uniswapFactory = await ethers.getContractFactory('UniswapInteraction', deployer)
  uniswapContract = await uniswapFactory.deploy()

  console.log('Smart contract address:', uniswapContract.address)

  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(uniswapContract, 'Uniswap')
}

function saveFrontendFiles(contract, name) {
  const fs = require('fs')
  const contractsDir = __dirname + '../../../contracts_data'

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir)
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  )

  const contractArtifact = artifacts.readArtifactSync(name)

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
