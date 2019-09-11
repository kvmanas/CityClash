const cityClash = artifacts.require('CityClash');
const cClink = artifacts.require('CClink');
//const gemToken = artifacts.require('CityGem');

contract('CityClash', async accounts => {
  let CityClash, CClink, GemToken;
  beforeEach('setup contract for each test', async function() {
    CClink = await cClink.deployed();
    CityClash = await cityClash.deployed(CClink.address);
    await CityClash.CreateToken(10000000000000, 'CityGems', 2, 'CCG');
  });

  it('is the owner', async function() {
    assert.equal(
      await CityClash.owner(),
      accounts[0],
      'account is not the Owner'
    );
  });
  it('should create town correctly', async function() {
    await CityClash.CreateVillage();
    const Villages = await CityClash.GetPlayerDetails(accounts[0]);
    assert.equal(Villages._Towns.length, 1, 'More than one Village Created');
    const VillageOwner = await CityClash.GetVillageOwner(Villages._Towns[0]);
    assert.equal(VillageOwner, accounts[0], 'account is not the Village Owner');
  });
});
