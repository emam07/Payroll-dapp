import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractABI } from './contract-abi'; // Your copied ABI
import './App.css'; // For basic styling

const CONTRACT_ADDRESS = "0x1cb636e5Cfce8A51f61b6dFc179d72FAf102Ef76"; // <<< PASTE YOUR CONTRACT ADDRESS

function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [contractBalance, setContractBalance] = useState<string>('0');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [employeeAddressInput, setEmployeeAddressInput] = useState<string>('');
  const [salaryAmountInput, setSalaryAmountInput] = useState<string>('');
  const [releaseAddressInput, setReleaseAddressInput] = useState<string>('');

  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
      const payrollContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, p);
      setContract(payrollContract);
    } else {
      setStatusMessage("MetaMask is not installed. Please install it to use this dApp.");
    }
  }, []);

  useEffect(() => {
    // If contract is set, fetch its balance
    const fetchContractBalance = async () => {
      if (contract && provider) {
        try {
          const balanceWei = await provider.getBalance(CONTRACT_ADDRESS);
          setContractBalance(ethers.formatEther(balanceWei));
        } catch (error) {
          console.error("Error fetching contract balance:", error);
          setStatusMessage("Error fetching contract balance.");
        }
      }
    };
    fetchContractBalance();
    // Refresh balance periodically or after transactions
    const interval = setInterval(fetchContractBalance, 5000); 
    return () => clearInterval(interval);
  }, [contract, provider, account]); // Re-fetch if contract/provider/account changes

  const connectWallet = async () => {
    if (!provider) {
      setStatusMessage("MetaMask not found.");
      return;
    }
    try {
      setStatusMessage("Connecting wallet...");
      const accounts = await provider.send("eth_requestAccounts", []);
      const currentSigner = await provider.getSigner();
      setSigner(currentSigner);
      setAccount(accounts[0]);
      setContract(new ethers.Contract(CONTRACT_ADDRESS, contractABI, currentSigner)); // Connect signer to contract
      setStatusMessage("Wallet connected!");
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      setStatusMessage(`Wallet connection failed: ${error.message || error}`);
    }
  };

  const addEmployee = async () => {
    if (!contract || !signer || !account) {
      setStatusMessage("Please connect wallet first.");
      return;
    }
    try {
      setStatusMessage("Adding employee...");
      const salaryWei = ethers.parseEther(salaryAmountInput);
      const tx = await contract.addEmployee(employeeAddressInput, salaryWei);
      await tx.wait(); // Wait for transaction to be mined
      setStatusMessage(`Employee ${employeeAddressInput} added with salary ${salaryAmountInput} ETH! Transaction: ${tx.hash}`);
      setEmployeeAddressInput('');
      setSalaryAmountInput('');
    } catch (error: any) {
      console.error("Add employee error:", error);
      setStatusMessage(`Error adding employee: ${error.data?.message || error.message || error}`);
    }
  };

  const releaseSalary = async () => {
    if (!contract || !signer || !account) {
      setStatusMessage("Please connect wallet first.");
      return;
    }
    try {
      setStatusMessage(`Releasing salary for ${releaseAddressInput}...`);
      const tx = await contract.releaseSalary(releaseAddressInput);
      await tx.wait();
      setStatusMessage(`Salary released to ${releaseAddressInput}! Transaction: ${tx.hash}`);
      setReleaseAddressInput('');
    } catch (error: any) {
      console.error("Release salary error:", error);
      setStatusMessage(`Error releasing salary: ${error.data?.message || error.message || error}`);
    }
  };

  const fundContract = async () => {
    if (!signer || !contract) {
      setStatusMessage("Please connect wallet first.");
      return;
    }
    try {
        setStatusMessage("Sending 10 ETH to contract...");
        const tx = await signer.sendTransaction({
            to: CONTRACT_ADDRESS,
            value: ethers.parseEther("10") // Send 10 ETH to the contract
        });
        await tx.wait();
        setStatusMessage("Contract funded with 10 ETH!");
    } catch (error: any) {
        console.error("Error funding contract:", error);
        setStatusMessage(`Error funding contract: ${error.data?.message || error.message || error}`);
    }
  };


  return (
    <div className="App">
      <h1>Mini Payroll dApp</h1>
      <p>{statusMessage}</p>

      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <div>
          <p>Connected Account: <strong>{account}</strong></p>
          <p>Contract Address: <strong>{CONTRACT_ADDRESS}</strong></p>
          <p>Contract Balance: <strong>{contractBalance} ETH</strong></p>
          <button onClick={fundContract}>Fund Contract with 10 ETH</button>
          
          <hr />

          <h2>Add/Update Employee</h2>
          <div>
            <label>Employee Address:</label>
            <input
              type="text"
              value={employeeAddressInput}
              onChange={(e) => setEmployeeAddressInput(e.target.value)}
              placeholder="0x..."
            />
          </div>
          <div>
            <label>Salary (ETH):</label>
            <input
              type="number"
              step="0.001"
              value={salaryAmountInput}
              onChange={(e) => setSalaryAmountInput(e.target.value)}
              placeholder="e.g., 1.5"
            />
          </div>
          <button onClick={addEmployee}>Add/Update Employee</button>

          <hr />

          <h2>Release Salary</h2>
          <div>
            <label>Employee Address to Release:</label>
            <input
              type="text"
              value={releaseAddressInput}
              onChange={(e) => setReleaseAddressInput(e.target.value)}
              placeholder="0x..."
            />
          </div>
          <button onClick={releaseSalary}>Release Salary</button>

          <hr />
          {/* Optional: Add a section to view a specific employee's set salary */}
          {/* You'd need another input and button to call getEmployeeSalary */}
        </div>
      )}
    </div>
  );
}

export default App;