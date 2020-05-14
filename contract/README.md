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

```
eosio-cpp ./src/ice.cpp -o ./build/ice.wasm
```

To deploy the contract on chain run 
```
deploy.sh
```

Lastly  run the test script to start interacting with the smart contract. 
```
test.sh
```

The test script will: 

- Create a `hackathon` pool
- Create an idea with description *Ship It!* in the `hackathon`
- Vote for the idea from `dfuseioice` account (created in the boostrapping phase)
- Vote for the idea from `marc` account (created in the boostrapping phase)
- Vote for the idea from `alex` account (created in the boostrapping phase)
- Update `marc`'s vote 

You can view the results of the test on `eosq`

[view the transactions](http://localhost:8080/account/dfuseioice/transactions)
[view the created pool](http://localhost:8080/account/dfuseioice/tables?scope=dfuseioice&tableName=pools)
[view the created idea](http://localhost:8080/account/dfuseioice/tables)
[view marc's vote](http://localhost:8080/account/dfuseioice/tables?scope=marc&tableName=votes)
[view marc's vote](http://localhost:8080/account/dfuseioice/tables?scope=marc&tableName=votes)

### Notes
- Currently the `reset` action only clear the `dfuseioice` scope for the tables, thus it will not erase the votes per voter