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
    <h1>Cold-Play Concert Ticket Purchase</h1>
  </header>
  {initUser()}
  <style jsx>{`
    body {
      background-color: #fff;
      color: #fff;
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background-size: full;
    }
    .container {
      color : #3498db;
      text-align: center;
      padding: 50px;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
      margin: 70px auto;
      width: 90%;
      max-width: 1100px;
      background: rgba(0, 0, 0, 10); /* Slightly darker transparent background */
      border: 3px solid #3498db;
    }
    header h1 {
      font-size: 3.5em;
      margin-bottom: 40px;
      color: #3498db;
      font-weight: bold;
      text-shadow: 0 6px 8px rgba(255, 200, 20, 0.8);
      font-family: 'Poppins', sans-serif;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .atm {
      padding: 50px;
      background: rgba(255, 255, 255, 0.15); /* White tint but more transparent */
      border-radius: 20px;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.7);
    }
    .main-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 50px;
    }
    .balance-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 40px;
    }
    .balance-block {
      display: flex;
      align-items: center;
      background: linear-gradient(145deg, #3498db, #2980b9);
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.8);
      width: 95%;
      max-width: 650px;
      margin-bottom: 35px;
    }
    .balance-icon {
      font-size: 2.8em;
      color: #f1c40f;
      margin-right: 25px;
      text-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
    }
    .balance-details {
      color: #fff;
    }
    .balance-title {
      font-size: 1.6em;
      margin-bottom: 8px;
      font-weight: bold;
      text-transform: uppercase;
      color: #ecf0f1;
    }
    .balance-info {
      font-size: 1.4em;
      color: #ecf0f1;
    }
    .transaction-title {
      font-size: 2em;
      margin-bottom: 25px;
      font-weight: bold;
      color: #48c9b0;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .amount-form {
      margin: 25px 0;
      display: flex;
      justify-content: center;
      gap: 12px;
    }
    .amount-form input {
      padding: 12px;
      margin-left : 2px;
      border-radius: 10px;
      border: 3px solid #48c9b0;
      font-size: 1.2em;
      background-color: #1c2833;
      color: #fff;
      transition: border-color 0.3s ease;
    }
    .amount-form input:focus {
      border-color: orange;
    }
    .purchase-button,
    .withdraw-button,
    .connect-button {
      padding: 18px 40px;
      background: linear-gradient(145deg, #5dade2, #2980b9);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.4em;
      cursor: pointer;
      transition: background 0.3s ease, transform 0.2s ease;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .purchase-button:hover,
    .withdraw-button:hover,
    .connect-button:hover {
      background: #3498db;
      transform: scale(1.05);
    }
    .purchase-button:active,
    .withdraw-button:active,
    .connect-button:active {
      transform: scale(0.98);
    }
  `}</style>
</main>


  
  );
}
