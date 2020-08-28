# ICE Pools (powered by [dfuse for EOSIO](https://github.com/dfuse-io/dfuse-eosio))

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

## Running ICE Pools

This tutorial is a step by step guide on how to get ICE Pools up and running in your browser where we take our time to go over each step and explain what some of the code does. We're also going to show you how to interact with the app once it's up and running.

If you're an experienced developer and you're looking for a faster way to get up and running with ICE Pools, take a look at the [Running ICE Pools](https://github.com/dfuse-io/ice/blob/master/README.md#running-ice-pools) section in the [README](https://github.com/dfuse-io/ice/blob/master/README.md).

## Requirements

This tutorial assumes that you have basic programming knowledge and that you have these tools already installed in your dev environment (or follow the `installation` links to install them).

* `EOSIO.CDT` v1.7.0 or higher ([installation](https://github.com/EOSIO/eosio.cdt#binary-releases))
* `Git` ([installation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
* `Go` v1.14 or higher ([installation](https://golang.org/doc/install#install))
* `NodeJS` v14.0.1 or higher ([installation](https://nodejs.org/en/download/package-manager/))
* `yarn` v1.15 or higher ([installation](https://classic.yarnpkg.com/en/docs/install))
* (_For macOS_) Command Line Tools for Xcode ([installation](https://developer.apple.com/downloads/))

_**NOTE** - The Windows OS is not currently supported by `dfuse for EOSIO`, which is required by ICE Pools._


## Cloning the ICE repo
The first step we need to take is obviously to clone this repo! Open a terminal window and `git clone` the repo:

```
# clone the ICE Pools repo
git clone https://github.com/dfuse-io/ice
```

## Compiling the ICE Smart Contract

Once we have the repo cloned to our dev environment, the first thing we want to do is to compile our smart contract in order to deploy it to our local testnet. We've provided a couple bash scripts to make this demo easier. You can find them all int the `/contract` folder. To compile our smart contract, we simply need to move inside the `contract` folder and run the `compile.sh` file:

```
# move inside the contract folder and run compile.sh
cd ice/contract
./compile.sh
```

The `compile.sh` script uses the `EOSIO.CDT` CLI tool (installed in [Requirements](#requirements)) to compile our `ice.cpp` contract into `ice.wasm` and `ice.abi`. It is a very simple script that creates a `build` folder inside the `bootstrapping` folder and stores the two compiled files (`ice.wasm` and `ice.abi`) in it. If you're looking to understand what's inside the smart contract and what it actually accomplishes, take a look at [Understanding the ICE Smart Contract](#understanding-the-ice-smart-contract) at the bottom of this tutorial.

Now that our smart contract is compiled, we're ready to install [_dfuse for EOSIO_](https://github.com/dfuse-io/dfuse-eosio) which will allow us to run an [EOSIO](https://eos.io/) testnet locally.

## Installing _dfuse for EOSIO_

[dfuse](https://www.dfuse.io) is a massively scalable open-source platform for searching and processing blockchain data. dfuse for EOSIO includes all [dfuse services](https://dfuse.io/technology) for EOSIO as a single statically linked binary: `dfuseeos`. You can easily run `dfuseeos` locally or from a container.

The easiest way to get the `dfuseeos` binary is to download the latest stable version in a tarball (files that have been packed into a tar file like `*.tar.gz`) from the [Releases](https://github.com/dfuse-io/dfuse-eosio/releases/) page under the `Assets` section (after each release notes, you will find the `Assets` section).

Once you have downloaded the right file for your OS, extract its content and move the `dfuseeos` binary inside your `$GOPATH/bin` folder*.
  
If you'd rather install _dfuse for EOSIO_ from source, take a look at the `dfuse-eosio` [install from source](https://github.com/dfuse-io/dfuse-eosio#from-source) guide but be advised it's a longer process. If you do decide to install from source, you do not need to create or initialize a chain with _dfuse for EOSIO_ at this time. More about that later.

_*Your `$GOPATH` is where Go is installed on your system. By default, on macOS, your `$GOPATH` is `/Users/$USER/go` where `$USER` is your username. If you installed `Go` through [`Homebrew`](https://brew.sh/), your folder structure will be different._

## Bootstrapping our Local Blockchain

In order to run an EOSIO testnet, we must first bootstrap our local blockchain with system accounts. We also need to create a few accounts, delegate bandwidth, and fund accounts with tokens for our development needs. This is an important step to enable accounts to push feeless transactions.
 
Your terminal window should already be in the `contract` folder because of [step #2](#compiling-the-ice-smart-contract), so all we need to do is run the `boot.sh` script that will automate all of the account creation and funding process. `boot.sh` will also initialze _dfuse for EOSIO_ for us, purge it (clean start), and then start it.

```
# run boot.sh
./boot.sh
```

_**For macOS** - If you get a prompt similar to `Do you want the application “dfuseeos” to accept incoming network connections?`, you should select `allow` as `dfuseeos` needs to accept connections from your local environment._

`boot.sh` reads from the config file at `contract/bootstrapping/bootseq.yaml` to execute operations on our testnet. In the `bootseq.yaml` file, we define the operations to perform on our chain. In this case, we create the system accounts for EOSIO contracts and deploy them. We also create 4 accounts: one account named `dfuse.ice` which is where we will deploy our smart contract, and three accounts named `msdelisle`, `mrkauffman`, and `theboss` with tokens for us to use. These accounts are also delegated [CPU](https://developers.eos.io/welcome/latest/overview/core_concepts/#cpu), [NET](https://developers.eos.io/welcome/latest/overview/core_concepts/#network-net), and [RAM](https://developers.eos.io/welcome/latest/overview/core_concepts/#ram). The script also handles deploying the compiled ICE smart contract to the `dfuse.ice` account.

A successful `dfuseeos` start by `boot.sh` will list the _dfuse for EOSIO_ applications that were launched with their relevant links. We don't need those for now, but it's nice to know they will be there when we need them.

```
Dashboard:        http://localhost:8081

Explorer & APIs:  http://localhost:8080
GraphiQL:         http://localhost:8080/graphiql
```

Congrats! You now have a fully bootstrapped EOSIO chain, with a `dfuse.ice` account, a smart contract deployed, as well as three user accounts to use.

**Please note that you need to leave this process running in the terminal throughout this tutorial**

## Testing our Smart Contract

Let's test our smart contract by creating some pools to contain ideas, add ideas to pools and cast random user votes on these new ideas.

In a **new** (that's important) terminal window, run `test.sh` from the `contract` folder:

```
./test.sh
```

`test.sh` created 2 pools using the `dfuse.ice` account. We have the `new.feature` pool and the `hackathon` pool. Inside each pool, we've had users add ideas for new features they believe should be next on the roadmap, and hackathon ideas that they'd like to work on. Once those were added, we've had users (remember `msdelisle`, `mrkauffman`, and `theboss`?) vote random values on different ideas for the purpose of this tutorial.  Now we'll want to see these pools in action, the ideas, and the votes in an app with an actual user interface. That's in the next step.

[::TODO::] maybe in the ice tutorial, adding the step that I told you (ex: search for action:setcode or action:createaccount etc. in eosq webpage) so the user gets used to looking at the explorer, opening the contract page, looking at all this with a tab open on your contract page (with latest transactions), you would have seen right away what was wrong (404 account not found or whatever)
         
## Starting the ICE Pools App

We're going to move out of the `contract` folder and go to the `web` folder. This is where the React frontend application lives. We have built a simple UI to interact with the smart contract and display data from it. We'll then install the necessary dependencies for the application, compile it, and serve it from your terminal with `yarn`.

```
# move to the web folder, install dependencies & start the app
cd ../web
yarn install && yarn start
```

Please bear with the yarn process as it might take some time to serve the app. You should automatically get a new tab opened in your browser that's pointing to `localhost:3000`. It will automatically serve the app once you see `Compiled successfully! You can now view web in the browser.` in your terminal window.

 If you didn't get a new tab, open a new one manually and go to [localhost:3000](http://localhost:3000/) to see the app in action.

**NOTE** - If you receive a warning asking you if you want the application “node” to accept incoming network connections, answer `yes`.

**Please also note that you need to leave this process running in the terminal throughout this tutorial**

## Browsing the ICE Pools app

Because you're not logged in yet, we can only see the pools and the ideas that have been casted so far. The app shows all the available pools in a dropdown list at the top. Click on `Select a pool` and select the `hackathon` pool.

You should see 4 pre-populated ideas in the `hackathon` pool. You can click on any idea title to expand it and see the votes that were casted with their scores.

![idea screenshot](image.png 'idea screenshot')

It's al lfun and games, but we'll want to be able to create new pools, add new ideas and possibly edit previous votes as a valid user. To do so, we need to be logged in to have the right permissions. The authorization process will be done through the usage of a wallet called Anchor.

## Installing the Anchor Wallet

The [Anchor Wallet](https://greymass.com/en/anchor/) is an EOSIO Wallet and Authenticator released by the [Greymass](https://greymass.com/en) team. Installing the Anchor Wallet will allow us to validate our identity as a valid user. You can grab the latest stable version of the Anchor Wallet for your OS from https://greymass.com/en/anchor/ and install it. Once that is done, it's time to setup the wallet with our local bootstrapped blockchain.

## Adding our Custom Blockchain to the Wallet

This step assumes that this is a brand new Anchor Wallet installation. Once you have the wallet installed, follow these simple steps to add our local blockchain to the wallet interface:

1. Open the Anchor Wallet app
2. Select `Setup New Wallet` on the welcome screen
3. Select `Custom Blockchain` on the next screen
4. Then, enter the following Information:
```
Chain ID:                           df383d1cc33cbb9665538c604daac13706978566e17e5fd5f897eff68b88e1e4
Name of Blockchain:                 ICE
Default node for this Blockchain:   http://localhost:8080
```
5. Skip the `Advanced Configuration` section
6. Check the box `This blockchain is a test network (TESTNET).`
7. Select `Save`

The network name we used (`ICE`) can be changed later. The blockchain host and the port are specified by `dfuseeos` and displayed at launched. The `Chain ID` is derived from the genesis state, and is also specified by `dfuseeos`. You can verify that it is indeed correct by running `eosc get info` in a new terminal window.

```
eosc get info
```

[`eosc`](https://eosc.app/) is a flexible & powerful command line tool to interact with an EOSIO chain. Running `get info` will display the current chain info. What we're looking for in this case is to confirm the `chain_id`.

## Importing Key Pairs in the Wallet

Now that we've added our new chain to the wallet, we'll want to use it to import keys and accounts inside the wallet. We can do that from the `Which blockchains do you plan on using?` screen, which you should be on after saving your custom blockchain. On that screen, look for the `testnet` labels and scroll down to the `ICE` blockchain. Once you find it, select the checkbox next to it. Now, go back up and select `Enable 1 blockchains`. Once you've selected the ICE blockchain, follow these next steps to import our key to the wallet:

1. Select `Tools` from the left-side menu
2. Under the `Security` table, select `Manage Keys`
3. Select `Import Key`
4. Set a password for you wallet
5. Re-enter the same password to confirm
6. Paste in the development private key (also specified by `dfuseeos`)
```
5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
```
_This key was used to boot the chain and generate all accounts. You can find this key again and its corresponding public key inside the `contract/bootstrapping` folder._
7. Select `Save Keys to Wallet`
8. Enter your wallet password (the one you just created on step 4.)
9. Select `Authorize`

And voilà! Your key is now saved inside the wallet. Time to look for accounts on your chain and add them to the wallet.

## Importing Accounts in the Wallet

1. Select `Home` from the left-side menu
2. Select the blockchain card named `ICE`
3. Select `Scan for Accounts`
_This will automatically detect the available accounts for you key on the `ICE` network._
4. Select the three _active_ user accounts (`mrkauffman@active`, `msdelisle@active`, `theboss@active`)
5. Select `Import Accounts` at the bottom of the window
6. Enter your wallet password (the one you created on step 4. of `Importing Key Pairs in the Wallet`)
7. Select `Authorize`
8. Select `Yes, enable app integrations`

You should now see the three user accounts in the wallet, with their tokens and resources. Using these accounts, we'll use the wallet to authorize our login in the ICE Pools app.

## Logging in the ICE Pools app

To interact with our smart contract from the user interface, we need to log into the app with a valid user account. The good news is, it's a really easy process:

1. Back in your browser window pointing to `localhost:3000`, click on the `Login` button
2. Select `Anchor`
![login screenshot](image.png 'login screenshot')
3. Select `Open Anchor app` - _this should open a "Signing Request" window from Anchor_
4. Select one of the 3 user accounts from the dropdown list
5. Select `Unlock Wallet + Sign` in the bottom right
6. Enter your wallet password
7. Select `Authorize`

Congratulations! You are now signed in as a valid user.

_**NOTE** - If you can't login or if your console is throwing an error similar to `WebSocket connection to 'wss://cb.anchor.link/064236d4-9bcc-4a93-89ff-c65acabda3e5' failed: Unknown reason` when you're trying to login through Anchor, one of your browser extensions is most likely blocking the connection. Try to disable them (Incognito sometimes doesn't work as intended) or try in a different browser._

#### Adding Pools and Ideas

You can now add new pools and ideas, or even edit a past vote that your user made on an idea.

From the pool dropdown list, click on `Create a new pool!`, enter a pool name* (you are limited to 13 alphanumeric characters) in the dropdown that became an input, and click `Create Pool`. You have to go through a similar "Signing Request" from Anchor as when you first logged in. The goal here is to confirm the data you're submitting to the chain. Select `Sign Transaction` from that window.

Once you are presented with the `Transaction Submitted` window, you can safely close that window and go back to your app in the browser. With the new pool now created, there's a new button next to the select dropdown called `New Idea`. Why don't we try it?

Select `New Idea` and enter a title and a description, then click `OK`. You should get another "Signing Request" from Anchor to validate the data being submitted once again. Just like before, select `Sign Transaction` from that window. You can close the window once you get the `Transaction Submitted` notification.

Whenever a new pool, idea, or vote is submitted, you can see the transaction on the account page of our block explorer eosq. Do you remember this?

```
Dashboard:        http://localhost:8081

Explorer & APIs:  http://localhost:8080
GraphiQL:         http://localhost:8080/graphiql
```

We're going to use our Explorer (which is our local version of eosq) and go to the account page of `dfuse.ice` at http://localhost:8080/account/dfuse.ice

_*Note that you are limited to 12 characters [a-z], [1-5] or 13 characters if the final character is between [a-j] for the pool name.

#### Casting Votes

To cast vote on an idea, select the score you want to assign to the three parameters (impact, confidence, and ease), then click confirm. You will be prompted by the wallet you chose to sign in with. Review the transaction data. We are calling the `castvote` method on the `dfuse.ice` contract. The pool name, idea id, account name, and the vote scores you have entered are also displayed in the transaction.

Click sign transaction when you are ready.

![wallet signing screenshot](image.png 'signing screenshot')

Your transaction has been submitted and the vote scores are automatically updated.


## Frontend Authentication

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

## Streaming Transaction Data with dfuse

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
    searchTransactionsForward(query: "receiver:dfuse.ice -action:transfer", lowBlockNum:${lastSeenBlock}) {
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
query: 'receiver:dfuse.ice -action:transfer'
```

In this specific query, we are looking for transactions that are sent to the `dfuse.ice` account, with an action that is NOT named `transfer`. This filters the results to only include transactions which invokes the `addpool, addidea, and castvote` actions on our contract.

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

## Reading Contract State Tables with dfuse

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

## Calling Smart Contract Actions with UAL and Wallets

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
