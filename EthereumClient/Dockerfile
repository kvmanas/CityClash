FROM ethereum/client-go
RUN apk add --no-cache bash
RUN sed -i -e "s/bin\/ash/bin\/bash/" /etc/passwd
ADD ./EthereumClient/ ./root/chain/
WORKDIR /root/chain
RUN chmod +x ./startNode.sh
RUN chmod +x ./Run.sh
RUN geth --datadir chain init genesis.json
ENTRYPOINT ./Run.sh