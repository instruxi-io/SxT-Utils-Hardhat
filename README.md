## SxT-Utils Hardhat

### The SxT-Utils Hardhat project provides a user-friendly framework for DApp development with the SxT Typescript SDK

### Dependencies

- [Node.js](https://nodejs.org/en) - versions 19 or 20
- [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [NVM](https://github.com/nvm-sh/nvm) - optional
- Read and write privileges to a local filesystem
- WSL is recommended for Windows users

#
	node --version
	nvm use 20

### Git clone the repository, change directory into the project, and install the dependecies 

    npm install

## Getting Started -  Generate a wallet then connect to a live blockchain network 

### First Configure environment variables in .env (refer to example.env)

1. Create a public and private key using the Hardhat script below or import them from Metamask (this method is not fit for mainnet, testing only) and set them as environment variables in a .env file.

#

	npm run make-eth-keys
#
	touch .env
#
	PRIVATE_KEY=""
	PUBLIC_KEY=""
#

### Environment Variables:  Populating the .env file:

2. Add RPC endpoints to the .env file to set up your network providers. Leave blank if you cannot provide a value and be sure the PUBLIC_KEY and PRIVATE_KEY variables from step 1 are also set. Etherscan API tokens can be found by setting up an account with the community scanning (tools)[https://etherscan.io/myaccount]

#
	PRIVATE_KEY=""
	PUBLIC_KEY=""

	ETHEREUM_RPC_URL="https://example.rpc/"
	AVALANCHE_FUJI_RPC_URL=""
	ETHEREUM_SEPOLIA_RPC_URL=""
	POLYGON_MUMBAI_RPC_URL=""
	POLYGON_RPC_URL=""
	ETHEREUM_RPC_URL=""
	AVALANCHE_RPC_URL=""
	ARBITRUM_RPC_URL=""
	BASE_RPC_URL=""

	ETHERSCAN_TOKEN=""
	ETHERSCAN_TOKEN_POLYGON=""
	ETHERSCAN_TOKEN_AVALANCHE=""
	ETHERSCAN_TOKEN_ETHEREUM=""
	ETHERSCAN_TOKEN_ARBITRUM=""
#


###

3. Hardhat uses a concept called tasks to execute scripts defined in `tasks/` using your PRIVATE_KEY as the signer. Here is how to list all of the available tasks in your project. Notice that major task categories prefix the task actions like `<task category>:<task> --parameter1 abc --parameter2 123`.

#
	npx hardhat
#

> <strong>Security Notice:</strong> <br><br>
<strong>@chainlink/enc.env</strong> - This hardhat project comes equipped with the NPM package "enc.env" for encrypting your private key locally. We recommend transitioning to this as soon as you are comfortable evaluating the tool as a minimum best practice. <br><br>
<strong>.gitignore</strong> - Never remove the .gitignore and never move <strong>.secure</strong>, <strong>.key</strong>, or <strong>.env</strong> file from their locations. These directories contain sensitive data that allow administrators to operate on the decentralized resources that are configured in this project. Consider using a combination env.enc, GitCrypt, and/or other remote backup options where the artifacts can be encrypted at rest under password lock. Hardhat plugins can extend the provider capabilities to MPC wallet providers or Hardware wallets.<br><br>


#### Valid values for network:

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

## SxT Utils (Optional) - Head over to [Space and Time](https://app.spaceandtime.ai/) to register your wallet. It's free to get started and you can use the same public key as above

4. Set Space and Time environment variables in .env. If your your SxT UserId is not active, then the program will attempt to use SXT_JOIN_CODE to create and add your current wallet context to Space and Time

#
	SXT_URI="https://api.spaceandtime.app/v1" 
	SXT_URI_V2="https://api.spaceandtime.app/v2"
	SXT_USER_ID=""
	SXT_SCHEME="ECDSA"
	SXT_JOIN_CODE=""
#

5. Initiating a schema will create a directory in `schemas` --> `schemas/<schema>/`

#
	npx hardhat sxt-utils:initSchema --schema <schema> 
#

6. Create the schema 

#
	npx hardhat sxt-utils:createSchema --schema <schema> 
#


7. Model your tables as [business objects](https://dbdiagram.io/d/660439a2ae072629ce1c2156) and place them in the business-objects directory --> `business-objects/<BUSINESS_OBJECT>.ejs`

#
	TABLE TEST.TO_DO {
    		ID VARCHAR(36)
    		MESSAGE VARCHAR(36)
    		DUE_DATE VARCHAR(36)
    
    		Indexes {
        		(ID) [pk, name:"pk"]
    		}
  	}	
#

8. Generate all of the table-level biscuits. Run this command for each table in your business object. Note, biscuit making has a dependency on WASM making it incompatible with Typescript. For this step use NPM.

#

	npm run make-table-biscuits-js -- --schema <schema> --table <table>

#

9. Generate all of the table-level artifacts for the given tables

#
	sxt-utils:saveTableSecurity --schema <schema> --businessobject <businessObject>
	sxt-utils:saveTableDefinitions --schema <schema> --businessobject <businessObject>
	sxt-utils:saveTableDDL --schema <schema> --businessobject <businessObject>
	sxt-utils:saveTableDML --schema <schema> --businessobject <businessObject>
	sxt-utils:saveTableDQL --schema <schema> --businessobject <businessObject>
# 

10. Create the tables defined in the business object. Note, that business objects are case sensitive and all attributes should be all caps due

#
	npx hardhat sxt-utils:createTable --schema <schema> --businessobject <business_object>

	or
	
	npx hardhat sxt-utils:createTable --schema <schema> --table <table>
#

11. Load data into the tables from `data/`

#
	npx hardhat sxt-utils:insertIntoTable --schema <schema> --businessobject <business_object>

	or
	
	npx hardhat sxt-utils:insertIntoTable --schema <schema> --table <table>
#

12. Preview master data

#
	npx hardhat sxt-utils:insertIntoTable --schema <schema> --businessobject <business_object>

	or
	
	npx hardhat sxt-utils:insertIntoTable --schema <schema> --table <table>
#

13. Be sure to backup your schema directory locally. Files in `.secure/` will not be committed to Github.
