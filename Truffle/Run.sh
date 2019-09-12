#!/bin/bash
if [[ $GETH_TYPE == "Private Network" ]]; then
    truffle migrate
else
    truffle migrate --network ropsten
fi
npm start
