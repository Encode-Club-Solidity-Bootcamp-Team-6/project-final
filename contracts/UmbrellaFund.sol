// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {UmbrellaToken} from "./UmbrellaToken.sol";
import {PriceConsumerV3} from "./PriceConsumerV3.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title A very simple investment fund contract
/// @author jellysky (Group 6, Solidity Bootcamp)
/// @notice You can use this contract for running a very simple investment fund
/// @dev TBD
/// @custom:teaching This is a contract is for our bootcamp final project
contract UmbrellaFund is Ownable {
        
    /// @notice Address of the token used as payment for the bets
    UmbrellaToken public paymentToken;
    
    /// @notice Amount of umbrella tokens given per ETH paid - units (token / ETH)
    uint256 public purchaseRatio;
    
    /// @notice Array that tracks tokens purchased by investor address
    mapping (address => uint) public tokenShare;
    
    /// @notice Stuct and array that tracks assets purchased by priceFeed address
    struct asset {
        address priceFeed; // can double for tokenID??
        string tokenNum; // numerator currency (so in the case of ETH / USD, its ETH)
        string tokenDen; // denominator currency (so in the case of ETH / USD, its USD)
        uint256 tokenAmount;
        uint256 initPrice;
        PriceConsumerV3 priceFeeder;
    }
    
    asset[5] public fundAssets; // i've set the max assets in our portfolio to 5

    /// @notice Constructor function
    /// @param tokenName Name of the token used for payment
    /// @param tokenSymbol Symbol of the token used for payment
    
    constructor(string memory tokenName, string memory tokenSymbol, uint256 _purchaseRatio) Ownable(msg.sender) {
        paymentToken = new UmbrellaToken(tokenName, tokenSymbol);
        purchaseRatio = _purchaseRatio;
    }

    /// @notice Running counter of how many tokens each investor has
    function getTokenShare(address investor) view external returns (uint) {
        return tokenShare[investor];
    }

    /// @notice Gets asset struct values except for prices because those cost SEP ETH
    function getAsset(uint index) view external returns (address, string memory, string memory, uint256, uint256) {
        return (fundAssets[index].priceFeed, fundAssets[index].tokenNum, fundAssets[index].tokenDen, fundAssets[index].tokenAmount, fundAssets[index].initPrice);
    }

    /// @notice Sets CL initial values so we can pull data
    function setCLInitValues(uint index, address _priceFeed, string memory _tokenNum, string memory _tokenDen) external {
        require(_priceFeed != address(0), "Pricefeed address not acceptable");
        fundAssets[index].priceFeed = _priceFeed;
        fundAssets[index].tokenNum = _tokenNum;
        fundAssets[index].tokenDen = _tokenDen;
        fundAssets[index].priceFeeder = new PriceConsumerV3(_priceFeed);
    }

    function getScaleFactor(uint index) view internal returns (uint256) {
        uint256 scaleFactor = 1;
        if (Strings.equal(fundAssets[index].tokenDen,"ETH")) {
            scaleFactor = 10**18;
        } else if (Strings.equal(fundAssets[index].tokenDen,"USD")) {
            scaleFactor = 10**8;
        }
        return scaleFactor;
    }
    
    /// @notice Gets CL prices.  We need to convert it to uint256 or else division fails
    function getCLPrice(uint index) view public returns (uint256) {       
        uint256 price = uint256(fundAssets[index].priceFeeder.getLatestPrice());
        return price; 
    }
    
    /// @notice Gives tokens based on the amount of ETH sent
    /// @dev This implementation is prone to rounding problems - ALSO ADD MODIFIER TO ENSURE TOTAL COINS IS NOT EXCEEDED
    function deposit() external payable {
        paymentToken.mint(msg.sender, msg.value * purchaseRatio);
        tokenShare[msg.sender] += msg.value * purchaseRatio;
    }

    /// @notice Burns `amount` tokens and give the equivalent ETH back to user, need to approve to use BurnFrom
    function withdraw(uint256 amount) external {
        require(amount <= paymentToken.totalSupply() / purchaseRatio - calculateNAVInitial(), "Not enough free ETH to make withdrawal"); // make sure there is enough ETH to make withdrawal
        paymentToken.burnFrom(msg.sender, amount);
        tokenShare[msg.sender] -= amount;
        payable(msg.sender).transfer(amount / purchaseRatio);
    }

    /// @notice Uses `amount` of ETH to purchase asset and sets purchasePrice - NEED TO INTEGRATE CHAINLINK PRICING
    function buyAsset(uint256 amount, uint index) external {
        require(amount <= paymentToken.totalSupply() / purchaseRatio - calculateNAVInitial(), "Not enough ETH to make purchase"); // make sure amount is less than ETH available for spending        
        fundAssets[index].initPrice = getCLPrice(index);
        fundAssets[index].tokenAmount = amount / (getCLPrice(index));
    }
    
    /// @notice Sells all of asset in array index struct
    function sellAsset(uint index) external {
        fundAssets[index].tokenAmount = 0;
        fundAssets[index].initPrice = 0;
    }

    /// @notice Gets the total token supply.  This is needed to ensure we don't spend more ETH than the fund contract has available (since we are actually not making purchases)
    function getTotalSupply() public view returns (uint256) {
        return paymentToken.totalSupply();
    }

    /// @notice Gets the token names in a long string.  This will be needed for the front end.
    function getTokenNames() public view returns (string memory) {
        string memory tokenNames = "";
        for (uint i = 0; i < fundAssets.length; i++) {
            if (fundAssets[i].tokenAmount > 0) {
                tokenNames = string.concat(tokenNames, fundAssets[i].tokenNum, "/", fundAssets[i].tokenDen, " , ");
            }
        }
        return tokenNames;
    }
    
    /// @notice Gets the token amounts in a long string.  This will be needed for the front end.
    function getTokenAmounts() public view returns (string memory) {
        string memory tokenAmounts = "";
        for (uint i = 0; i < fundAssets.length; i++) {
            if (fundAssets[i].tokenAmount > 0) {
                tokenAmounts = string.concat(tokenAmounts, Strings.toString(fundAssets[i].tokenAmount), " , ");
            }
        }
        return tokenAmounts;
    }

    /// @notice Gets the token values in a long string.  This will be needed for the front end.
    function getTokenValues() public view returns (string memory) {
        string memory tokenValues = "";
        for (uint i = 0; i < fundAssets.length; i++) {
            if (fundAssets[i].tokenAmount > 0) {
                tokenValues = string.concat(tokenValues, Strings.toString(fundAssets[i].tokenAmount * getCLPrice(i)), " , ");
            }
        }
        return tokenValues;
    }

    /// @notice Calculates NAV (denominated in ETH) at the time of asset purchase
    function calculateNAVInitial() public view returns (uint256) {
        uint256 nav = 0;
        for (uint i = 0; i < fundAssets.length; i++) {
            nav += fundAssets[i].tokenAmount * fundAssets[i].initPrice;
        }
        return nav;
    }
    
    /// @notice Calculates NAV (denominated in ETH) at the current time
    function calculateNAVCurrent() public view returns (uint256) {
        uint256 nav = 0;
        for (uint i = 0; i < fundAssets.length; i++) {
            if (fundAssets[i].priceFeed != address(0)) {
                nav += fundAssets[i].tokenAmount * getCLPrice(i);
            }
        }
        return nav;
    }

    /// @notice Calculates the return by taking the ratio of current and initial NAV's (denominated in ETH)
    function calculateReturn() public view returns (uint256) {
        uint256 navInit = calculateNAVInitial();
        require(navInit > 0, "NAV is 0");
        uint256 nav = calculateNAVCurrent();
        return nav / navInit - 1;
    }

}
