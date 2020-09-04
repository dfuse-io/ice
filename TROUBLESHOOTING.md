# ICE Pools (powered by [dfuse for EOSIO](https://github.com/dfuse-io/dfuse-eosio))<!-- omit in toc -->

## Troubleshooting Table of Content<!-- omit in toc -->
- [1. Requirements](#1-requirements)
  - [1.1. Installing Homebrew](#11-installing-homebrew)
  - [1.2. Installing `yarn`](#12-installing-yarn)
  - [1.3. Installing `Node.js`](#13-installing-nodejs)
  - [1.4. Installing `EOSIO.CDT`](#14-installing-eosiocdt)
  - [1.5. Installing `eosc`](#15-installing-eosc)
  - [1.6. (_For macOS_) Installing Command Line Tools for Xcode](#16-for-macos-installing-command-line-tools-for-xcode)
  - [1.7. env: node: No such file or directory](#17-env-node-no-such-file-or-directory)
- [2. `dfuseeos`](#2-dfuseeos)
  - [2.1. Find your $GOPATH](#21-find-your-gopath)
  - [2.2. Accept incoming network connections](#22-accept-incoming-network-connections)
  - [2.3. Error pushing transaction](#23-error-pushing-transaction)
- [3. Anchor](#3-anchor)
  - [3.1. Blockchain not configured](#31-blockchain-not-configured)
  - [3.2. Can't login using the Anchor Wallet](#32-cant-login-using-the-anchor-wallet)
  - [3.3. Verifying the Chain ID](#33-verifying-the-chain-id)
- [4. Pool name restrictions](#4-pool-name-restrictions)
- [Can't find a solution?](#cant-find-a-solution)

## 1. Requirements
We're going to use Homebrew to install most of the requirements. [Homebrew](https://brew.sh/) is a package manager for macOS (or Linux). 

### 1.1. Installing Homebrew
To install Homebrew, run this command in your terminal:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```
_If you run into issues installing Homebrew, take a look at their [documentation](https://docs.brew.sh/) page._

### 1.2. Installing `yarn`
Once we have Homebrew installed, install `yarn` by running this command from your terminal window:
```
brew install yarn
```
_If you run into issues installing yarn, take a look at their [installation instructions](https://classic.yarnpkg.com/en/docs/install) page._

### 1.3. Installing `Node.js`
`Node.js` should've been installed automatically with `yarn` as a dependency. To make sure that's the case, run this command:
```
node -v
```
If it returns something like `v14.0.1`, skip to [3.1.4. Installing `EOSIO.CDT`](#314-installing-eosiocdt). If not, you can run this from your terminal window:
```
brew install node
```
_If you run into issues installing `Node.js`, take a look at their [installation instructions](https://nodejs.org/en/download/package-manager/) page._

### 1.4. Installing `EOSIO.CDT`
To install `EOSIO.CDT`, simply run these 2 commands from your terminal window:
```
brew tap eosio/eosio.cdt
brew install eosio.cdt
```
_If you run into issues installing `EOSIO.CDT`, take a look at their [repository README](https://github.com/EOSIO/eosio.cdt)._

### 1.5. Installing `eosc`
Install `eosc` by running this command from your terminal window:
```
brew install eoscanada/tap/eosc
```
_If you run into issues installing `eosc`, take a look at their [repository README](https://github.com/eoscanada/eosc)._

### 1.6. (_For macOS_) Installing Command Line Tools for Xcode
If you're on macOS, you can run this command to see if you have the CLT installed:
```
xcode-select -p
```
If it returns something like `/Library/Developer/CommandLineTools`, you're good to go. If not, you might need to install it. You will need to download it from the [Downloads](https://developer.apple.com/downloads/) section of the Apple Developers website. Open an Apple Developer account if you don't already have one and [find the latest stable release of the Command Line Tools for Xcode](https://developer.apple.com/download/more/?Search%20Downloads=command%20line%20tools) supported by your system. Download it and install it.

### 1.7. env: node: No such file or directory
Make sure that [`Node.js` is installed](#13-installing-nodejs).

## 2. `dfuseeos`

### 2.1. Find your $GOPATH
Your `$GOPATH` is where Go is installed on your system. By default, on macOS, your `$GOPATH` is `/Users/$USER/go` where `$USER` is your username. If you installed `Go` through [`Homebrew`](https://brew.sh/), your folder structure will be different so you might need to do [some research](https://www.google.com/search?q=homebrew+gopath).

### 2.2. Accept incoming network connections
It is important to allow `dfuseeos` to accept incoming network connections if we want to be able to login and sign transactions with the Anchor Wallet.

If you don't get a prompt to allow `dfuseeos` to accept incoming network connections, make sure that your macOS Firewall is `On` and that `dfuseeos` is already added to your list of apps allowed to receive incoming connections.

To do so, open the Firewall tab of from the Security & Privacy pane (shortcut: `open "x-apple.systempreferences:com.apple.preference.security?Firewall"`). If your Firewall is `Off`, click the lock at the bottom left to authenticate as an authorized user and then click on `Turn On Firewall`. Once it's `On`, click on the `Firewall Options...` button and look for `dfuseeos` in the list of apps. If you can't find `dfuseeos` or if you don't see any apps, click on the `+` sign and search for `dfuseeos`. Once you find it, select it and click on `Add`. You should now see the `dfuseeos` app with a green circle.

### 2.3. Error pushing transaction
If you get an error similar to `ERROR: pushing transaction: http://localhost:8080/v1/chain/push_transaction: status code=502` when running `test.sh`, that means that `dfuseeos` was not yet ready to receive your transactions. Try to run the script again after a couple more seconds.

## 3. Anchor

### 3.1. Blockchain not configured
Make sure that `dfuseeos` can [accept incoming connections](#22-accept-incoming-network-connections).

### 3.2. Can't login using the Anchor Wallet
If your console is throwing an error similar to `WebSocket connection to 'wss://cb.anchor.link/064236d4-9bcc-4a93-89ff-c65acabda3e5' failed: Unknown reason` when you're trying to login through Anchor, one of your browser extensions is most likely blocking the connection. Try to disable them (Incognito sometimes doesn't work as intended) or try in a different browser.

### 3.3. Verifying the Chain ID
You can verify that your Chain ID is correct by running `eosc get info` in a **new** terminal window.

```
eosc get info
```

[`eosc`](https://eosc.app/) is a flexible & powerful command line tool to interact with an EOSIO chain. Running `get info` will display the current chain info. What we're looking for in this case is to confirm the `chain_id`.

## 4. Pool name restrictions
Each pool name needs to follow the [EOSIO `Accounts`](https://developers.eos.io/welcome/latest/protocol/accounts_and_permissions/#2-accounts) limitation; it must be a human readable name between 1 and 12 characters in length. The characters can include [a-z], [1-5], and optional dots (.) except for the last character. Any other character will be replaced by a `.`, including non lower case letters.

## Can't find a solution?
If your issue isn't listed here, search the [issues section](https://github.com/dfuse-io/ice/issues) for a similar issue. If you can't find anything, open a new issue and someone from the community or the dfuse team will get to it.