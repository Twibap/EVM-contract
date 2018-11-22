pragma solidity ^0.4.24;

import "./DepositRole.sol";
import "openzeppelin-solidity/contracts/ownership/Secondary.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";

/**
** 이더리움을 판매하는 Smartcontract이다.
** 결제 서버가 사용자의 결제 내역을 확인한 후
** Vendor contract에 예치된 이더를 사용자의 주소로 송금한다.
**
** 모든 기능은 Contract 소유자(결제서버)에 의해 통제된다.
** 예외적으로 예치 기능은 예치 가능 계정 명단을 두어
** 지정된 계정만 예치할 수 있도록 한다.
*/

contract Vendor is Secondary, DepositRole{

	using Address for address;

	/**
	**	contract function은 event를 발생시키고,
	**	Ethereum Node에서 event를 검출하면 서버를 통해
	**	관련 사용자에게 Notify한다.
	TODO indexed 파라미터에 대해 알아볼 것
	*/
	event EVM_transferred(address _who, uint _amount);	// for transfer()
	event EVM_deposited  (address _who, uint _amount);	// for deposit()
	event EVM_withdrawn  ();	// for withdraw(), have to never be called

	/**
	** 송금
	** 결제 서버를 통해 구입한 사용자에게
	** 이더를 송금한다.
	*/
 	function sendGoods(address _customer, uint _amount) onlyPrimary public{
		// Contract account로는 송금하지 아니한다.
		require( !_customer.isContract() && _customer != address(0) );
		require( _amount < address(this).balance );

		_customer.transfer(_amount);

		emit EVM_transferred(_customer, _amount);
	}

	/**
	** 출금
	** Contract 소유 계정으로만 출금한다.
	*/
	function withdraw() onlyPrimary public {
		primary().transfer( address(this).balance );
		emit EVM_withdrawn();
	}

	/**
	** 예치
	** 정해진 계정만 예치 가능하다.
	** Fallback 함수는 다른 함수를 호출하지않고 이더를 
	** 송금하는 경우 호출되는 함수이다.
	** 예치 권리자가 아니면 이더를 반환한다.
	*/
 	function () public onlyDepositter payable {
//		if( !isProcurer(msg.sender) )
//			msg.sender.transfer(msg.value);

		emit EVM_deposited(msg.sender, msg.value);
	}

}
