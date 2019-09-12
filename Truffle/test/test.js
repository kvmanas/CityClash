const cityClash = artifacts.require('CityClash');
const cClink = artifacts.require('CClink');
const gemToken = artifacts.require('CityGem');

contract('CityClash', async accounts => {
  let CityClash, CClink, GemToken;
  //deploy contracts before each test cases
  beforeEach('setup contract for each test', async function() {
    //Deploy Contacts
    CClink = await cClink.deployed();
    CityClash = await cityClash.deployed(CClink.address);
    //Create ERC20 Token by calling CreateToken in CityCash
    await CityClash.CreateToken(10000000000000, 'CityGems', 2, 'CCG');
    //Getting Token Instance from address
    const tokenAdd = await CityClash.CityToken.call();
    GemToken = await gemToken.at(tokenAdd);
  });
  it('is the owner', async function() {
    // test address[0] is the owner of contract
    assert.equal(
      await CityClash.owner(),
      accounts[0],
      'account is not the Owner'
    );
  });
  it('should create town correctly', async function() {
    //create Village
    await CityClash.CreateVillage();
    //get player details (towns and gem balance of user)
    const Villages = await CityClash.GetPlayerDetails(accounts[0]);
    assert.equal(Villages._Towns.length, 1, 'More than one Village Created');
    const VillageOwner = await CityClash.GetVillageOwner(Villages._Towns[0]);
    assert.equal(VillageOwner, accounts[0], 'account is not the Village Owner');
  });
  it('should destroy town correctly', async function() {
    await CityClash.CreateVillage();
    const VillagesBefore = await CityClash.GetPlayerDetails(accounts[0]);
    //Destroy 2nd Village (index: 1)
    await CityClash.DestroyUserVillage(VillagesBefore._Towns[1], 1);
    const VillagesAfter = await CityClash.GetPlayerDetails(accounts[0]);
    assert.equal(VillagesAfter._Towns.length, 1, 'Village not deleted');
  });
  it('should deposite Gem correctly', async function() {
    //check token balnce of contract and user
    const ConractGemBalanceBefore = await GemToken.balanceOf(CityClash.address);
    const UserGemBalanceBefore = await GemToken.balanceOf(accounts[0]);
    //Approve Contract to Transfer user token
    await GemToken.approve(CityClash.address, 100000);
    //Deposite 100000 Gem in contract
    await CityClash.depositGems(100000);
    const ConractGemBalanceAfter = await GemToken.balanceOf(CityClash.address);
    const UserGemBalanceAfter = await GemToken.balanceOf(accounts[0]);
    assert.equal(
      ConractGemBalanceAfter - ConractGemBalanceBefore,
      100000,
      'Contract Gem balance not increased'
    );
    assert.equal(
      UserGemBalanceBefore - UserGemBalanceAfter,
      100000,
      'User Gem balance not decreased'
    );
    assert.equal(
      await CityClash.GetPlayerGems(accounts[0]),
      100000,
      'Gem Balance in Contract shown incorrectly'
    );
  });
  it('should withdraw Gem correctly', async function() {
    await GemToken.approve(CityClash.address, 100000);
    await CityClash.depositGems(100000);
    const ConractGemBalanceBefore = await GemToken.balanceOf(CityClash.address);
    const UserGemBalanceBefore = await GemToken.balanceOf(accounts[0]);
    const GemInContractBefore = await CityClash.GetPlayerGems(accounts[0]);
    // Withdraw 60000 gem to User
    await CityClash.withdrawGems(60000);
    const ConractGemBalanceAfter = await GemToken.balanceOf(CityClash.address);
    const UserGemBalanceAfter = await GemToken.balanceOf(accounts[0]);
    const GemInContractAfter = await CityClash.GetPlayerGems(accounts[0]);
    assert.equal(
      ConractGemBalanceBefore - ConractGemBalanceAfter,
      60000,
      'Contract Gem balance not decreased'
    );
    assert.equal(
      UserGemBalanceAfter - UserGemBalanceBefore,
      60000,
      'User Gem balance not increased'
    );
    assert.equal(
      GemInContractBefore - GemInContractAfter,
      60000,
      'Gem Balance in Contract shown incorrectly'
    );
  });
});
