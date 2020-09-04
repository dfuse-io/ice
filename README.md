# ICE Pools (powered by [dfuse for EOSIO](https://github.com/dfuse-io/dfuse-eosio))

## Overview
Going through the [ICE Pools Tutorial](TUTORIAL.md) will allow you to bootstrap a blockchain, deploy a smart contract, and run a cool React app called _ICE Pools_ to interact with your bootstrapped blockchain. This might seem a bit daunting at first but it will all be running from your laptop and in just a couple steps!

_**NOTE** - The **Windows OS** is not currently supported by `dfuse for EOSIO`, which is a requirement for ICE Pools._

## What is ICE Pools

ICE stands for Impact, Confidence, and Ease. When making business decisions, you often need to figure out what's the next "thing" you should spend your efforts on. You often have a "pool" or list of things to do, but wonder which one could have the most (I)mpact for your business. Or maybe you want to make sure that the team has (C)onfidence in this next item. Or maybe you simply want to tackle a bunch of short and (E)asy tasks to get the ball rolling. Whatever your thinking is, ICE Pools can help you make an informed decision on what that next step should be.

ICE Pools allows you to create different "pools" of ideas and let's the team vote on them. Everything happens on the blockchain so you know that the votes are legit. You can track pretty much everything, from the creation of a user account, to the changes in voting scores, to the date and time "x" event happened on the chain.

## Requirements

To successfully run ICE Pools, we assume that you have these tools already installed in your dev environment:

* Anchor Wallet v1.05 or higher ([installation](https://github.com/greymass/anchor))
* `yarn` v1.15 or higher ([installation](https://classic.yarnpkg.com/en/docs/install))
* `NodeJS` v14.0.1 or higher ([installation](https://nodejs.org/en/download/package-manager/))
* `dfuseeos` v0.1.0-beta6 or higher ([installation](https://github.com/dfuse-io/dfuse-eosio))
* `EOSIO.CDT` v1.7.0 or higher ([installation](https://github.com/EOSIO/eosio.cdt))

## Running ICE Pools

For the more experienced developers, here's the quick and dirty version of the tutorial to get _ICE Pools_ up and running in your browser. If you'd rather follow a step by step guide with explanations of what each step does, head over to the [TUTORIAL](TUTORIAL.md) page.

```
# Clone the 'ICE Pools' repo and move to the 'contract' folder
git clone https://github.com/dfuse-io/ice
cd ice/contract

# Compile the ICE smart contract from the 'contract' folder
./compile.sh
   
# Boot the chain and create users from the 'contract' folder
./boot.sh

# From a new terminal window, create some pools with ideas and random user votes from the 'contract' folder
./test.sh

# Move to the 'web' folder, install frontend dependencies & start the app
cd ../web
yarn install && yarn start
```

You should now be able to visit [localhost:3000](http://localhost:3000) in your browser to play with the app. For instructions about adding your bootstrapped blockcahin to the Anchor Wallet, as well as to login with Anchor and sign transactions, start at [3.11. Adding Our Custom Blockchain to the Wallet](TUTORIAL.md#311-adding-our-custom-blockchain-to-the-wallet) in the tutorial.

<!-- ## Overview - Repository Map

TODO -->

## Contributing

We welcome all contributions. Please refer to the `dfuse for EOSIO` [CONTRIBUTING](../../../dfuse-eosio//blob/develop/CONTRIBUTING.md) page for details on our Code of Conduct & processes for submitting pull requests, and the [CONVENTIONS](../../../dfuse-eosio//blob/develop/CONVENTIONS.md) page for our coding conventions. The same contribution and coding conventions apply to this project.

## License

[Apache 2.0](LICENSE)

## References

- [dfuse Docs](https://docs.dfuse.io)
- [dfuse on Telegram](https://t.me/dfuseAPI) - Community & Team Support
