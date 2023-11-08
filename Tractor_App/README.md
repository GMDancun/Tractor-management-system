# Tractor App

Azle project! This is a group project which we are required to deploy our canister (application) to the Internet Computer (IC) decentralized cloud. 
It is a simple CRUD APP canister. You can always refer to [The Azle Book](https://demergent-labs.github.io/azle/) for more in-depth documentation.

`dfx` is the tool you will use to interact with the IC locally and on mainnet. If you don't already have it installed:


To Run this App locally follow the following steps:
Step 1: Use the git clone command followed by the link to this repo.
```bash
  git clone https://github.com/GMDancun/Tractor-management-system.git
```

Step 2: cd to the app directory.
```bash
  cd: Tractor-management-system/Tractor_App$
```

Step 3: Start a replica, which is a local instance of the IC that you can deploy your canisters to:
```bash
  dfx start --background --clean
```

Step 4: Install the Dependencies:
```bash
    npm install
```

Step 5: Now you can deploy your canister locally:
```bash
    dfx deploy
```

