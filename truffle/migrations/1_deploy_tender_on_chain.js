const TenderOnChain = artifacts.require("TenderOnChain");

module.exports = function (deployer) {
  deployer.deploy(TenderOnChain);
};
