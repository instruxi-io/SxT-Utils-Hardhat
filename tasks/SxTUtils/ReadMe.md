npx hardhat sxt-utils:saveTableDefinitions --schema idm --businessobject Attestations
npx hardhat sxt-utils:saveTableDefinitions --schema idm --businessobject Authentication
npx hardhat sxt-utils:saveTableDefinitions --schema idm --businessobject Config
npx hardhat sxt-utils:saveTableDefinitions --schema idm --businessobject Domain
npx hardhat sxt-utils:saveTableDefinitions --schema mesh_prod --table chainlink_functions_config
npx hardhat sxt-utils:saveTableDefinitions --schema idm --businessobject KeyValue
npx hardhat sxt-utils:saveTableDefinitions --schema idm --businessobject ObjectStore
npx hardhat sxt-utils:saveTableDefinitions --schema idm --businessobject SmartContracts

npx hardhat sxt-utils:saveTableSecurity --schema idm --businessobject SmartContracts
npx hardhat sxt-utils:saveTableSecurity --schema idm --businessobject ObjectStore
npx hardhat sxt-utils:saveTableSecurity --schema idm --businessobject KeyValue
npx hardhat sxt-utils:saveTableSecurity --schema idm --businessobject Domain
npx hardhat sxt-utils:saveTableSecurity --schema idm --businessobject Config
npx hardhat sxt-utils:saveTableSecurity --schema idm --businessobject Authentication
npx hardhat sxt-utils:saveTableSecurity --schema idm --businessobject Attestations


npm run make-table-biscuits-js -- --schema idm --table attestations
npm run make-table-biscuits-js -- --schema idm --table accounts
npm run make-table-biscuits-js -- --schema idm --table apikeys
npm run make-table-biscuits-js -- --schema idm --table tenants
npm run make-table-biscuits-js -- --schema idm --table id_sessions
npm run make-table-biscuits-js -- --schema idm --table web3_config
npm run make-table-biscuits-js -- --schema idm --table chainlink_functions_config
npm run make-table-biscuits-js -- --schema idm --table blockchains
npm run make-table-biscuits-js -- --schema idm --table smart_contract_types
npm run make-table-biscuits-js -- --schema idm --table models
npm run make-table-biscuits-js -- --schema idm --table kv_keyspace
npm run make-table-biscuits-js -- --schema idm --table kv_type
npm run make-table-biscuits-js -- --schema idm --table kv_key_index
npm run make-table-biscuits-js -- --schema idm --table kv_key_attributes
npm run make-table-biscuits-js -- --schema idm --table kv_dtypes
npm run make-table-biscuits-js -- --schema idm --table files
npm run make-table-biscuits-js -- --schema idm --table smart_contracts


npx hardhat sxt-utils:createTable --schema idm --businessobject Attestations
npx hardhat sxt-utils:createTable --schema idm --businessobject Authentication
npx hardhat sxt-utils:createTable --schema idm --businessobject Config
npx hardhat sxt-utils:createTable --schema idm --businessobject Domain
npx hardhat sxt-utils:createTable --schema mesh_prod --table chainlink_functions_config
npx hardhat sxt-utils:createTable --schema idm --businessobject KeyValue
npx hardhat sxt-utils:createTable --schema idm --businessobject ObjectStore
npx hardhat sxt-utils:createTable --schema idm --businessobject SmartContracts

npx hardhat sxt-utils:insertIntoTable --schema idm --businessobject Attestations
npx hardhat sxt-utils:insertIntoTable --schema idm --businessobject Authentication
npx hardhat sxt-utils:insertIntoTable --schema idm --businessobject Config
npx hardhat sxt-utils:insertIntoTable --schema idm --businessobject Domain
npx hardhat sxt-utils:insertIntoTable --schema mesh_prod --table chainlink_functions_config
npx hardhat sxt-utils:insertIntoTable --schema idm --businessobject KeyValue
npx hardhat sxt-utils:insertIntoTable --schema idm --businessobject ObjectStore
npx hardhat sxt-utils:insertIntoTable --schema idm --businessobject SmartContracts