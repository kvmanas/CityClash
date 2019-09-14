# CityClash Game

CityClash is blockchain based browser game, we use ethereum network for deploying codes (smart contracts) and swarm network (a decentralized file system) for uploading images.

## Requirements

- Windows / Ubuntu
- Build-essential packages
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- MetaMask Installed Browser

## Setting Up:

**Step 1:** Download the repostory using the command:

```
 Git Clone "https://github.com/kvmanas/CityClash"
 cd CityClash
```

**Step 2:** Install the dependecies using the command:

```
 npm Install
```

**Step 3:** Use the following command to run the Dapp:
For Windows

```
 ./CityClash up
```

For Ubuntu

```
chmod +x ./CityClash.sh
./CityClash.sh up
```

**Step 4:** Enter Dapp Configuration

from command prompt

choose Network Type

```
? Select the Ethereum Network Type .. (Use arrow keys)
> Private Network
  Ropsten Network
```

Enter MetaMask Seed Phase

```
//domain hip magic total cart frozen umbrella next matrix march measure cousin
? Enter Your MetaMask Seed Phase..
```

Enter Infura Project ID ( only in Ropsten Network mode)

```
//default project ID  0e9a3e7c18094e3a87e13cb1991e4b57
? Enter Your Infura Project ID.. (0e9a3e7c18094e3a87e13cb1991e4b57)
```

**Step 5:** Go http://localhost/, to Interact with game check video demonstration [here]()

**Step 6:** Use the following command to Stop Dapp

For Windows

```
 ./CityClash down
```

For Ubuntu

```
./CityClash.sh down
```

**Step 7:** Use the following command to Reset Dapp Configuration

For Windows

```
 ./CityClash reset
```

For Ubuntu

```
./CityClash.sh reset
```

## Optional Settings:

To Enter Truffle Container

```
docker exec -ti truffle /bin/bash
```

in Truffle Container

to run test case

```
truffle test ./test/test.js
```

to migrate contracts

```
truffle migrate --reset
//for ropsten network
truffle migrate --reset --network ropsten
```
