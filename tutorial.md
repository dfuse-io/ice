# ICE (Impact, Confidence, Ease)

#### Demo Idea List Dapp Built with dfuse for EOSIO

- [ICE (Impact, Confidence, Ease)](#ice--impact--confidence--ease-) - [Demo Idea List Dapp Built with dfuse for EOSIO](#demo-idea-list-dapp-built-with-dfuse-for-eosio)
  - [0. Prerequisites](#prerequisites)
  - [1. Running dfuse for EOSIO](#1-running-dfuse-for-eosio)
  - [2. Bootstrap Testnet and Accounts](#2-bootstrap-testnet-and-accounts)
  - [3. Write Smart Contract](#3-write-smart-contract)
  - [4. Compile Smart Contract](#4-compile-smart-contract)
  - [5. Deploy Smart Contract](#5-deploy-smart-contract)
  - [6. Test Smart Contract](#6-test-smart-contract)
  - [7. Set up Wallet](#7-set-up-wallet)
    - [Signing With Scatter](#signing-with-scatter)
      - [Install Scatter](#install-scatter)
      - [Connect to custom network](#connect-to-custom-network)
      - [Import Key](#import-key)
    - [Signing With Anchor](#signing-with-anchor)
      - [Install Anchor](#install-anchor)
      - [Connect to custom network](#connect-to-custom-network-1)
      - [Import Key and Accounts](#import-key-and-accounts)
  - [8. User Interface](#8-user-interface)
  - [9. Authentication](#9-authentication)
  - [10. Using the Dapp](#10-using-the-dapp)
    - [Casting Votes](#casting-votes)
    - [Adding Pools and Ideas](#adding-pools-and-ideas)
  - [11. Application Code in Depth](#11-application-code-in-depth)
    - [Authentication](#authentication)
    - [Reading Chain Data with dfuse](#reading-chain-data-with-dfuse)

## 0. Prerequisites

- Clone this repo from:
  https://github.com/dfuse-io/ice
- Install **dfuse for EOSIO** from:
  https://github.com/dfuse-io/dfuse-eosio
- Clone and install **eosc** from source:
  https://github.com/eoscanada/eosc/tree/feature-dfuseos-boot
  This includes features allowing booting of a dfuse-eosio chain.
- Install **eosio.cdt** from:
  https://github.com/EOSIO/eosio.cdt
- Scatter OR Anchor Wallet.
  If using Scatter, you will need the full wallet to connect to our custom local network. Download version 11.0.1 instead of the simplified wallet after version 12+.
  Install Scatter: [release page](https://github.com/GetScatter/ScatterDesktop/releases/tag/11.0.1)
  Install Anchor: [release page](https://github.com/greymass/anchor/releases/tag/v1.0.2)

## 1. Running dfuse for EOSIO

dfuse is an Open Source suite of products that enables low-latency, real-time processing of blockchain data streams, allows for massively parallelizable operations over historical data, and provides the robustness and reliability required by the most demanding loads.

We will be running all dfuse Services for EOSIO in single statically linked binary: **dfuseeos**.

- Initialize dfuseeos. With dfuseeos installed and in your PATH, run:

  ```sh
  dfuseeos init
  ```

  ```
  > dfuse for EOSIO can run a local test node configured for block production,
  similar to what you use in development, with a clean blank chain and no contracts.

  Alternatively, dfuse for EOSIO can connect to an already existing network
  Do you want dfuse for EOSIO to run a producing node for you: y█
  ```

  When prompted about running a producing node, enter `y`

  This will initialize the data folders to store your local development blockchain. It will also run a producer node locally for you to interact with.

    <br>

- Run dfuseeos:

  ```sh
  dfuseeos start
  ```

  ```
  > Your instance should be ready in a few seconds, here some relevant links:

  Dashboard: http://localhost:8081
  Explorer & APIs: http://localhost:8080
  GraphiQL: http://localhost:8080/graphiql
  ```

  This starts the local producer node and all dfuse services to process and serve data from the development blockchain.
  You can access the `Dashboard` on `http://localhost:8081` to see the statuses of each running service. A high-precision block explorer `ethq` is served on `http://localhost:8080` for you to easily track blocks and transactions, as well as to try out dfuse searching functionalities. A GraphiQL interface is also served on `http://localhost:8080/graphiql` for you to craft and test GraphQL queries to access chain data.

  <br>

  **Keep this process running in a terminal throughout this tutorial**
  <br>

* If at any time you quit the process, you can simply run `dfuseeos start` again to start the chain and dfuse from where it left off. If your data folders become corrupt or if you want to start a fresh chain, you can run `dfuseeos purge` then `dfuseeos init` again.

## 2. Bootstrap Testnet and Accounts

In order to run a EOSIO-like testnet, we must first bootstrap our local blockchain with system accounts. We also need to create a few accounts, delegate bandwidth, and fund them with tokens for our development needs.

**In a new terminal, run:**

```sh
cd contract
./boot.sh
```

This script reads from the config file at `contract/bootstrapping/bootseq.yaml` to execute operations on our testnet. It passes these configs to the EOSIO command line tool `eosc`.

After this script is run, you have a fully bootstrapped EOSIO chain. The script also creates 4 accounts: one account named `dfuseioice` which is where we will deploy our smart contract, and three accounts named `user(1,2,3)` for us to use. These accounts are also delegated cpu and net, and are transferred tokens.

## 3. Write Smart Contract

The ICE smart contract needs to accomplish the following:

- **_Ability to create a pool with name_**
- **_Ability to add one idea at a time to a pool. Each idea has a title and description_**
- **_Ability to cast vote on a specific idea. Each vote contains number scores for three criteria: impact, confidence, and ease._**

We have provided the ICE smart contract in the cloned repo. The contract contains 4 tables for pools, ideas, votes, and stats. It also has three actions to add pool, add idea, and cast vote. The full code can be viewed in `contract/src`. Here are the tables and actions that we will be accessing externally:

- Three actions to add pool, add idea, and cast vote.

```cpp
[[eosio::action]]
void addpool(const name author,const name name);

[[eosio::action]]
void addidea(const name author,const name pool_name , const string title, const string description);

[[eosio::action]]
void castvote(const name voter, const name pool_name, const uint64_t idea_id, const uint32_t impact,const uint32_t confidence, const uint32_t ease);
```

- Pools table:

```cpp
struct [[eosio::table]] pool_row {
    name pool_name;
    name author;

    uint64_t primary_key() const { return pool_name.value; }
};
typedef eosio::multi_index<"pools"_n, pool_row> pools_index;
```

- Ideas table:

```cpp
struct [[eosio::table]] idea_row {
    uint64_t id;
    name pool_name;
    name author;
    string title;
    string description;
    double avg_impact;
    double avg_confidence;
    double avg_ease;
    double score;
    uint64_t total_votes;

    uint64_t primary_key() const { return id; }
};
typedef eosio::multi_index<"ideas"_n, idea_row> ideas_index;
```

- Votes table:

```cpp
struct [[eosio::table]] vote_row {
    uint64_t idea_id;
    name voter;
    uint32_t impact;
    uint32_t confidence;
    uint32_t ease;

    uint64_t primary_key() const { return voter.value; }
};
typedef eosio::multi_index<"votes"_n, vote_row> votes_index;
```

- Stats table:

```cpp
struct [[eosio::table]] stat_row {
    uint64_t id;
    uint32_t idea_count;

    uint64_t primary_key() const { return id; }
};
typedef eosio::multi_index<"stat"_n, stat_row> stats_index;
```

## 4. Compile Smart Contract

We need to compile our smart contract in order to deploy it to our local testnet. We have provided a simple compile script in the `contract` folder. Run:

```sh
./compile.sh
```

This script uses the `eosio.cdt` CLI tool to compile our `ice.cpp` contract into `ice.wasm` and `ice.abi`. It is a very simple script that creates a `build` folder, and stores the two compiled files in it.

## 5. Deploy Smart Contract

Now we can deploy the compiled smart contracts to our local testnet. Run:

```sh
./deploy.sh
```

This script uses the `eosc` CLI tool to deploy the ice smart contract to the `dfuseioice` account that we created in the bootstrap step. If you changed the account name in the `bootseq.yaml` config, make sure to update it in the `deploy.sh` script as well.

## 6. Test Smart Contract

We can test the smart contract by creating some pools, ideas and making users votes.

```sh
./test.sh
```

## 7. Set up Wallet

**_You only need to set up one of Scatter or Anchor wallet_**

### Signing With Scatter

#### Install Scatter

You should have the Scatter wallet version 11.0.1 installed from the prerequisites section. If not, go here to install: [release page](https://github.com/GetScatter/ScatterDesktop/releases/tag/11.0.1)

#### Connect to custom network

**1. Create a passphrase for your wallet**
**2. Once set up, click Networks in the left hand menu**

![add network screenshot](image.png 'add network screenshot')

**3. Add custom network and enter this info:**

```
Name: ice
Host: localhost
Protocol: http
Port: 8080
ChainID: df383d1cc33cbb9665538c604daac13706978566e17e5fd5f897eff68b88e1e4
```

The network name can be changed. The API protocol, host, and port are specified in `dfuseeos` and is displayed when it launched. The ChainID is derived from the genesis state, and is specified in `dfuseeos`. You can also verify that it is indeed correct by running:

```
eosc get info
```

This will display the current chain info with chainID

#### Import Key

**1. Now go to the Wallet tab in the menu**

If you already had your key within Scatter, you should see it listed there and now showing with your new account name under it, with the ice network in grey just below that.

![import key screenshot](image.png 'import key screenshot')

If you didn't have your key in there, you will click on Import Key, and then click on Text.

**2. Paste in the development private key:**

```
5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
```

This key was used to boot the chain and generate all accounts. You can find this key again and its corresponding public key under the folder `contract/bootstrapping`

Now you should see the key and accounts in the wallet. There should be the contract account `dfuseioice` and user accounts which we created during bootstrap.

### Signing With Anchor

#### Install Anchor

You should have the Anchor wallet installed from the prerequisites section. If not, go here to install: [release page](https://github.com/greymass/anchor/releases/tag/v1.0.2)

#### Connect to custom network

**1. Click on Setup Wallet**
**2. Click `+ Custom Blockchain`**
**3. Enter the following Information:**

```
Chain ID: df383d1cc33cbb9665538c604daac13706978566e17e5fd5f897eff68b88e1e4
Name of Blockchain: ice
Default node for this Blockchain: http://localhost:8080
```

**4. Check the box `This blockchain is a test network (TESTNET)`**

The network name can be changed. The API protocol, host, and port are specified in `dfuseeos` and is displayed when it launched. The ChainID is derived from the genesis state, and is specified in `dfuseeos`. You can also verify that it is indeed correct by running:

```
eosc get info
```

This will display the current chain info with chainID.

**4. Scroll down and save**

You'll now see a list of networks, scroll down to ICE, and select the checkbox next to it

**5. Click `Enable 1 Blockchains` button to enable it**

#### Import Key and Accounts

12. You should now see either your account, and select @active, or if you pasted in the above key, you will need to find your account and select the @active for it.
13. Enter your password and Authorize

**1. Go to the `Tools` tab in the menu**
**2. Click `Manage Keys` under the `Security` tab**
**3. Click `Import Keys`**
**4. Set a password for you wallet**
![password screenshot](image.png 'password screenshot')

**5. Paste in the development private key:**

```
5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
```

![import key screenshot](image.png 'import key screenshot')

This key was used to boot the chain and generate all accounts. You can find this key again and its corresponding public key under the folder `contract/bootstrapping`

**6. Go to the `Home` tab in the menu**
**7. Select to use the blockchain named `ice`**
**8. Click `Scan for Accounts`**
This will automatically detect the available accounts for you key on the `ice` network.

**9. Select the three active accounts for users**
**10. Click `Import Accounts`**
**11. Enter your password, and click `Enable app integrations`**

Now you should see the three user accounts in the wallet, their tokens and resources.

## 8. User Interface

In the cloned repo, go to the `web` folder. This is where the React fronend application lives. We have built a simple user interface to interact with the smart contract and display data from it. Run:

```sh
cd ../web
yarn install
yarn start
```

This will install the necessary dependencies for the application, compile it, and serve it from your terminal. After it's done, go to http://localhost:3000 on your web browser to see it in action.

**Keep this process running in a terminal throughout this tutorial**

## 9. Authentication

Now we can interact with our smart contract from the user interface.

**1. Click on the `Login` Button in the top right corner**
**2. Select the wallet you chose to use**
**3. For Scatter**

![login screenshot](image.png 'login screenshot')

- Select one of the user accounts, and use its active permission.
- Click `Allow`
- You are now signed in to the app

**4. For Anchor**

![login screenshot](image.png 'login screenshot')

- Click `Open Anchor App`
- Select one of the user accounts, and use its active permission
- Click `Unlock Wallet` in the bottom right
- Enter your password
- Click `Prove Identity` in the bottom right
- You are now signed in to the app

## 10. Using the Dapp

The application shows pools in a list. Click on `Select a pool` and select to view the `hackathon` pool.

We see three prepopulated ideas in the pool. You can click on any idea to expand and see its details.

![idea screenshot](image.png 'idea screenshot')

#### Casting Votes

To cast vote on an idea, select the score you want to assign to the three parameters (impact, confidence, and ease), then click confirm. You will be prompted by the wallet you chose to sign in with. Review the transaction data. We are calling the `castvote` method on the `dfuseioice` contract. The pool name, idea id, account name, and the vote scores you have entered are also displayed in the transaction.

Click sign transaction when you are ready.

![wallet signing screenshot](image.png 'signing screenshot')

Your transaction has been submitted, and the vote scores is automatically updated.

#### Adding Pools and Ideas

You can also add new Pools and Ideas.

Click on `Create a new pool` in the pool dropdown list, enter a pool name, and click `Create Pool`. Go through the transaction signing process in your wallet, and a new pool is added.

With a pool selected, click on `New Idea`. Enter a title and description, then click `OK`. Go through the transaction signing process in your wallet, and a new idea is added.

## 11. Application Code in Depth

Let's walk through how our frontend application is talking to the blockchain.

#### Authentication

Authentication is handled by EOSIO's [Universal Authenticator Library](https://github.com/EOSIO/universal-authenticator-library)

We set up the authenticator in `App.tsx` as a React context. We connec to http://localhost:13026 which is where the RPC endpoint of dfuse is served.

**App.tsx**

```ts
const iceNet = {
  chainId: process.env.REACT_APP_DFUSE_CHAIN_ID || '',
  rpcEndpoints: [
    {
      protocol: 'http',
      host: 'localhost',
      port: Number('13026'),
    },
  ],
};
```

We also set up two authenticators to use with our library. Scatter and Anchor both have prebuilt modules in the UAL library. You can also add other authenticators such as a ledger hardware wallet.

```ts
const appName = 'ICE';
const scatter = new Scatter([iceNet], { appName });
const anchor = new Anchor([iceNet], { appName });
```

Then entire application is then wrapped in the context provider, so we can access the prebuilt components to login and sign transactions anywhere in code.

```ts
<UALProvider
  chains={[iceNet]}
  authenticators={[scatter, anchor]}
  appName={appName}
>
  Our App...
</UALProvider>
```

The login and logout functions are used in `state/state.tsx`. We import the pre-built login modal and logout function from the UAL Context, and they can be used directly.

**state/state.tsx**

```ts
const { activeUser, logout, showModal } = useContext(UALContext);
...
const loginFunc: StateContextType['login'] = (): Promise<void> => {
  showModal();
  return Promise.resolve();
};

const logoutFunc: StateContextType['logout'] = (): Promise<void> => {
  logout();
  setLoggedIn(false);
  setAccountName('');
  return Promise.resolve();
};
```

We store and update the `loggedIn` state, `activeUser`, and both the login and logout functions in our application state, so they can be accessed from any component.

```ts
<StateContext.Provider
  value={{
    loggedIn,
    activeUser,
    login: loginFunc,
    logout: logoutFunc,
    ...
  }}
>
  {components...}
</StateContext.Provider>
```

In the header avatar, we use these states and functions to handle login and display the account name when an activeUser exists.

**components/ual/avatar.tsx**

```ts
const { activeUser, logout, login, accountName } = useAppState();

const onMenuClick = (event: ClickParam) => {
  const { key } = event;
  if (key === 'logout') {
    logout();
    return;
  }
};

if (activeUser === true) {
  return (
    <AvatarWrapper>
      <Button
        type='primary'
        shape='round'
        onClick={login}
        icon={<LoginOutlined />}
      >
        Login
      </Button>
    </AvatarWrapper>
  );
} else {
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <AvatarWrapper>
        <AntdAvatar size='small' icon={<UserOutlined />} alt='avatar' />
        <span>{accountName}</span>
      </AvatarWrapper>
    </HeaderDropdown>
  );
}
```

#### Reading Chain Data with dfuse

dfuse allows the app to read `StateTables` and listen to a stream of the latest transactions. We listen to this stream and filter for the three actions we are interested in (addpool, addidea, castvote).

We first set up a dfuse client. Since we are accessing a local development network, there is no need for a valid api Key. We pass a placeholder key with a `web_` prefix and `null://` as the auth URL. The default network endpoint is localhost:8080, which is where `dfuseeos` is serving its APIs. If you have changed this value when launching `dfuseeos`, also update it here.

**services/client.ts**

```ts
import { createDfuseClient, DfuseClient } from '@dfuse/client';
const client = createDfuseClient({
  apiKey: 'web_0123456789abcdef',
  authUrl: 'null://',
  network: 'localhost:8080',
  secure: false,
});
```

dfuse provides streaming of the latest transactions through a GraphQL endpoint.

The GraphQL API offers two types of requests, Queries and Subscriptions, allowing you to build flexible real-time applications.

You can find more information regarding GraphQL in the
[GraphQL Reference](https://docs.dfuse.io/guides/core-concepts/graphql/).

You can also refer to the dfuse GraphQL API here:
[dfuse GraphQL Reference](https://docs.dfuse.io/reference/eosio/graphql/)

To send a talk to the GraphQL endpoint, we first need to define our GraphQL query:

**services/stream.ts**

```graphql
`subscription  {
    searchTransactionsForward(query: "receiver:dfuseioice -action:transfer", lowBlockNum:${lastSeenBlock}) {
      cursor
      trace {
        matchingActions {
          name
          json
        }
      }
    }
}`;
```

With the above query, we are setting up a subscription to listen for transactions. The `query` parameter is a custom query language allowing us to search for the transactions that we are interested in.

```graphql
query: 'receiver:dfuseioice -action:transfer'
```

In this specific query, we are looking for transactions that are sent to the `dfuseioice` account, with an action that is NOT named `transfer`. This filters the results to only include transactions which invokes the `addpool, addidea, and castvote` actions on our contract.

You can find more examples of results you can search for here:
[Search Language Reference](https://docs.dfuse.io/reference/eosio/search-terms/)

```graphql
lowBlockNum:${lastSeenBlock}
```

We also pass the highest seen block number into our query, so we do not repeat searches on block ranges that we have visited.

```graphql
trace {
    matchingActions {
        name
        json
    }
}
```

Lastly, GraphQL allows us to specify the exact fields that we need. In our case, we are only interested in the name and json data in the actions.

Now that we have crafted our query, we can use the dfuse JS Client to send a graphql query and listen to the results.

```ts
  return dfuseClient.graphql(query(lastSeenBlock), (message, stream) => {
    ...
  }
```

When we receive message type `error`, we define how to handle the error.

```ts
if (message.type === 'error') {
  console.log('An error occurred', message.errors, message.terminal);
}
```

When we receive message type `data`, we go through the list of results and store the data that we need. They are the action `name`, `pool_name`, and `idea_id`.

```ts
if (message.type === 'data') {
  const data = message.data.searchTransactionsForward;
  const actions = data.trace.matchingActions;
  actions.forEach(({ name, json }: ActionTrace) => {
    const action: Action = {
      type: name,
      contextId: 1,
    };
    switch (name) {
      case 'addpool': {
        break;
      }
      case 'addidea': {
        action.contextId = json.pool_name;
        break;
      }
      case 'castvote': {
        action.contextId = json.idea_id;
        break;
      }
    }
    console.log('new action: ', name, json, action);
    setLastSeenAction(action);
  });
}
```

We also call the helper method `mark` on our stream to mark the latest block that we have searched in the chain, so they will not be searched anymore.

```ts
stream.mark({ cursor: data.cursor });
```

Instead of marking a block number, dfuse indexed blockchains provide a persistent cursor to represent locations in the chain. This is more reliable in a blockchain as production APIs are typically served by a group of load balanced nodes. Forks can happen in these nodes therefore block numbers are not always consistent in the same API.

You can learn more about our cursors here:
[All About Cursors](https://docs.dfuse.io/guides/core-concepts/cursors)
