# 💸 Payroll DApp using Hardhat, Ganache, React-TS, Node.js & Express

This project is a full-stack decentralized payroll system that allows employers to add employees and send them crypto-based salaries using Ethereum smart contracts. Built with:

- Solidity + Hardhat (Smart Contracts)
- Ganache CLI (Local blockchain)
- Node.js + Express (Backend API)
- React + TypeScript (Frontend)

---

## 📁 Project Structure


```
payroll-dapp/
├── backend/
│ ├── src/
│ ├── .env
│ ├── server.ts
│ └── package.json
├── contracts/
│ ├── Payroll.sol
│ └── deploy.js
├── frontend/
│ ├── src/
│ ├── public/
│ ├── .env
│ ├── vite.config.ts
│ └── package.json
├── hardhat.config.js
├── README.md
└── .env
```
Create & Compile

npx hardhat
npx hardhat compile

Run Ganache (local blockchain)
npm install -g ganache
ganache

 Deploy Contracts Locally
 npx hardhat run contracts/deploy.js --network localhost


Navigate to backend folder
cd backend


npm install express dotenv cors ethers
npm install -D typescript ts-node-dev @types/express @types/node

Setup .env
PORT=5000
CONTRACT_ADDRESS=your_local_contract_address
PRIVATE_KEY=your_wallet_private_key
RPC_URL=http://127.0.0.1:8545
VITE_BACKEND_URL=http://localhost:5000
VITE_CONTRACT_ADDRESS=your_local_contract_address


npx ts-node-dev src/server.ts


Install Dependencies

npm install
npm install ethers axios
npm install -D @types/react @types/node

Commands Summary

| Task              | Command                                         |
| ----------------- | ----------------------------------------------- |
| Compile contracts | `npx hardhat compile`                           |
| Run Ganache       | `ganache`                                       |
| Deploy contract   | `npx hardhat run deploy.js --network localhost` |
| Start backend API | `cd backend && npx ts-node-dev src/server.ts`   |
| Start frontend    | `cd frontend && npm run dev`                    |






 
