# ICE with dfuse

## Tutorial parts:

1. Install dependencies dfuseeos, eosc, eosio.cdt
2. Run dfuseeos, show graphiql, eosq, dashboard
3. Explain boot chain script and bootseq.yaml, show how to do it in eosc commands, run it to boot and create needed users
4. Write smart contract
5. Compile, deploy smart contract with scripts, show how to do it with eosio.cdt
6. Test smart contract
7. Clone frontend, introduce it, go through what it does in general
8. Let user download scatter/anchor, explain how to connect to custom network, how to import their key and account
9. Show full working flow of app.
10. Go into code, Explain how dfuse client is set up,
11. how to listen to a stream
12. How to get state table
13. Explain how UAL works
14. Explain login logout with UAL and wallets
15. Explain code to sign and broadcast transactions

### Prerequisites

- `dfuseeos`
- `eosc (feature-dfuseos-boot branch)`
- `eosio.cdt`
- `node.js > v10`

### What it does

### Steps to run

1. Install dfuseeos from https://github.com/dfuse-io/dfuse-eosio

2. run dfuseeos
   `dfuseeos init` (only the first time)
   `dfuseeos purge && dfuseeos start`

3. go to `contract` folder of `ice`

4. boot chain and create the needed users
   `./boot.sh`

The [genesis.key](./genesis.key) and [genesis.pub](./genesis.pub) files contain the master key (genesis and eosio@active). That key is also available in eosc-vault.json (with an empty password) for your convenience.

- First, get [eosc](https://github.com/eoscanada/eosc)

- Execute the content of `bootseq.yaml`

  eosc -u http://localhost:8888 boot bootseq.yaml ## password is empty

- Do some transfers

  eosc -u http://localhost:8888 transfer eosio eosio2 20 ## password is empty

- Create an account

  eosc system newaccount eosio myaccount --auth-key EOS3245345....(your-public-key) --stake-cpu 10 --stake-net 10

- You can also get the chain ID which we will use to connect in wallets to connect to our custom network

  eosc -u http://localhost:8888 get info

5. compile `ice.wasm` and generate `ice.abi`
   `./compile.sh`

6. deploy compiled contracts `ice.wasm` and `ice.abi` to the chain
   `./deploy.sh`

7. Test smart contract by creating some pools, ideas and making users votes
   `./test.sh`

8. go to `web` folder of `ice`

9. install frontend dependencies
   `yarn install`

10. run frontend
    `yarn start`

11. visit `localhost:3000` on your browser to view

### Important files in frontend interacting with chain

- `App.tsx`

  - wraps everything in UALProvider with dfuse enabled chain, and two authenticators anchor and scatter

- `state/index.tsx`

  - sets up and provides stuff in the AppState Context
  - sets up two dfuse clients, one to listen to a stream forever, the other to be used by other components. **should be changed to only setting up one client and sharing it**
  - sets up login and logout functions for use by all componenets
  - handles tracking active logged in user
  - as blocks and actions are seen by the infinite stream, they are updated in the context

- `utils/trx.tsx`

  - transaction constructors that maps inputs to formats that can be passed to signTransaction
  - includes the following transactions: `addPool`, `addIdea`, and `castVote`

- `components/vote-list/vote-list.tsx`

  - `fetchVotes` function fetches the state table of account `dfuseioice`, idea.key as scope, and votes table.
  - all votes are then rendered and the user's vote is also recorded.

- `components/ual`

  - reads activeUser, logout and login functions from AppState context
  - renders a login button or user avatar in header

- `components/idea-list`

  - `fetchIdeas` reads state table of dfuseioice account, poolName as scope, ideas table
  - then renders ideas in a list

- `components/pool-selector`

  - `fetchPools` reads state table of contract account, account name as scope, pools table
  - `createPool` signs and broadcasts a transaction to add a pool
  - `poolRowForm` form to create pool
  - `handleCreatePool` form handler

- `components/new-idea`

  - `createIdea` signs and broadcasts a transaction to create an idea
  - also form and handler

## Signing With Scatter

#### Download Scatter 11.0.1

You will need the full version of scatter to add the custom local network. Download version 11.0.1 instead of version 12+ which is the simplified version.

If you don't have Scatter installed, grab the version for your platfrom from the [release page](https://github.com/GetScatter/ScatterDesktop/releases/tag/11.0.1).

Once installed, you'll need to create a passphrase for your wallet.

Once set up, click Networks in the left hand menu.
Add custom network and enter this info:
Name: ice
Host: ice-api.ngrok.io
Protocol: http
Port: 80
ChainID: df383d1cc33cbb9665538c604daac13706978566e17e5fd5f897eff68b88e1e4

Save the new network.

Now go to the Wallet tab in the menu.

If you already had your key within Scatter, you should see it listed there and now showing with your new account name under it, with the ice network in grey just below that.

If you didn't have your key in there, you will click on Import Key, and then click on Text.
Paste in third private key: 5HzgwhLGki33wTyiSoaK13tYfr5nV1UALDcXoQbHAtMJtM3qa8G (this is the standard development test key
used for EOSIO - corresponds to public key: EOS6BtgCcdChWGARLHHfBquwMx2pwUhrnBeaaB7QPuoBGFHKs32dd)

Within your browser, go to [ice.ngrok.io](ice.ngrok.io)
You are now good to go!

## Signing With Anchor

#### Download Anchor

If you don't have Anchor installed, grab the version for your platfrom from the [release page](https://github.com/greymass/anchor/releases/tag/v1.0.2).

1. Click on Get Started
2. Click `+ Custom Blockchain`
3. For Chain ID: df383d1cc33cbb9665538c604daac13706978566e17e5fd5f897eff68b88e1e4
4. Name of Blockchain: ICE
5. Default node for this blockchain: http://ice-api.ngrok.io
6. Scroll down and save
7. You'll now see a list of networks, scroll down to ICE, and select the checkbox next to it
8. Click `Enable 1 Blockchains` button that became blue
9. Go to tools >> security >> manage keys >> Import Key
10. It will ask you to set a password for Anchor now and then to confirm it
11. Paste in your private key if you have given a key to Josh already, otherwise, paste in: 5HzgwhLGki33wTyiSoaK13tYfr5nV1UALDcXoQbHAtMJtM3qa8G
12. You should now see either your account, and select @active, or if you pasted in the above key, you will need to find your account and select the @active for it.
13. Enter your password and Authorize

Within your browser, go to [ice.ngrok.io](ice.ngrok.io)
Click on Login in the top right corner
You are now good to go!
