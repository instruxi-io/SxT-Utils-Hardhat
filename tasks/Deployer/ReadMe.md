## Deploy and Verify Smart Contracts

Deploys a smart contract given the smart contract type (erc1155, erc1155delta, erc721, erc20, domainFactory, meshFactory)

**network** - one of [configured networks](https://github.com/instruxi-io/mesh-hardhat/blob/master/networks.ts)<br>
**type** - one of erc1155, erc1155delta, erc721, erc20, domainFactory, meshFactory


``` bash
npx hardhat deployer:deploy \
    --type <type> \
    --network <network>
```

Verifies a smart contract given the smart contract address

**network** - one of [configured networks](https://github.com/instruxi-io/mesh-hardhat/blob/master/networks.ts)<br>
**address** - The contract address of the smart contract deployed by "deployer:deploy"


``` bash
npx hardhat deployer:verify \
    --contractaddress <contractAddress>\
    --network <network>
```