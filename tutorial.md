# ICE (Impact, Confidence, Ease)

#### List Dapp Demo Built with _dfuse for EOSIO_

<!-- - [I. Prerequisites](#prerequisites)
- [1. Running dfuse for EOSIO](#1-running-dfuse-for-eosio)
- [2. Bootstrap Testnet and Accounts](#2-bootstrap-testnet-and-accounts)
- [3. Write Smart Contract](#3-write-smart-contract)
- [4. Compile Smart Contract](#4-compile-smart-contract)
- [5. Deploy Smart Contract](#5-deploy-smart-contract)
- [6. Test Smart Contract](#6-test-smart-contract)
- [7. Set up Wallet](#7-set-up-wallet)
  - [Signing With Anchor](#signing-with-anchor)
    - [Install Anchor](#install-anchor)
    - [Connect to custom network](#connect-to-custom-network-1)
    - [Import Key and Accounts](#import-key-and-accounts)
- [8. User Interface](#8-user-interface)
- [9. Authentication](#9-authentication)
  - [For Anchor](#for-anchor)
- [10. Using the Dapp](#10-using-the-dapp)
  - [Casting Votes](#casting-votes)
  - [Adding Pools and Ideas](#adding-pools-and-ideas)
- [11. Frontend Authentication](#11-frontend-authentication)
- [12. Streaming Transaction Data with dfuse](#12-streaming-transaction-data-with-dfuse)
- [13. Reading Contract State Tables with dfuse](#13-reading-contract-state-tables-with-dfuse)
- [14. Calling Smart Contract Actions with UAL and Wallets](#14-calling-smart-contract-actions-with-ual-and-wallets)
- [II. Understanding the ICE Smart Contract](#ii-understanding-the-ice-smart-contract) -->

## Requirements

This tutorial assumes that you have basic programming knowledge and that you have these tools already installed in your dev environment:

* `EOSIO.CDT` 1.7.0 or higher ([installation](https://github.com/EOSIO/eosio.cdt#binary-releases))
* `Git` ([installation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
* `Go` 1.14 or higher ([installation](https://golang.org/doc/install#install))
* `NodeJS` 14.1.0 or higher ([installation](https://nodejs.org/en/download/package-manager/))
* `yarn` 1.15 or higher ([installation](https://classic.yarnpkg.com/en/docs/install))
* (_macOS_) Command Line Tools for Xcode ([installation](https://developer.apple.com/downloads/))


## 1. Cloning the ICE repo
The first step we need to take is obviously to clone this repo!

```
# clone the ICE repo
git clone https://github.com/dfuse-io/ice
```

## 2. Compiling the ICE Smart Contract

Next, we need to compile our smart contract in order to deploy it to our local testnet. We've provided a compile script for you in the `ice/contract` folder. We simply need to move inside the right folder and run the `compile.sh` file as such:

```
# move inside the contract folder and run compile.sh
cd ice/contract
./compile.sh
```

This script uses the `EOSIO.CDT` CLI tool (installed in [Requirements](#requirements) to compile our `ice.cpp` contract into `ice.wasm` and `ice.abi`. It is a very simple script that creates a `build` folder and stores the two compiled files in it. If you're looking to understand the smart contract and what it accomplishes, take a look at [Understanding the ICE Smart Contract](#understanding-the-ice-smart-contract) below.

Now that our smart contract is compiled, we're ready to install [_dfuse for EOSIO_](https://github.com/dfuse-io/dfuse-eosio) which will allow us to run an [EOSIO](https://eos.io/) testnet locally.

## 3. Installing _dfuse for EOSIO_

[dfuse](https://www.dfuse.io) is a massively scalable open-source platform for searching and processing blockchain data. dfuse for EOSIO includes all [dfuse services](https://dfuse.io/technology) for EOSIO, running locally or from a container, released as a single statically linked binary: `dfuseeos`.

The easiest way to get the `dfuseeos` binary is to download the latest stable tarball from the [Releases](https://github.com/dfuse-io/dfuse-eosio/releases/) page under the `Assets` section (right after each release notes). The next step assumes that you have extracted the content of the tarball and moved the `dfuseeos` binary to your `$GOPATH/bin` folder*.
  
If you'd rather install from source, take a look at the `dfuse-eosio` [install from source](https://github.com/dfuse-io/dfuse-eosio#from-source) guide. You do not need to create or initialize a chain with _dfuse for EOSIO_ at this time.

_*Your `$GOPATH` is where Go is installed. By default on macOS, your `$GOPATH` is `/Users/$USER/go` where `$USER` is your username. If you installed Go through [`Homebrew`](https://brew.sh/), your folder structure might be different._

## 4. Running dfuse for EOSIO

In order to run an EOSIO testnet, we must first bootstrap our local blockchain with system accounts. We also need to create a few accounts, delegate bandwidth, and fund them with tokens for our development needs. This is an important step to enable accounts to push feeless transactions. We've created a script that will automatically do all of these things for you. You can find it inside the `contract` folder (which you should be in because of [step #2](#compiling-the-ice-smart-contract):

```
# run boot.sh
./boot.sh
```

_**macOS** - If you get a prompt similar to `Do you want the application “dfuseeos” to accept incoming network connections?`, you should select `allow` as `dfuseeos` needs to accept connections from your local environment._

This script reads from the config file at `contract/bootstrapping/bootseq.yaml` to execute operations on our testnet. In the `bootseq.yaml` file, we define the operations to perform on our chain. In this case, we create the system accounts for EOSIO contracts, and deploy them. We also create 4 accounts: one account named `dfuseioice` which is where we will deploy our smart contract, and three accounts named `user(1,2,3)` for us to use. These accounts are also delegated cpu and net, and are transferred tokens. The script also handles deploying the compiled ice smart contract to the `dfuseioice` account.

A successful `dfuseeos` start will list the launching applications as well as the graphical interfaces with their relevant links:

```
Dashboard:        http://localhost:8081
Explorer & APIs:  http://localhost:8080
GraphiQL:         http://localhost:8080/graphiql
```

You now have a fully bootstrapped EOSIO chain, with a `dfuseioice` account and smart contract deployed, as well as three user accounts to use.

**Please note you should leave process running in a terminal throughout this tutorial**

## 6. Test Smart Contract

We can test the smart contract by creating some pools, ideas and casting users votes. In a new terminal, run:

```
./test.sh
```

## 7. Install Anchor Wallet
Now is the time to install the Anchor Wallet, which will allow us to validate our identity. You can grab the latest stable version of the Anchor Wallet at https://github.com/greymass/anchor

## 8. Adding our Custom Blockchain to the Wallet

Once you have the wallet installed, follow these simple steps to add our ICE blockchain to the wallet interface:

1. **Open the Anchor Wallet app**
2. **Click on `Setup New Wallet`**
3. **Click `+ Custom Blockchain`**
4. **Enter the following Information:**
```
Chain ID: df383d1cc33cbb9665538c604daac13706978566e17e5fd5f897eff68b88e1e4
Name of Blockchain: ice
Default node for this Blockchain: http://localhost:8080
```
5. **Skip the Advanced Configuration section**
6. **Check the box `This blockchain is a test network (TESTNET).`**
7. **Scroll down and save**

The network name can be changed. The API protocol, host, and port are specified in `dfuseeos` and is displayed when it launched. The ChainID is derived from the genesis state, and is specified in `dfuseeos`. You can also verify that it is indeed correct by running:

```
eosc get info
```

This will display the current chain info with chainID.

You'll now see a list of networks, scroll down to ICE, and select the checkbox next to it

8. **Go back up and Click `Enable 1 blockchains` to connect**

## 8. Import Key and Accounts in Anchor Wallet

1. **Go to the `Tools` tab in the left side menu**
2. **Click `Manage Keys` under the `Security` tab**
3. **Click `+ Import Key`**
4. **Set a password for you wallet**
5. **Confirm your password**

![password screenshot](image.png 'password screenshot')

5. **Paste in the development private key and click `Save Keys to Wallet`**

```
5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
```

![import key screenshot](image.png 'import key screenshot')

This key was used to boot the chain and generate all accounts. You can find this key again and its corresponding public key under the folder `contract/bootstrapping` 

6. **re-enter your wallet password (the one you just created) and click `authorize`**
6. **Go to the `Home` tab in the menu**

7. **Select the blockchain card named `ICE`**

8. **Click `Scan for Accounts`**

This will automatically detect the available accounts for you key on the `ICE` network.

9. **Select the three active accounts for users (user1@active, user2@active, user3@active)**

10. **Click `+ Import Accounts`**

11. **Enter your password, authorize, and click `Yes, enable app integrations`**

Now you should see the three user accounts in the wallet, with their tokens and resources.

## 9. Start the ICE App

In the cloned repo, go to the `web` folder. This is where the React frontend application lives. We have built a simple user interface to interact with the smart contract and display data from it. Run:

```
# move to the web folder, install dependencies & start the app
cd ../web
yarn install && yarn start
```

This will install the necessary dependencies for the application, compile it, and serve it from your terminal. Please bear with the yarn process as it might take some time to serve the app. After it's done, go to http://localhost:3000 on your web browser to see it in action.

Do you want the application “node” to accept incoming network connections? -> yes

**Keep this process running in a terminal throughout this tutorial**

## 10. Login the ICE app

Now we can interact with our smart contract from the user interface.

1. **Click on the `Login` Button**

2. **Select the Anchor wallet**

![login screenshot](image.png 'login screenshot')

- Click `Open Anchor App`
- Select one of the user accounts, and use its active permission
- Click `Unlock Wallet` in the bottom right
- Enter your password
- Click `Prove Identity` in the bottom right
- You are now signed in to the app

** NOTE** - If your console is throwing an error similar to `WebSocket connection to 'wss://cb.anchor.link/064236d4-9bcc-4a93-89ff-c65acabda3e5' failed: Unknown reason` when you're trying to login through Anchor, one of your browser extensions is most likely blocking the connection. Try to disable them or try a different browser.

## 11. Using the Dapp

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

Whenver a new pool, idea, or vote is made, you can see the transaction on account page of our block explorer.

http://localhost:8080/account/dfuseioice

## 12. Frontend Authentication

Let's walk through how our frontend application is talking to the blockchain.

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

Anchor has a prebuilt module in the UAL library. You can also add other authenticators such as a ledger hardware wallet.

```ts
const appName = 'ICE';
const anchor = new Anchor([iceNet], { appName });
```

Then entire application is then wrapped in the context provider, so we can access the prebuilt components to login and sign transactions anywhere in code.

```ts
<UALProvider
  chains={[iceNet]}
  authenticators={[anchor]}
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

## 13. Streaming Transaction Data with dfuse

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
subscription  {
    searchTransactionsForward(query: "receiver:dfuseioice -action:transfer", lowBlockNum:${lastSeenBlock}) {
      cursor
      trace {
        matchingActions {
          name
          json
        }
      }
    }
}
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
dfuseClient.graphql(query(lastSeenBlock), (message, stream) => {...}
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

With the help of dfuse stream, we are constantly listening for new transactions that call the three actions of our smart contract. When any of them is called, the frontend application will automatically update. This provides a seemless user experience that is unique to the dfuse APIs.

## 14. Reading Contract State Tables with dfuse

State Tables are the persistent storage in smart contracts on an EOSIO blockchain. In our ICE smart contract, we created 4 tables, Pools, Ideas, Votes, and Stats. Our frontend application will be reading the first three tables with the help of dfuse.

The code for reading tables are located in the `services` folder. Each file of `pool, idea, vote` contains the function to read its table.

**services/pool.ts**

```ts
export const fetchPools = async (
  dfuseClient: DfuseClient,
  contractAccount: string
) => {
  return dfuseClient.stateTable<PoolRow>(
    contractAccount,
    contractAccount,
    'pools'
  );
};
```

This function calls the `stateTable` method of the dfuse JS client. It passes the `PoolRow` type which defines the table schema that we are expecting. This type should be the same as the `pool_row` struct in our smart contract.

**types.ts**

```ts
export interface PoolRow {
  pool_name: string;
  author: string;
}
```

**ice.hpp**

```cpp
struct [[eosio::table]] pool_row {
    name pool_name;
    name author;
}
```

The `stateTable` method takes three parameters: `account, scope, table`. We use the contractAccount as the account name. The scope should also be the contractAccount since we are looking for the global scope that returns all results. Lastly, we use `'pools'` as the table name.

```ts
const handleFetchPools = (poolsResult) => {
  const poolRows: PoolRow[] = [];
  poolsResult.rows.forEach((r) => {
    if (r.json) {
      const pool: PoolRow = r.json;
      poolRows.push(pool);
    }
  });
  setPools(poolRows);
};
```

The result can be easily mapped to a format that we require. The result rows each have a `json` field which can be parsed into a `JavaScript Object`

The process to read the `ideas` and `votes` tables is very similar. We define the table schema, pass in the `contract, scope, table` parameters, and parse the results.

To fetch ideas, we only want to get the ideas under a selected pool. In this case, we use `poolName` as the scope.

**services/idea.ts**

```ts
export const fetchIdeas = async (
  dfuseClient: DfuseClient,
  contractAccount: string,
  poolName: string
) => {
  return dfuseClient.stateTable<IdeaRow>(contractAccount, poolName, 'ideas');
};
```

To fetch votes, we only want to get the votes for a specific idea. In this case, we use `idea.key` as the scope.

**services/vote.ts**

```ts
export const fetchVotes = async (
  dfuseClient: DfuseClient,
  contractAccount: string,
  idea: IdeaRow
) => {
  return dfuseClient.stateTable<VoteRow>(contractAccount, idea.key, 'votes');
};
```

## 15. Calling Smart Contract Actions with UAL and Wallets

To add pools, ideas, and cast votes, we need to call the actions on the smart contract. After a user signs in with their wallet, they can use the `activeUser` from the `UAL` library to sign and broadcast transactions. Each file of `pool, idea, vote` contains the funciton to add a pool, idea, or vote.

We first take the inputs for the transaction, and construct a transaction object that can be understood by the Blockchain.

**services/pool.ts**

```ts
export const addPoolTrx = (
  contractAccount: string,
  accountName: string,
  poolRow: PoolRowForm
) => {
  return {
    actions: [
      {
        account: contractAccount,
        name: 'addpool',
        authorization: [
          {
            actor: accountName,
            permission: 'active',
          },
        ],
        data: {
          author: accountName,
          name: poolRow.name,
        },
      },
    ],
  };
};
```

We then sign this transaction with the active user's account, and broadcast it to the local blockchain.

```ts
export const createPool = async (
  activeUser: any,
  contractAccount: string,
  accountName: string,
  pool: PoolRowForm
): Promise<PoolRow> => {
  await activeUser.signTransaction(
    addPoolTrx(contractAccount, accountName, pool),
    { broadcast: true }
  );
  return { pool_name: pool.name } as PoolRow;
};
```

With the help of the `UAL` library, all other interactions are abstracted away. The component will automatically handle requesting approval from the wallet.

## Understanding the ICE Smart Contract

The ICE smart contract needs to accomplish the following:

- **_Ability to create a pool with name_** (each pool holds a set of ideas)
- **_Ability to add one idea at a time to a pool. Each idea has a title and description_**
- **_Ability to cast vote on a specific idea. Each vote contains number scores for three criteria: impact (of the idea), confidence (on the impact and cost), and ease (of implementation, where 1 is very expensive and 10 is a no brainer)._**

We have provided the ICE smart contract in the cloned repo. The contract contains 4 tables for pools, ideas, votes, and stats. It also has three actions to add pool, add idea, and cast vote. The full code can be viewed in `contract/src`. Here are the tables and actions that we will be accessing externally:

- Three actions to add pool, add idea, and cast vote:

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
