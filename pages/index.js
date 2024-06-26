import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [amount, setAmount] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account successfully connected:", account);
      setAccount(account);
    } else {
      console.log("No account detected");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('A MetaMask wallet is necessary to connect.');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    setAmount(Number(amount) < 0 ? 0 : Number(amount));
    if (atm) {
      let tx = await atm.deposit(amount);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    setAmount(Number(amount) < 0 ? 0 : Number(amount));
    if (atm) {
      let tx = await atm.withdraw(amount);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>To use this ATM, please install Metamask</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button className="connect-button" onClick={connectAccount}>Kindly link your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="atm">
        <p className="account-info">Account No.: {account}</p>
        <p className="balance-info">Current Balance: {balance} ETH</p>
        <form className="amount-form">
          <label>
            Enter ether amount you want to Withdraw / Deposit  :-
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
        </form>
        <button className="action-button" onClick={deposit}> Deposit Funds {amount} ETH </button>
        <button className="action-button" onClick={withdraw}> Withdraw Funds {amount} ETH </button>
      </div>
    );
  };

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Kirtan's Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: #2c3e50;
          color: #ecf0f1;
          font-family: 'Arial', sans-serif;
          padding: 50px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin: 30px auto;
          width: 80%;
          max-width: 600px;
        }
        header h1 {
          font-size: 2em;
          margin-bottom: 20px;
        }
        .atm {
          background-color: #34495e;
          padding: 20px;
          border-radius: 10px;
        }
        .account-info, .balance-info {
          margin: 10px 0;
          font-size: 1.2em;
        }
        .amount-form {
          margin: 20px 0;
        }
        .amount-form input {
          padding: 5px;
          margin-left: 10px;
          border-radius: 5px;
          border: none;
        }
        .action-button, .connect-button {
          padding: 10px 20px;
          margin: 10%;
          background-color: #1abc9c;
          color: white;
          border: none;
          border-radius: 10%;
          cursor: pointer;
          font-size: 2em;
        }
        .action-button:hover, .connect-button:hover {
          background-color: #16a085;
        }
      `}</style>
    </main>
  );
}
