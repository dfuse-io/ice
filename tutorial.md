# ICE (Impact, Confidence, Ease)

#### Demo Idea List Dapp Built with dfuse for EOSIO

## Pre-requisites

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

You should have the Scatter wallet version 11.0.1 installed from the pre-requisites section. If not, go here to install: [release page](https://github.com/GetScatter/ScatterDesktop/releases/tag/11.0.1)

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

You should have the Anchor wallet installed from the pre-requisites section. If not, go here to install: [release page](https://github.com/greymass/anchor/releases/tag/v1.0.2)

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


