## Serverless Mesh

### The Serverless Mesh project provides a user-friendly framework for DApp development with the Mesh SDK. It serves as a monorepo for managing smart contracts, deploying DApp backends to Space and Time, archiving files to Storj, and setting up authorization events on the Mesh Gateway.

### Dependencies

- Node.js (Node 18, 19, or 20)
- Read and write privileges to local filesystem

#

	nvm --version
	nvm use 

### Git clone the repository, change directory into the project, and install the dependecies 

    npm install

# Getting Started -  Generate a wallet then connect to a live blockchain network 

### First Configure environment variables in .env (refer to example.env)

1. create public and private key using the Hardhat script below or import from Metamask (this method is not fit for mainnet, testing only)

##

	npm run make-eth-keys

##

2. Add RPC endpoints to the .env file to set up your network providers. The Mesh Indexer is monitoring Ethereum, Sepolia, Avalanche, Fuji, Polygon, Mumbai, Arbitrum, and Base and this Hardhat project is preconfigured to interact with each of those.

### Valid values for .env:

	ETHEREUM_RPC_URL
	AVALANCHE_FUJI_RPC_URL
	ETHEREUM_SEPOLIA_RPC_URL
	POLYGON_MUMBAI_RPC_URL
	POLYGON_RPC_URL
	ETHEREUM_RPC_URL
	AVALANCHE_RPC_URL
	ARBITRUM_RPC_URL
	BASE_RPC_URL

##

> <strong>Security Notice:</strong> <br><br>
<strong>@chainlink/enc.env</strong> - This hardhat project comes equipped with the NPM package "enc.env" for encrypting your private key locally. We recommend transitioning to this as soon as you are comfortable evaluating the tool as a minimum best practice. <br><br>
<strong>.gitignore</strong> - Never remove the .gitignore and never move <strong>.secure</strong>, <strong>.key</strong>, or <strong>.env</strong> file from their locations. These directories contain sensitive data that allow administrators to operate on the decentralized resources that are configured in this project. Consider using a combination env.enc, GitCrypt, and/or other remote backup options where the artifacts can be encrypted at rest under password lock. Hardhat plugins can extend the provider capabilities to MPC wallet providers or Hardware wallets.<br><br>

### User Registration - Contact your Mesh Gateway admin for your tenant code. 

3. This command will sign a piece of text data, submit it to the Mesh Auth Enforcer, and upon signature validation you will be emailed a link to confirm your email address

#

	npx hardhat enforcer:registerAccount --network <network> --username <username> --email <email> --tenantcode <tenantCode>

#### Valid Values for network:
	ethereum
	avalanche
	polygon
	ethereumSepolia
	polygonMumbai
	avalancheFuji
	arbitrum
	base
	localTestnet

#

4. Click the activation link sent to your email and copy out the API KEY returned in response. Set the MESH_API_KEY environment variable in .env

#

	MESH_API_KEY = "00000-00000-00000-00000-000000"

#

5. add the api-key to the Mesh Starter Kit environment variables

## SxT Utils (Optional) - Head over to [Space and Time](https://app.spaceandtime.ai/) to register your wallet. It's free to get started!
### Use the same public key as you have been using in Space and Time for best results

4. initiate a dapp project --> schemas/<dapp>

5. develop a schema and place it in the business-objects directory --> schemas/<schema>/business-objects/<SCHEMA>.<BUSINESS_OBJECT>.ejs

6. make dapp schema one-shot or make dapp schema artifacts individually

	6a. derive table-definitions from the business-objects --> schemas/<schema>/table-definitions/<SCHEMA>.<TABLE>.json
	
	6b. derive table security (public and private keys) --> schemas/<schema>/.secure/keys/<SCHEMA>.<TABLE>.json
	
	6c. derive table biscuits from the table private keys --> schemas/<schema>/.secure/keys/<SCHEMA>.<TABLE>.json
	
	6d. generate sql dql templates --> schemas/<schema>/templates/dql/preview/<SCHEMA>.<TABLE>.json
	
	6e. generate sql ddl templates --> schemas/<schema>/templates/ddl/(create, drop, index)/<SCHEMA>.<TABLE>.json
	
	6f. generate sql dml templates --> schemas/<schema>/templates/dml/(insert, update, delete)/<SCHEMA>.<TABLE>.json
	
	6g. generate sql topic-streaming templates --> schemas/<schema>/templates/topic-streaming/<SCHEMA>.<TABLE>.json
	
7. backup the biscuits to Mesh OS or local Downloads

8. load master data

9. query master data

10. delete master data

11. drop the tables from the schema

12. back up the schema directory (without security)

13. push to github

###########################################################################################################
# Mesh Starter Kit (Hardhat) - Domain Manager 

1. fund wallet with gas token
2. deploy 

###########################################################################################################
# Mesh Starter Kit (Hardhat) - Service Accounts, Group Providers, and Credit Threshold

###########################################################################################################
# Mesh Starter Kit (Hardhat) - Object Store

###########################################################################################################
# Mesh Starter Kit (Hardhat) - Key Value

###########################################################################################################
# Mesh Starter Kit (Hardhat) - vNFT Gateway

###########################################################################################################
# Mesh Starter Kit (Hardhat) - Web3SQL and ACL

###########################################################################################################
# Mesh Starter Kit (Hardhat) - Enforcer Policies

###########################################################################################################
# Mesh Starter Kit (Hardhat) - Chainlink Utils 

###########################################################################################################
# Mesh Starter Kit (Hardhat) - Fractional Real World Asset using Chainlink Functions, SxT, Cloudflare