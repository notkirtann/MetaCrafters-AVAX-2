# Integrating Frontend with a Smart Contract

This project is part of the **Metacrafters ETH+AVAX Proof** course.

This program demonstarte how we can integrate our smart contract to a frontend step by step.

## Description
In this project i have created a frontend application which will run on a local hardhat block chain and will connect to my dummy accounts here i have some quick diposit and quick withdraw button and a custom text field where user can diposit and withdraw token as their desired amount above all maxlimit in my contract has been set to 100 token so user cann't transact above it.

## Steps to run this Project
Firstly, clone this github project, then follow the below steps to run this on your VS CODE.
 ### 1. Inside the project directory, in the terminal type: *npm i*
 This is help you to get the project dependencies.
 
 ### 2. Open two additional terminals in your VS code
 
 ### 3. In the second terminal type: *npx hardhat node*
  This allows you to create a local blockchain with demo accounts, where we can deploy our smart contract, and interact with it.
 
 ### 4. In the third terminal, type: *npx hardhat run --network localhost scripts/deploy.js*
  Using this command, we can deploy our smart contract. The deploy script compiles the smart contract and passes the initial value to the constructor, and deploys 
  the contract to the blockchain
  
  ### 5. Back in the first terminal, type:  *npm run dev*
  This will help you to launch frontend of the project.

  After this, the project will be running on your localhost. Typically at http://localhost:3000/



## Author

Kirtan Nahar
