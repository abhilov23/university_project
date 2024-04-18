import { ethers } from './ethers.js';
import { contractAddress, abi } from "./constrants.js";

const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;

const fund1 = document.getElementById("fund");
fund1.onclick = fund

const balanceButton = document.getElementById("balanceButton");
balanceButton.onclick = getBalance;

const withdrawButton = document.getElementById("withdrawButton");
withdrawButton.onclick = withdraw;

const contractbalance1 = document.getElementById("ctbalancebtn");
contractbalance1.onclick = contractBalance2;

async function connect() {
    //this is the connect function
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      document.getElementById("connectButton").innerHTML = "Connected";
    } else {
      document.getElementById("connectButton").innerHTML =
        "Please Install metamask";
    }
  }

  async function fund(){
    const ethAmount = document.getElementById("ethAmount").value;
  console.log(`fund me with  ${ethAmount} ETH`);
  if (typeof window.ethereum !== "undefined") {
    //provider / connection to the blockchain
    //signer / wallet /someone with some gas
    //contract that we are interacting with
    // ^ ABI / Address
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner(); //this will return which ever wallet is connected with the provider
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.deposit({
        value: ethers.utils.parseEther(ethAmount),
      });
      //listen for the tx to be mined
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  } 
  }

  async function listenForTransactionMine(transactionResponse, provider) {
    console.log(`mining ${transactionResponse.hash}.........`);
    //listen for this transaction to finish
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `completed with ${transactionReceipt.confirmations} confirmations`
        );
        resolve();
      });
    });
  }

  //shows the balance of contract
  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(contractAddress);
      let balance1 = ethers.utils.formatEther(balance);
      document.getElementById("representBalance").innerHTML = balance1;
    }
  }
 
  //withdraw function
  async function withdraw() {
    const ethAmount = document.getElementById("withdrawin").value;
    const param1Value = ethers.utils.parseUnits(ethAmount, "ether");
    if (typeof window.ethereum !== "undefined") {
      console.log("withdrawing......")
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(); //this will return which ever wallet is connected with the provider
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try{
       const transactionResponse = await contract.withdraw(param1Value);
       await listenForTransactionMine(transactionResponse, provider)
      } catch (err) {
          console.log(err);
      }
    }
  }
  
  // async function contractBalance2(){
  // // if (typeof window.ethereum !== "undefined") {
  // //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  // //   const balance = await provider.contractBalance();
  // //   let balance1 = ethers.utils.formatEther(balance);
  // //   document.getElementById("contractBalance").innerHTML = balance1;
  // // }
  // // if (typeof window.ethereum !== "undefined") {
  // //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  // //   const balance = await provider.contractBalance(contractAddress);
  // //   let balance1 = ethers.utils.formatEther(balance);
  // //   document.getElementById("representBalance").innerHTML = balance1;
  // // }
  // }