// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TrustLedger {
    struct ScoreRecord {
        uint16 score;
        uint256 timestamp;
        string factor1;
        string factor2;
        string factor3;
        bool exists;
    }

    // Mapping from merchant wallet address to their credit score record
    mapping(address => ScoreRecord) public scores;
    
    // Contract owner
    address public owner;
    
    // Mapping of authorized addresses (like our backend server) that can mint scores
    mapping(address => bool) public authorizedIssuers;

    event ScoreMinted(
        address indexed merchant,
        uint16 score,
        uint256 timestamp,
        string factor1,
        string factor2,
        string factor3
    );
    event IssuerStatusChanged(address indexed issuer, bool status);

    modifier onlyOwner() {
        require(msg.sender == owner, "TrustLedger: Caller is not the owner");
        _;
    }

    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender], "TrustLedger: Caller is not an authorized issuer");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
        emit IssuerStatusChanged(msg.sender, true);
    }

    /**
     * @dev Authorizes or revokes an issuer address. Only owner can call this.
     */
    function setIssuer(address issuer, bool status) external onlyOwner {
        authorizedIssuers[issuer] = status;
        emit IssuerStatusChanged(issuer, status);
    }

    /**
     * @dev Mints or updates a credit score for a merchant wallet. Only authorized issuers (backend) can call this.
     */
    function mintScore(
        address merchant,
        uint16 score,
        string calldata f1,
        string calldata f2,
        string calldata f3
    ) external onlyIssuer {
        require(score >= 300 && score <= 900, "TrustLedger: Credit score must be between 300 and 900");
        require(merchant != address(0), "TrustLedger: Merchant address cannot be zero address");

        scores[merchant] = ScoreRecord({
            score: score,
            timestamp: block.timestamp,
            factor1: f1,
            factor2: f2,
            factor3: f3,
            exists: true
        });

        emit ScoreMinted(merchant, score, block.timestamp, f1, f2, f3);
    }

    /**
     * @dev Public view function for Lenders to lookup a merchant's credit score.
     */
    function getScore(address merchant) external view returns (
        uint16 score,
        uint256 timestamp,
        string memory factor1,
        string memory factor2,
        string memory factor3,
        bool exists
    ) {
        ScoreRecord memory record = scores[merchant];
        return (
            record.score,
            record.timestamp,
            record.factor1,
            record.factor2,
            record.factor3,
            record.exists
        );
    }
}
