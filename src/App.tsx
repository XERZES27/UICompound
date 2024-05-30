import { ethers } from "ethers";

import "./App.css";
import { useEffect, useState } from "react";
import { contractAbi } from "./data/abi.jsx";

function App() {
  const mainAddress: string = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const contractAddress: string = "0x48B16b015F0495a637A18B133D18156524CF10cC";
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [collateral, setCollateral] = useState<bigint | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  // Similar to componentDidMount and componentDidUpdate:

  async function getCollateralBalance(_contract: ethers.Contract) {
    const collateralBalance =
      await _contract.getValueOfAllCollateralizedAssetsE8();
    setCollateral(collateralBalance);
  }

  async function getBalance(_provider: ethers.JsonRpcApiProvider){
    const _balance = await _provider.getBalance(mainAddress);
                setBalance(_balance);
  }

  useEffect(() => {
    const _provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const wallet = new ethers.Wallet(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      _provider
    );
    const _contract = new ethers.Contract(
      contractAddress,
      contractAbi.abi,
      wallet
    );
    setContract(() => _contract);
    getCollateralBalance(_contract);
    getBalance(_provider);
    setProvider(() => _provider);
  }, []);

  return (
    <>
      <div>
        <h1>Compound</h1>
        <div className="buttonLabel">
          
          {balance && (
            <h2>
              Balance :{" "}
              {(Number(balance) / 10 ** 18)?.toString()} ETH
            </h2>
          )}
          {provider && (
            <button
              onClick={async () => {
                getBalance(_provider);
              }}
            >
              Refresh
            </button>
          )}
        </div>

        <div className="buttonLabel">
            
            {collateral && (
              <h2>
                Collateral : {" "}
                {(Number(collateral) / Math.pow(10, 8)).toString()} USDC
              </h2>
            )}
            <button
              onClick={async () => {
                getCollateralBalance(contract);
              }}
            >
              Refresh
            </button>
            </div>

        {contract && (
          <div>
            <button
              onClick={async () => {

                const value = ethers.parseEther("2");
                const tx = await contract.supplyCollateralInNativeEth({
                  value: value,
                  gasLimit: 10000000,
                });
                console.log(tx);
                const receipt = await tx.wait();
                getCollateralBalance(contract);
              }}
            >
              Supply COMP
            </button>
            </div>
        )}
            
          
      </div>
    </>
  );
}

export default App;
