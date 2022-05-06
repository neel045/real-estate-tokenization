// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract RealEstateTokenization {
    struct Asset {
        uint256 id;
        uint256 propertyID;
        string symbol;
        address mainPropertyOwner;
        address[] stakeholders;
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
        address[] interstedTenant;
    }

    uint256 public numOfProperties = 0;
    uint8 public avgBlockTime; // Avg block time in seconds.
    uint8 private decimals; // Decimals of our Shares. Has to be 0.
    uint8 public tax; // Can Preset Tax rate in constructor. To be change by government only.
    uint256 public blocksPer30Day;
    uint256 public _accumulated; //store accumulated rent

    mapping(uint256 => Asset) public assets;
    address public gov = msg.sender;
    address[] public stakeholders;

    mapping(uint256 => uint256) public mappingProperty; // propertyId => id in mapping

    mapping(address => uint256) public revenues;

    modifier onlyGov() {
        require(msg.sender == gov);
        _;
    }

    constructor() {
        avgBlockTime = 13;
        decimals = 0;
        tax = 8;
        stakeholders.push(gov);
        blocksPer30Day = (60 * 60 * 24 * 30) / avgBlockTime;
        _accumulated = 0;
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

    function isStakeholderInProperty(uint256 _propertyID, address _stakeholder)
        public
        view
        returns (bool, uint256)
    {
        Asset storage a = assets[_propertyID];

        for (uint256 s = 0; s < a.stakeholders.length; s += 1) {
            if (_stakeholder == a.stakeholders[s]) return (true, s);
        }

        return (false, 0);
    }

    function addProperty(
        uint256 _propertyID,
        string memory _symbol,
        address _mainPropertyOwner,
        uint256 _totalSupply,
        uint256 _rentPer30Day,
        uint8 _rentalLimitMonths
    ) public {
        (bool _istakeholder, ) = isStakeholder(_mainPropertyOwner);
        require(_istakeholder, "The Property owner is not a listed");
        numOfProperties += 1;
        mappingProperty[_propertyID] = numOfProperties;
        Asset storage a = assets[numOfProperties];
        a.propertyID = _propertyID;
        a.id = numOfProperties;
        a.symbol = _symbol;
        a.mainPropertyOwner = _mainPropertyOwner;
        a.totalSupply = _totalSupply;
        a.shares[_mainPropertyOwner] = _totalSupply;
        a.stakeholders.push(msg.sender);
        a.rentalLimitMonths = 11;
        a.rentalLimitBlocks = a.rentalLimitMonths * blocksPer30Day;
        a.rentPer30Day = _rentPer30Day;
        a.rentalLimitMonths = _rentalLimitMonths;
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

    //property owner functions
    function changeRent(uint256 _propertyID, uint256 _newRent) public {
        Asset storage a = assets[_propertyID];
        a.rentPer30Day = _newRent;
    }

    function numOfStakeholdersForProperty(uint256 _propertyID)
        public
        view
        returns (uint256)
    {
        Asset storage a = assets[_propertyID];
        return a.stakeholders.length;
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
        a.availableSupply += _sharesOffered;
    }

    function aproveTanent(address _tenant, uint256 _propertyID) public {
        Asset storage a = assets[_propertyID];
        require(a.mainPropertyOwner == msg.sender);
        a.tenant = _tenant;
        for (uint256 i = 0; i < a.interstedTenant.length; i++) {
            a.interstedTenant[i] = a.interstedTenant[
                a.interstedTenant.length - 1
            ];
            a.interstedTenant.pop();
        }
    }

    function getAllInterrestedTenant(uint256 _propertyID)
        public
        view
        returns (address[] memory)
    {
        Asset storage a = assets[_propertyID];
        address[] memory _tenants = new address[](a.interstedTenant.length);

        for (uint256 i = 0; i < a.interstedTenant.length; i++) {
            _tenants[i] = a.interstedTenant[i];
        }
        return _tenants;
    }

    //stakeholders functions
    function buyShares(
        address payable _from,
        uint256 _propertyID,
        uint256 _numberOfshares
    ) public payable {
        (bool _isStakeholder, ) = isStakeholder(_from);
        require(_isStakeholder);
        Asset storage a = assets[_propertyID];
        (bool _isStakeholderInProperty, ) = isStakeholderInProperty(
            _propertyID,
            msg.sender
        );
        if (!_isStakeholderInProperty) {
            a.stakeholders.push(msg.sender);
        }

        require(
            msg.value == _numberOfshares * a.shareSellPrice[_from] &&
                _numberOfshares <= a.sharesOffered[_from] &&
                _from != msg.sender
        );
        seizureFrom(_propertyID, _from, msg.sender, _numberOfshares);
        a.sharesOffered[_from] -= _numberOfshares;
        a.availableSupply -= _numberOfshares;
        _from.transfer(msg.value);
    }

    function setRentper30Day(uint256 _rent, uint256 _propertyID) public {
        Asset storage a = assets[_propertyID];
        require(
            a.mainPropertyOwner == msg.sender,
            "Sorry you are not property owner"
        );
        a.rentPer30Day = _rent;
    }

    function getSharesOfProperty(uint256 _propertyID)
        public
        view
        returns (
            address[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory
        )
    {
        Asset storage a = assets[_propertyID];
        address[] memory _stakeholders = new address[](a.stakeholders.length);
        uint256[] memory _shares = new uint256[](a.stakeholders.length);
        uint256[] memory _offeredShares = new uint256[](a.stakeholders.length);
        uint256[] memory _shareSellPrice = new uint256[](a.stakeholders.length);

        for (uint256 i = 0; i < a.stakeholders.length; i++) {
            _stakeholders[i] = a.stakeholders[i];
            _shares[i] = a.shares[a.stakeholders[i]];
            _offeredShares[i] = a.sharesOffered[a.stakeholders[i]];
            _shareSellPrice[i] = a.shareSellPrice[a.stakeholders[i]];
        }

        return (_stakeholders, _shares, _offeredShares, _shareSellPrice);
    }

    //tennet function
    function applyTenant(uint256 _propertyID) public {
        (bool _isStakeholder, ) = isStakeholder(msg.sender);
        require(_isStakeholder);
        Asset storage a = assets[_propertyID];
        a.interstedTenant.push(msg.sender);
    }

    function payRent(
        uint8 _months,
        uint256 _propertyID,
        uint256 _numOfShareholdersForProperty
    ) public payable {
        Asset storage a = assets[_propertyID];
        uint256 _rentdue = _months * a.rentPer30Day;
        uint256 _additionalBlocks = _months * blocksPer30Day;
        require(
            msg.value == _rentdue &&
                block.number + _additionalBlocks <
                block.number + a.rentalLimitBlocks
        );

        uint256 _taxdeduct = (msg.value / a.totalSupply) * tax;
        _accumulated = (msg.value - _taxdeduct);
        revenues[gov] += _taxdeduct;

        address _stakeholder;
        uint256 _shares;
        uint256 _etherToRecieve;
        uint256 s = 0;

        for (s = 0; s < _numOfShareholdersForProperty; s++) {
            _stakeholder = a.stakeholders[s];
            _shares = a.shares[_stakeholder];
            _etherToRecieve = (_accumulated / (a.totalSupply)) * _shares;
            revenues[_stakeholder] = revenues[_stakeholder] + _etherToRecieve;
        }
        _accumulated = 0;

        if (
            a.rentpaidUntill[a.tenant] == 0 && a.occupiedUntill < block.number
        ) {
            //hasn't rented yet & flat is empty
            a.rentpaidUntill[a.tenant] = block.number + _additionalBlocks; //rents from now on
            a.rentalBegin = block.number;
        } else if (
            a.rentpaidUntill[a.tenant] == 0 && a.occupiedUntill > block.number
        ) {
            //hasn't rented yet & flat is occupied
            a.rentpaidUntill[a.tenant] = a.occupiedUntill + _additionalBlocks; //rents from when it is free
            a.rentalBegin = a.occupiedUntill;
        } else if (a.rentpaidUntill[a.tenant] > block.number) {
            //is renting, contract is runing
            a.rentpaidUntill[a.tenant] += _additionalBlocks; //rents from when it is free
            a.rentalBegin = a.occupiedUntill;
        } else if (
            a.rentpaidUntill[a.tenant] < block.number &&
            a.occupiedUntill > block.number
        ) {
            //has rented before & flat is occupied
            a.rentpaidUntill[a.tenant] = a.occupiedUntill + _additionalBlocks; //rents from when it is free
            a.rentalBegin = a.occupiedUntill;
        } else if (
            a.rentpaidUntill[a.tenant] < block.number &&
            a.occupiedUntill < block.number
        ) {
            //has rented before & flat is empty
            a.rentpaidUntill[a.tenant] = block.number + _additionalBlocks; //rents from now on
            a.rentalBegin = block.number; //has lived before and flat is empgy
        }
        a.occupiedUntill = a.rentpaidUntill[a.tenant];
    }

    function withdraw() public payable {
        //revenues can be withdrawn from individual shareholders (government can too withdraw its own revenues)
        address payable user = payable(msg.sender);
        uint256 revenue = revenues[msg.sender];
        revenues[msg.sender] = 0;

        user.transfer(revenue);
    }
}
