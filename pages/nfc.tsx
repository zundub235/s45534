import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import erc721Abii from '../abi/erc721.json'
import Web3 from 'web3'

const address = '0x6a5ff3ceecae9ceb96e6ac6c76b82af8b39f0eb3'

const francesco = '0xC48A2afC7568742262E7d820bA9f47c3c071c7d4'
const nftId = '3885'

export default () => {
  const context = useWeb3React<Web3>()
  const { library, account } = context

  const transfer = async () => {
    if (library) {
      console.log(library)
      const contract = new library.eth.Contract(erc721Abii, address)

      await contract.methods.approve(francesco, nftId)
      await contract.methods.safeTransferFrom(account, francesco, nftId)
    }
  }

  return (
    <>
      <button onClick={() => transfer()} />
    </>
  )
}
