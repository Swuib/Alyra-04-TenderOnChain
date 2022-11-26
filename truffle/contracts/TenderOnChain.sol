// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

contract TenderOnChain {
  uint256 value;

  function read() public view returns (uint256) {
    return value;
  }

  function write(uint256 newValue) public {
    value = newValue;
  }
}
