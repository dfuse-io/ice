### Development

#### Prerequisites

For development, you need to have `dfuse-eosio` running on your machine
executing the EOS blockchain by configuring a local environment. Follow the 
instructions at https://github.com/dfuse-io/dfuse-eosio to get started. Once 
you have a local `dfuse-eosio` running continue on.

#### Preparation

We must first bootstrap our local `dfuse-eosio` testnet, run the `boostrap.sh` script.

```shell script
./boostrap.sh
```

#### Building & Testing
Building the SmartContract ABI and code to WAST is performed through
the `eosiocpp` command line utility. Navigate to the root folder
of this project and then issue:

#### TODO 
dfuse-eosio init --with-bootstrap
Add a faucet in the dashboard

