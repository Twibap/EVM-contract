const { ether } = require('openzeppelin-solidity/test/helpers/ether');
const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');
const constants = require('openzeppelin-solidity/test/helpers/constants');

const Vendor = artifacts.require('./Vendor.sol');

contract('Vendor', function(accounts){
	let primary = accounts[0];
	let procurer = accounts[1];
	let purchaser = accounts[2];
	let stranger = accounts[3];

	let contract;
	Vendor.deployed().then((instance)=>{
		contract = instance;
	});

	let depositAmount = ether(10);	


	it("0. Should NOT able to renounce role if last account", async ()=>{
		// 15번째로 가면 왜 안되는지 모르겠다.
		await shouldFail.reverting(
			contract.renounceDepositRole({from: primary})
		);
	});

	it("1. Should NOT be able to add role by NOT DEPOSITTER", async()=>{
		await shouldFail.reverting( 
			contract.addDepositter(procurer, {from: procurer}) );
	});

	it("2. Should be able to add role by PRIMARY", ()=>{
		contract.addDepositter( procurer, {from: primary} );
	});

	it("3. Should be able to Deposit by PRIMARY", ()=>{
		contract.sendTransaction({from: primary, value: depositAmount})
	});

	it("4. Should be able to Deposit by DEPOSITTER", ()=>{
		contract.sendTransaction({from: procurer, value: depositAmount})
	});

	it("5. Should NOT be able to Deposit by STRANGER", async()=>{
		await shouldFail.reverting( 
			contract.sendTransaction({from: stranger, value: depositAmount}) );
	});

	let goodsAmount = ether(1);
	it("6. Should NOT be able to send goods to ZERO_ADDRESS", async()=>{
		await shouldFail.reverting(
			contract.sendGoods( constants.ZERO_ADDRESS, goodsAmount,{from: primary})
		);
	});
	
	it("7. Should NOT be able to send goods to CONTRACT ADDRESS", async()=>{
		const strangerContract = await Vendor.new({from: stranger});
		await shouldFail.reverting(
			contract.sendGoods( strangerContract.address, goodsAmount, {from: primary})
		);
	});
	
	it("8. Should NOT be able to send goods by WHO JUST HAS DEPOSIT ROLE", async()=>{
		await shouldFail.reverting(
			contract.sendGoods( purchaser, goodsAmount, {from: procurer})
		);
	});

	it("9. Should NOT be able to send goods with OVER BALANCE ", async()=>{
		goodsAmount = constants.MAX_UINT256;
		await shouldFail.reverting(
			contract.sendGoods( purchaser, goodsAmount, {from: primary})
		);
	});
	
	it("10. Should be able to send goods by PRIMARY", ()=>{
		goodsAmount = ether(1);
		contract.sendGoods( purchaser, goodsAmount, {from: primary})
	});

	it("11. Should NOT be able to withdraw by DEPOSITTER", async()=>{
		await shouldFail.reverting(
			contract.withdraw( {from: procurer })
		);
	});
	
	it("12. Should NOT be able to withdraw by STRANGER", async()=>{
		await shouldFail.reverting(
			contract.withdraw( {from: stranger})
		);
	});

	it("13. Should be able to withdraw by PRIMARY", async()=>{
			contract.withdraw( {from: primary})
	});

	it("14. Should be able to renounce role by itself", async()=>{
		contract.renounceDepositRole({from: procurer});
	});

	function showEveryBalances(){

		if( contract != null)
			console.log("contract  balance - "+web3.fromWei( web3.eth.getBalance(contract.address) ));
		console.log("primary   balance - "+web3.fromWei( web3.eth.getBalance(primary) ));
		console.log("procurer  balance - "+web3.fromWei( web3.eth.getBalance(procurer) ));
		console.log("purchaser balance - "+web3.fromWei( web3.eth.getBalance(purchaser) ));
		console.log("stranger  balance - "+web3.fromWei( web3.eth.getBalance(stranger) ));
		console.log("\n");

	}

});
