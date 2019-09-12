#!/bin/bash
#echo $SHELL
#echo $BASH
#echo $1
echo $GETH_TYPE
#printenv
#STR="Hello World!"
if [[ $GETH_TYPE == "Private Network" ]]; then
./startNode.sh
fi
