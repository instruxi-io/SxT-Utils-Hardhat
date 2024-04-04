## Request Nonce

Returns a nonce number for the HRE signer.

**network** - one of [configured networks](https://github.com/instruxi-io/mesh-hardhat/blob/master/networks.ts)<br>

```bash
npx hardhat enforcer:requestNonce --network <network>
```

## Invalidate Nonce

Invalidates a nonce number for the HRE signer.

**network** - one of [configured networks](https://github.com/instruxi-io/mesh-hardhat/blob/master/networks.ts)<br>

```bash
npx hardhat enforcer:invalidateNonce
```

## Authorize

Authorize a transaction.  It requires a signed challenge, a chain id, and a policy.

**network** - one of [configured networks](https://github.com/instruxi-io/mesh-hardhat/blob/master/networks.ts)<br>
**signedchallenge** - a signed challenge<br>
**chainid** - the chain id of the blockchain being used<br>
**policy** - the policy id<br>

```bash
Coming Soon...
```

## Register Account

Registers an account to get HRE signer's first API key. It requires a username, email, account public key, signature, and tenant code for the account to be registered.

**network** - one of [configured networks](https://github.com/instruxi-io/mesh-hardhat/blob/master/networks.ts)<br>
**username** - username for the account<br>
**email** - email address for the account<br>
**account** - public key for the account<br>
**signature** - signature<br>
**tenantcode** - tenant code for the account<br>

```bash
npx hardhat enforcer:registerAccount \
    --username <username> \
    --email <email> \
    --account <account> \
    --signature <signature> \
    --tenantcode <tenantCode> \
    --network <network>
```

## Create API Key

Creates an API Key. It requires an API key and a tenant ID.

**network** - one of [configured networks](https://github.com/instruxi-io/mesh-hardhat/blob/master/networks.ts)<br>
**apikey** - api key to be created<br>
**tenantid** - tenant id<br>

```bash
npx hardhat enforcer:createAPIKey
    --network <network>
```

## Delete API Key

Deletes an API key. It requires an API key.

**network** - one of [configured networks](https://github.com/instruxi-io/mesh-hardhat/blob/master/networks.ts)<br>
**apikey** - the API key to be deleted

```bash
npx hardhat enforcer:deleteAPIKey \
    --apikey <apiKey> \
    --network <network>
```

## Deactivate API Key

Deactivates an API key.  It requires an API key.

**network** - one of [configured networks](https://github.com/instruxi-io/mesh-hardhat/blob/master/networks.ts)<br>
**apikey** - the API key to be deactivated<br>

```bash
npx hardhat enforcer:deactivateAPIKey \
    --apikey <apiKey> \
    --network <network>
```

## Activate API Key

Activates a previously deactivated API key. It requires an API key.

**network** - one of [configured networks](https://github.com/instruxi-io/mesh-hardhat/blob/master/networks.ts)<br>
**apikey** - the api key to be activated<br>

```bash
npx hardhat enforcer:activateAPIKey \
    --apikey <apiKey> \
    --network <network>
```

## Account API Keys
Lists API keys associated with the HRE signer account.

**network** - one of [configured networks](https://github.com/instruxi-io/mesh-hardhat/blob/master/networks.ts)<br>

```bash
npx hardhat enforcer:accountAPIKeys
    --network <network>
```

## Sign Ethereum Message

Signs an Ethereum message. It requires a message.

**network** - one of [configured networks](https://github.com/instruxi-io/mesh-hardhat/blob/master/networks.ts)<br>
**nonce** - a nonce number used to sign messages<br>

```bash
npx hardhat enforcer:signEthMessage \
    --message <nonce> \
    --network <network>
```