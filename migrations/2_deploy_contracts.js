const Vendor = artifacts.require('./Vendor.sol')

module.exports = function(deployer) {
	deployer.deploy(Vendor);
}
