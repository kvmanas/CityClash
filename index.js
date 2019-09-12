const fs = require('fs');
const path = require('path');
const bip39 = require('bip39');
const envfile = require('envfile');
const { exec, spawn } = require('child_process');
var inquirer = require('inquirer');
var hdkey = require('ethereumjs-wallet/hdkey');
const KeyStorePath = './EthereumClient/chain/keystore/';
const GenesisFile = './EthereumClient/genesis.json';
const env = './.env';
const options = ['up', 'down', 'reset'];

// read environment variables
if (!fs.existsSync(env)) {
  fs.writeFileSync(env, '');
}
let EnvData = envfile.parseFileSync(env);

exec('docker-compose --version', (error, stdout, stderr) => {
  //check  docker installed
  if (error) {
    throw new Error(
      `Docker Compose not Found, Install Docker Compose to Continue`
    );
  }
  if (process.argv.length != 3 || options.indexOf(process.argv[2]) == -1) {
    console.error(`Command not found \n Available Commands: ${options}`);
    return;
  }
  if (process.argv[2] == options[0]) {
    //check first run or not
    if (EnvData.SEED_WORD) {
      var DockerExec = spawn('docker-compose', ['up', '--no-recreate'], {
        stdio: 'inherit'
      });
    } else {
      // get details to run Dapp
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'GethType',
            message: 'Select the Ethereum Network Type ..',
            choices: ['Private Network', 'Ropsten Network']
          },
          {
            name: 'SeedPhase',
            message: 'Enter Your MetaMask Seed Phase..'
          }
        ])
        .then(async answers => {
          if (!bip39.validateMnemonic(answers.SeedPhase)) {
            throw new Error('Mnemonic invalid or undefined');
          }
          EnvData.SEED_WORD = answers.SeedPhase;
          EnvData.GETH_TYPE = answers.GethType;
          if (answers.GethType == 'Ropsten Network') {
            const answer = await inquirer.prompt([
              {
                name: 'InfuraID',
                message: 'Enter Your Infura Project ID..',
                default: '0e9a3e7c18094e3a87e13cb1991e4b57'
              }
            ]);
            EnvData.INFURA_ID = answer.InfuraID;
          }
          const hdWallet = hdkey.fromMasterSeed(
            await bip39.mnemonicToSeed(EnvData.SEED_WORD)
          );
          const wallet = hdWallet.derivePath("m/44'/60'/0'/0/" + 0).getWallet();
          const password = '';
          const Keyjson = wallet.toV3String(password);
          const address = wallet.getAddress().toString('hex');
          const Keyfile = `UTC--${new Date()
            .toISOString()
            .replace(/[:]/g, '-')}--${address}`;
          //write Keystore file
          fs.writeFileSync(path.join(KeyStorePath, Keyfile), Keyjson);
          fs.writeFileSync(env, envfile.stringifySync(EnvData));
          // read and modify genesis file
          let GenesisData = JSON.parse(fs.readFileSync(GenesisFile, 'utf-8'));
          GenesisData.extraData = `0x0000000000000000000000000000000000000000000000000000000000000000${address}0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`;
          GenesisData.alloc[address] = {
            balance: '0x111111111111111111111111111111111111111111'
          };
          fs.writeFileSync(GenesisFile, JSON.stringify(GenesisData));
          var DockerExec = spawn('docker-compose', ['up', '--build'], {
            stdio: 'inherit'
          });
        });
    }
  } else if (process.argv[2] == options[1]) {
    spawn('docker-compose', ['down'], {
      stdio: 'inherit'
    });
  } else {
    //delete all keystore files
    fs.readdir(KeyStorePath, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(path.join(KeyStorePath, file), err => {
          if (err) throw err;
        });
      }
    });
    fs.writeFileSync(env, '');
    console.info('Reset Success');
  }
});

//       //domain hip magic total cart frozen umbrella next matrix march measure cousin
