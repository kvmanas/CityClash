FROM node:10.16-alpine
RUN apk add --no-cache bash git openssh
RUN apk add python krb5 krb5-libs gcc make g++ krb5-dev
RUN sed -i -e "s/bin\/ash/bin\/bash/" /etc/passwd
RUN npm install -g truffle
ADD ./Truffle/ ./root/truffle/
WORKDIR /root/truffle
RUN chmod +x ./Run.sh
RUN npm install
ENTRYPOINT ./Run.sh