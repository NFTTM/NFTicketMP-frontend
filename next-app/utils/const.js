import { ethers } from "ethers";
import abi from 'utils/contracts/abi.json'

// RPC URL
const goerliRpcUrl = 'https://goerli.infura.io/v3/61d668eca81642b89bedc402376a951a';
const defaultProvider = new ethers.providers.JsonRpcProvider(goerliRpcUrl);
const defaultNetworkId = 5;

const contractAddress = '0x38e07a39846F535C641486Eb2B22d45AAD83E25f'
const contractRead = new ethers.Contract(contractAddress, abi, defaultProvider)


const goerliChainConfig = [
  {
    chainId: '0x5',
    rpcUrls: [goerliRpcUrl,],
    chainName: 'Goerli Testnet',
    nativeCurrency: {
      name: 'GETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
  },
]



export {
  contractAddress,
  contractRead,
  goerliRpcUrl,
  defaultProvider,
  defaultNetworkId,
  goerliChainConfig
}