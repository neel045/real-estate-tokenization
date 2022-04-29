// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract RealEstateTokenization {
    struct Asset {
        uint256 id;
        uint256 propertyID;
        string symbol;
        address mainPropertyOwner;
        mapping(address => uint256) shares;
        uint256 totalSupply;
        uint256 availableSupply;
        address tenant;
        mapping(address => uint256) sharesOffered; // address => numberof shares => price
        mapping(address => uint256) shareSellPrice;
        uint256 rentPer30Day;
        uint8 rentalLimitMonths; // rent can be paid in advance
        uint256 rentalLimitBlocks; //rent limit in block
        uint256 rentalBegin; //rent begin at block number
        uint256 occupiedUntill; // rent has paid untill block number
        mapping(address => uint256) rentpaidUntill;
    }

    uint256 public numOfProperties = 0;
    uint8 public avgBlockTime; // Avg block time in seconds.
    uint8 private decimals; // Decimals of our Shares. Has to be 0.
    uint8 public tax; // Can Preset Tax rate in constructor. To be change by government only.

    mapping(uint256 => Asset) public assets;
    address public gov = msg.sender;
    address[] public stakeholders;
    uint256 public accumulated;
    uint256 private _taxdeduct; // ammount of tax to be paid for incoming ether.
    mapping(uint256 => uint256) public mappingProperty; // propertyId => id in mapping

    modifier onlyGov() {
        require(msg.sender == gov);
        _;
    }

    constructor() {
        avgBlockTime = 13;
        decimals = 0;
        tax = 8;
        stakeholders.push(gov);
    }

    function addStakeholder(address _stakeholder) public {
        (bool _istakeholder, ) = isStakeholder(_stakeholder);
        require(_istakeholder == false, "The Stakeholder is already listed");
        stakeholders.push(_stakeholder);
    }

    function isStakeholder(address _stakeholder)
        public
        view
        returns (bool, uint256)
    {
        for (uint256 s = 0; s < stakeholders.length; s += 1) {
            if (_stakeholder == stakeholders[s]) return (true, s);
        }

        return (false, 0);
    }

    function addProperty(
        uint256 _propertyID,
        string memory _symbol,
        address _mainPropertyOwner
    ) public {
        (bool _istakeholder, ) = isStakeholder(_mainPropertyOwner);
        require(_istakeholder, "The Property owner is not a listed");
        numOfProperties += 1;
        mappingProperty[_propertyID] = numOfProperties;
        Asset storage a = assets[numOfProperties];
        a.propertyID = _propertyID;
        a.symbol = _symbol;
        a.mainPropertyOwner = _mainPropertyOwner;
        a.totalSupply = 100;
        a.shares[_mainPropertyOwner] = 100;
    }

    function seizureFrom(
        uint256 _propertyID,
        address _from,
        address _to,
        uint256 _value
    ) private returns (bool) {
        Asset storage a = assets[_propertyID];
        a.shares[_from] -= _value;
        a.shares[_to] += _value;
        return true;
    }

    function offerShares(
        uint256 _propertyID,
        address _from,
        uint256 _sharesOffered,
        uint256 _shareSellPrice
    ) public {
        Asset storage a = assets[_propertyID];
        require(_sharesOffered <= a.shares[msg.sender]);
        a.sharesOffered[_from] = _sharesOffered;
        a.shareSellPrice[_from] = _shareSellPrice;
    }

    function buyShares(
        address payable _from,
        uint256 _propertyID,
        uint256 _numberOfshares
    ) public payable {
        Asset storage a = assets[_propertyID];
        a.availableSupply -= _numberOfshares;
        a.sharesOffered[_from] -= _numberOfshares;
        a.shares[msg.sender] += _numberOfshares;
    }

    function showSharesOf(uint256 _propertyID) public view returns (uint256) {
        return assets[_propertyID].shares[msg.sender];
    }

    function setRentper30Day(uint256 _rent, uint256 _propertyID) public {
        Asset storage a = assets[_propertyID];
        require(
            a.mainPropertyOwner == msg.sender,
            "Sorry you are not property owner"
        );
        a.rentPer30Day = _rent;
    }
}
