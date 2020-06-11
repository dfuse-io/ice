# ICE with dfuse

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
