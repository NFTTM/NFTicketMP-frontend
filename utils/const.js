import { ethers } from "ethers";
import abi from 'utils/contracts/abi.json'

const backendUrl = 'http://localhost:3000/'
// RPC URL -- replaced with bsctestnet
const goerliRpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const defaultProvider = new ethers.providers.JsonRpcProvider(goerliRpcUrl);
const defaultNetworkId = 97;

const contractAddress = '0xEB1cE6C7Ec3E9b0f0AA715586d91F708e15e2Db9'
const contractRead = new ethers.Contract(contractAddress, abi, defaultProvider)

const goerliChainConfig = [
  {
    chainId: '0x61',
    rpcUrls: [goerliRpcUrl,],
    chainName: 'BSCTestnet Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'BNB',
      decimals: 18,
    },
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
  },
]



export {
  backendUrl,
  contractAddress,
  contractRead,
  goerliRpcUrl,
  defaultProvider,
  defaultNetworkId,
  goerliChainConfig
}