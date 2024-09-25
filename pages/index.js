import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [ethSpent, setEthSpent] = useState(0);
  const [myTickets, setMyTickets] = useState(0);
  const [tickets, setTickets] = useState("");
  const [ticketsToWithdraw, setTicketsToWithdraw] = useState("");

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
      setAccount(account[0]);
    } else {
      console.log("No account detected");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("A MetaMask wallet is necessary to connect.");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalanceAndTickets = async () => {
    if (atm) {
      try {
        const ethSpentInWei = await atm.getETHSpent();
        const tickets = await atm.getMyTickets();
        setEthSpent(ethers.utils.formatEther(ethSpentInWei));
        setMyTickets(tickets.toString());
      } catch (error) {
        console.error("Error getting balance and tickets:", error);
      }
    }
  };

  const purchaseTickets = async () => {
    const numTickets = Number(tickets);

    if (numTickets <= 0) {
      alert("Please enter a valid number of tickets.");
      return;
    }

    const costPerTicket = numTickets > 1 ? 2 : 3;
    const totalCost = ethers.utils.parseEther((numTickets * costPerTicket).toString());

    if (atm) {
      try {
        let tx = await atm.purchaseTickets(numTickets, { value: totalCost });
        await tx.wait();
        await getBalanceAndTickets();
      } catch (error) {
        console.error("Error purchasing tickets:", error);
      }
    }
  };

  const withdrawTickets = async () => {
    const numTicketsToWithdraw = Number(ticketsToWithdraw);

    if (numTicketsToWithdraw <= 0 || numTicketsToWithdraw > myTickets) {
      alert("Please enter a valid number of tickets to withdraw.");
      return;
    }

    if (atm) {
      try {
        let tx = await atm.withdraw(numTicketsToWithdraw);
        await tx.wait();
        await getBalanceAndTickets();
      } catch (error) {
        console.error("Error withdrawing tickets:", error);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>To purchase tickets, please install Metamask</p>;
    }

    if (!account) {
      return (
        <button className="connect-button" onClick={connectAccount}>
          Please connect Your Metamask Wallet
        </button>
      );
    }

    if (ethSpent === undefined || myTickets === undefined) {
      getBalanceAndTickets();
    }

    return (
      <div className="atm">
        <div className="main-content">
          <div className="balance-section">
            <div className="balance-block">
              <div className="balance-icon">
                <i className="fas fa-ethereum"></i>
              </div>
              <div className="balance-details">
                <p className="balance-title">Total ETH Spent for Concert Tickets</p>
                <p className="balance-info">{ethSpent} ETH</p>
              </div>
            </div>
            <div className="balance-block">
              <div className="balance-icon">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <div className="balance-details">
                <p className="balance-title">Concert Tickets Owned</p>
                <p className="balance-info">{myTickets} Ticket(s)</p>
              </div>
            </div>
          </div>

          {/* Purchase Tickets Section */}
          <div className="purchase-box">
            <h2 className="transaction-title">Purchase Concert Tickets</h2>
            <form className="amount-form">
              <label>
                Number of Concert tickets have:
                <input
                  type="number"
                  min="1"
                  value={tickets}
                  onChange={(e) => setTickets(e.target.value)}
                />
              </label>
            </form>
            <button className="purchase-button" onClick={purchaseTickets}>
              Purchase {tickets} Ticket(s)
            </button>
          </div>

          {/* Withdraw Tickets Section */}
          <div className="withdraw-box">
            <h2 className="transaction-title">Withdraw Concert Tickets</h2>
            <form className="amount-form">
              <label>
                Number of tickets wants to withdraw:
                <input
                  type="number"
                  min="1"
                  value={ticketsToWithdraw}
                  onChange={(e) => setTicketsToWithdraw(e.target.value)}
                />
              </label>
            </form>
            <button className="withdraw-button" onClick={withdrawTickets}>
              Withdraw {ticketsToWithdraw} Ticket(s)
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1> Cold-Play Concert Ticket Purchase</h1>
      </header>
      {initUser()}
      <style jsx>{`
  body {
    background-color: #0e0e0e;
    color: #fff;
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: url('https://wallpaperaccess.com/full/4167965.jpg') no-repeat center center fixed;
    background-size: cover;
  }
  .container {
    text-align: center;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
    margin: 60px auto;
    width: 90%;
    max-width: 1200px;
    background: rgba(0, 0, 0, 0.7); /* Semi-transparent background */
  }
  header h1 {
    font-size: 3em;
    margin-bottom: 40px;
    color: #f1c40f;
    font-weight: bold;
    text-shadow: 0 4px 6px rgba(0, 0, 0, 0.7);
    font-family: 'Poppins', sans-serif;
  }
  .atm {
    padding: 40px;
    background: rgba(255, 255, 255, 0.1); /* Transparent with slight white tint */
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  }
  .main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
  .balance-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
  .balance-block {
    display: flex;
    align-items: center;
    background: #1e1e1e;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
    width: 90%;
    max-width: 600px;
    margin-bottom: 30px;
  }
  .balance-icon {
    font-size: 2.5em;
    color: #e67e22;
    margin-right: 20px;
  }
  .balance-details {
    color: #fff;
  }
  .balance-title {
    font-size: 1.5em;
    margin-bottom: 5px;
    font-weight: bold;
    text-transform: uppercase;
    color: #f1c40f;
  }
  .balance-info {
    font-size: 1.3em;
    color: #ecf0f1;
  }
  .transaction-title {
    font-size: 1.8em;
    margin-bottom: 25px;
    font-weight: bold;
    color: #f39c12;
  }
  .amount-form {
    margin: 20px 0;
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  .amount-form input {
    padding: 12px;
    border-radius: 10px;
    border: 2px solid #3498db;
    font-size: 1.2em;
    background-color: #2c3e50;
    color: #ecf0f1;
  }
  .purchase-button,
  .withdraw-button,
  .connect-button {
    padding: 15px 35px;
    background-color: #9b59b6;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.3em;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  }
  .purchase-button:hover {
    background-color: #8e44ad;
  }
  .withdraw-button:hover,
  .connect-button:hover {
    background-color: #2980b9;
  }
`}</style>

    </main>
  );
}
