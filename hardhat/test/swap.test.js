const { expect } = require('chai')

const toWei = (num) => ethers.utils.parseEther(num.toString())
const toEth = (num) => ethers.utils.formatEther(num)

describe('Uniswap', () => {
  let uniswapContract
  let deployer, sender, receiver, user, users

  before(async () => {
    // Get the ContractFactory and Signers here.
    const uniswapContractFactory = await ethers.getContractFactory('Uniswap')
    ;[deployer, sender, receiver, user, ...users] = await ethers.getSigners()

    // Deploy contract
    uniswapContract = await uniswapContractFactory.deploy()
  })

  describe('Deployment', () => {
    it('name verification', async () => {
      const name = 'Uniswap'
      const symbol = 'UniswapDAPP'
      expect(await uniswapContract.name()).to.equal(name)
      expect(await uniswapContract.symbol()).to.equal(symbol)
    })
  })

  describe('Transaction', () => {
    it('swapping', async () => {
      const senderInitialEthBal = await sender.getBalance()
      const receiverInitialEthBal = await receiver.getBalance()

      await expect(
        uniswapContract
          .connect(sender)
          .sendEth(receiver.address, { value: toWei(2) })
      )
        .to.emit(uniswapContract, 'SendEth')
        .withArgs(sender.address, receiver.address, toWei(2))
        .to.emit(uniswapContract, 'SaveTransaction')
        .withArgs(
          0,
          sender.address,
          receiver.address,
          toWei(2),
          '0x0000000000000000000000000000000000000000000000000000000000000000'
        )

      const senderFinalEthBal = await sender.getBalance()
      const receiverFinalEthBal = await receiver.getBalance()

      expect(+toEth(receiverFinalEthBal)).to.equal(
        +toEth(receiverInitialEthBal) + +2
      )
      expect(+toEth(senderInitialEthBal)).to.greaterThan(
        +toEth(senderFinalEthBal) + +2
      )
    })

    it('transaction saved', async () => {
      const transaction = await uniswapContract.connect(sender).getTransfers()
      expect(transaction[0].id).to.equal(0)
      expect(transaction[0].sender).to.equal(sender.address)
      expect(transaction[0].receiver).to.equal(receiver.address)
      expect(transaction[0].txAmount).to.equal(toWei(2))
      expect(transaction[0].txHash).to.equal(
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      )
    })
  })

  describe('Getter Methods', () => {
    it('get my transfers', async () => {
      await uniswapContract
        .connect(sender)
        .sendEth(receiver.address, { value: toWei(4) })
      await uniswapContract
        .connect(deployer)
        .sendEth(receiver.address, { value: toWei(8) })

      const senderTransactions = await uniswapContract
        .connect(sender)
        .getTransfers()
      const deployerTransactions = await uniswapContract
        .connect(deployer)
        .getTransfers()
      const userTransactions = await uniswapContract
        .connect(user)
        .getTransfers()

      expect(senderTransactions.length).to.equal(2)
      expect(deployerTransactions.length).to.equal(1)
      expect(userTransactions.length).to.equal(0)
    })

    it('get my receivers', async () => {
      const senderReceivers = await uniswapContract
        .connect(sender)
        .getReceivers()
      const deployerReceivers = await uniswapContract
        .connect(deployer)
        .getReceivers()
      const receiverReceivers = await uniswapContract
        .connect(receiver)
        .getReceivers()

      expect(senderReceivers.length).to.equal(0)
      expect(deployerReceivers.length).to.equal(0)
      expect(receiverReceivers.length).to.equal(3)
    })
  })
})
