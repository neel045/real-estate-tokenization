var realEstateTokenization = artifacts.require("./RealEstateTokenization.sol");

module.exports = function (deployer) {
  deployer.deploy(realEstateTokenization);
};
