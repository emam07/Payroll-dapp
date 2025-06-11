const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const initialBalance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", initialBalance.toString());

  const Payroll = await hre.ethers.getContractFactory("Payroll");
  const payroll = await Payroll.deploy();

  await payroll.waitForDeployment();

  console.log("Payroll contract deployed to:", payroll.target);
  console.log("To check balance, use:", `npx hardhat check-balance --address ${payroll.target}`);

  // Optionally fund the contract with some Ether for testing
  // const initialFund = hre.ethers.parseEther("10"); // 10 Ether
  // console.log(`Funding contract with ${initialFund.toString()} Wei...`);
  // await deployer.sendTransaction({
  //   to: payroll.target,
  //   value: initialFund,
  // });
  // console.log("Contract funded!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});