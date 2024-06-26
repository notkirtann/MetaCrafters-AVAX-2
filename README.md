# Integrating Frontend with a Smart Contract


This project is part of the **Metacrafters ETH+AVAX Proof** course.

In this project, we had to integrate Frontend with a Smart Contract

To get the project dependencies, run this command in the project root folder

```
npm i
```

### The project consists of three parts

1. **Hardhat local blockchain**: Hardhat allows us to create a local blockchain with demo accounts, where we can deploy our smart contract, and interact with it.

To initialize a local blockchain environment:

```
npx hardhat node
```

We have to add this local network to our **Metamask Wallet** in order to access it.

2. **Smart Contract Deployment**: Once the blockchain environment is live, we can deploy our smart contract using a deploy script. The deploy script compiles the smart contract and passes the initial value to the constructor, and deploys the contract to the blockchain. We can get address of the smart contract by using the reference variable assigned while loading the contract.

To deploy the contract

```
npx hardhat run --network localhost scripts/deploy.js
```

3. **Frontend**: Frontend has been made using Next.js. The frontend helps us connect with the **Metamask wallet**. After establishing the connection, we can see the **Deposit** and **Withdraw** interface. Just enter the desired amount in the textbox and click **Deposit** or **Withdraw**, it will redirect you to Metamask wallet for confirmation, after verifying the transaction, the amount will be transferred and the balance will be updated in the frontend.
