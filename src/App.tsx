import {ethers} from 'ethers';

import './App.css'
import { useEffect, useState } from 'react';
import {contractAbi} from './data/abi.jsx';

function App() {
  const mainAddress:string = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  const contractAddress:string = '0xfd822abeca70bb5560e22cec21738bb3db802a94';
  const [provider, setProvider] = useState<ethers.JsonRpcProvider|null>(null);
  const [balance,setBalance] = useState<bigint|null>(null);
  const [collateral,setCollateral] = useState<bigint|null>(null);
  const [contract,setContract] = useState<ethers.Contract|null>(null);
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    const _provider = new ethers.JsonRpcProvider('http://localhost:8545');
    const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', _provider);
    // _provider.getSigner().then((signer:ethers.JsonRpcSigner)=>{
      const _contract = new ethers.Contract(contractAddress, contractAbi.abi, wallet);
    setContract(()=>_contract);

    // });
    
    setProvider(()=>_provider);
   
  },[]);
  
  return (
    <>
      <div>
        <h1>Ether.js</h1>
       <div className='balance'>
       {provider && <button
        onClick={async () => {
          const _balance = await provider!.getBalance(mainAddress);
          setBalance(_balance);
          }}
        >Get Balance</button>}
        {balance && <h2>Balance of current account: {(Number(balance)/(10**18))?.toString()}</h2>}
       </div>


       {
        contract &&
        <div className='supply'>
        <button
        
          onClick={async()=>{
          //   const payment = {
          //     value: ethers.parseEther('1'),
          //     gasLimit: 3000000, 
          // };
            // await contract.supplyCollateral(payment);

            


            const value = ethers.parseEther('1');
            const tx = await contract.supplyCollateral({ value: value,gasLimit:10000000 });
            const receipt = await tx.wait();
            console.log('Transaction hash:', receipt.hash);
            
            const collateralBalance = await contract.getValueOfAllCollateralizedAssetsE8({gasLimit:1000000 });
            setCollateral(collateralBalance);
            


          }}
        >
          Supply COMP
          
        </button>
        {collateral && <h2>Collateral of current account: {collateral.toString()}</h2>}
        
       </div>}
      </div>
      
    </>
  )
}

export default App
