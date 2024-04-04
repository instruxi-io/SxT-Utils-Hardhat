## Mesh Serverless

> The Mesh Serverless project provides a user-friendly framework for DApp development with the Mesh SDK. If you are only using Space and Time, you can skip to the part 5 of the setup ReadMe sectioned, **SxT Utils**.

### Dependencies

- [Node.js](https://nodejs.org/en) - versions 19 or 20
- [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [NVM](https://github.com/nvm-sh/nvm) - optional
- Read and write privileges to a local filesystem
- WSL is recommended for Windows users

#
	nvm --version
	nvm use 

### Git clone the repository, change directory into the project, and install the dependecies 

    npm install

## Getting Started -  Generate a wallet then connect to a live blockchain network 

### First Configure environment variables in .env (refer to example.env)

1. Create a public and private key using the Hardhat script below or import them from Metamask (this method is not fit for mainnet, testing only) and set them as environment variables in a .env file.

#

	npm run make-eth-keys
#
	mv dev.env .env
#
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

> The Mesh Indexer is monitoring Ethereum, Sepolia, Avalanche, Fuji, Polygon, Mumbai, Arbitrum, and Base and this Hardhat project is configured to accept the following RPC values. Use networks.ts to extend or customize your network scope

###

3. Hardhat uses a concept called tasks to execute scripts defined in `tasks/` using your PRIVATE_KEY as the signer. Here is how to list all of the available tasks in your project. Notice that major task categories prefix the task actions like `<task category>:<task> --parameter1 abc --parameter2 123`.

#
	npx hardhat
#

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


### SxT Utils (Optional) 

> Head over to [Space and Time](https://app.spaceandtime.ai/) to register your wallet. It's free to get started and you can use the same public key as above

5. Set Space and Time environment variables in .env (PUBLIC_KEY and PRIVATE_KEY must be the keys associated with SXT_USER_ID)

#
	SXT_URI="https://api.spaceandtime.app/v1" 
	SXT_URI_V2="https://api.spaceandtime.app/v2"
	SXT_USER_ID=""
	SXT_SCHEME="ECDSA"
	SXT_JOIN_CODE=""
	PUBLIC_KEY=""
	PRIVATE_KEY=""
#

6. Initiating a schema will create a directory in `schemas` --> `schemas/<schema>/`

#
	npx hardhat sxt-utils:login	
#

7. Create the schema 

#
	npx hardhat sxt-utils:initSchema --schema <schema> 
	npx hardhat sxt-utils:createSchema --schema <schema> 
#


8. Model your tables as [business objects](https://dbdiagram.io/d/660439a2ae072629ce1c2156) and place them in the business-objects directory --> business-objects/<BUSINESS_OBJECT>.ejs

#
	TABLE <%= schema %>.LISTS {
		id INTEGER
		list VARCHAR(256)

		Indexes {
			(id) [pk, name:"pk"]   
		}
	}
#

9. Generate all of the table-level biscuits. Run this command for each table in your business object. Note, biscuit making has a dependency on WASM making it incompatible with Typescript. For this step use NPM.

#

	npm run make-table-biscuits-js --table <table>

#

10. Generate all of the table-level artifacts for the given tables

#
	sxt-utils:saveTableSecurity --schema <schema> --businessobject <businessObject>
	sxt-utils:saveTableDefinitions --schema <schema> --businessobject <businessObject>
	sxt-utils:saveTableDDL --schema <schema> --businessobject <businessObject>
	sxt-utils:saveTableDML --schema <schema> --businessobject <businessObject>
	sxt-utils:saveTableDQL --schema <schema> --businessobject <businessObject>
# 

11. Create the tables defined in the business object. Note, that business objects are case sensitive and all attributes should be all caps due

#
	npx hardhat sxt-utils:createTable --schema <schema> --businessobject <business_object>

	or
	
	npx hardhat sxt-utils:createTable --schema <schema> --table <table>
#

12. Load data into the tables from `data/`

#
	npx hardhat sxt-utils:insertIntoTable --schema <schema> --businessobject <business_object>

	or
	
	npx hardhat sxt-utils:insertIntoTable --schema <schema> --table <table>
#

13. Preview master data

#
	npx hardhat sxt-utils:insertIntoTable --schema <schema> --businessobject <business_object>

	or
	
	npx hardhat sxt-utils:insertIntoTable --schema <schema> --table <table>
#

14. Be sure to backup your schema directory locally. Files in `.secure/` will not be committed to Github.