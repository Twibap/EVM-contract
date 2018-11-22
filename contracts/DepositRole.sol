pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/access/Roles.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract DepositRole{
	using Roles for Roles.Role;
	using SafeMath for uint;

	event DepositAdded(address indexed account);
	event DepositRemoved(address indexed account);

	Roles.Role private depositters;
	uint depositterCount = 0;	// TODO private가 왜 안되는지 알아보자

	constructor() internal {
		_addDepositter(msg.sender);
	}

	modifier onlyDepositter(){
		require( isDepositter(msg.sender) );
		_;
	}

	function isDepositter(address account) public view returns(bool){
		return depositters.has( account );
	}

	function addDepositter(address account) public onlyDepositter{
		_addDepositter( account );
	}

	function renounceDepositRole() public {
		require( depositterCount > 1);	// 최소 한명은 남겨놓는다.
		_removeDepositter(msg.sender);
	}

	function _addDepositter(address account) internal{
		depositterCount.add(1);
		depositters.add(account);
		emit DepositAdded(account);
	}

	function _removeDepositter(address account) internal{
		depositterCount.sub(1);
		depositters.remove(account);
		emit DepositRemoved(account);
	}
}
