1
- `npx hardhat sxt-utils:login`
2
- `npx hardhat sxt-utils:initSchema --schema sxt_utils`
    - `ll schemas/sxt_utils`
- `npx hardhat sxt-utils:createSchema --schema sxt_utils`
3
- `npx hardhat sxt-utils:saveTableSecurity --schema sxt_utils --businessobject ToDo`
4
- `npm run make-table-biscuits-js -- --schema sxt_utils --table tasks`
- `npm run make-table-biscuits-js -- --schema sxt_utils --table lists`
5
- `npx hardhat sxt-utils:saveTableDefinitions --schema sxt_utils --businessobject ToDo`
6
- `npx hardhat sxt-utils:createTable --schema sxt_utils --businessobject ToDo`
7
- `npx hardhat sxt-utils:insertIntoTable --schema sxt_utils --businessobject ToDo`
- `npx hardhat sxt-utils:previewTable --schema sxt_utils --businessobject ToDo`
- `npx hardhat sxt-utils:previewTable --schema sxt_utils --table lists`
- `npx hardhat sxt-utils:previewTable --schema sxt_utils --table tasks`
- `npx hardhat sxt-utils:previewTable --schema sxt_utils --table lists,tasks --query getListTasks`
8
- `npx hardhat sxt-utils:dropTable --schema instruxi_test --businessobject ToDo`
- `npx hardhat sxt-utils:deleteFromTable --schema sxt_utils --businessobject ToDo`