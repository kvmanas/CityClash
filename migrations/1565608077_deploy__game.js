const CityClash = artifacts.require('CityClash');
const CClink = artifacts.require('CClink');
const GemToken = artifacts.require('CityGem');
var LinkInstance, GameInstance;
module.exports = async function(deployer, network, accounts) {
  // Use deployer to state migration tasks.
  deployer
    .deploy(CClink, { from: accounts[0] })
    .then(instance => {
      LinkInstance = instance;
      return deployer.deploy(CityClash, LinkInstance.address, {
        from: accounts[0]
      });
    })
    .then(instance => {
      GameInstance = instance;
      return LinkInstance.changeCCAddress(GameInstance.address, {
        from: accounts[0]
      });
    })
    .then(() => {
      return GameInstance.CreateToken(10000000000000, 'CityGems', 2, 'CCG', {
        from: accounts[0]
      });
    });
  // .then(async () => {
  //   let tokenAdd = await GameInstance.CityToken.call();
  //   let tokenInstance = await GemToken.at(tokenAdd);
  //   return tokenInstance.transfer(GameInstance.address, 8000000000000, {
  //     from: accounts[0]
  //   });
  // });
};
