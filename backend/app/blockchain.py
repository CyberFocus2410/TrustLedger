import os
import json
from web3 import Web3
from dotenv import load_dotenv

# Load env variables
load_dotenv()

# Configuration
# Default to Hardhat local node
RPC_URL = os.getenv("BLOCKCHAIN_RPC_URL", "http://127.0.0.1:8545")
# Standard Hardhat Account #0 private key for local development
DEFAULT_PRIV_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
ISSUER_PRIVATE_KEY = os.getenv("ISSUER_PRIVATE_KEY", DEFAULT_PRIV_KEY)

# Connect to Web3
w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Global placeholder for contract info
contract_cache = None

def get_contract_info():
    global contract_cache
    if contract_cache is not None:
        return contract_cache

    current_dir = os.path.dirname(os.path.abspath(__file__))
    info_path = os.path.join(current_dir, "contract_info.json")
    
    if not os.path.exists(info_path):
        # Return none or empty, backend will handle gracefully if contract isn't deployed yet
        return None
        
    with open(info_path, "r") as f:
        contract_cache = json.load(f)
    return contract_cache

def get_contract_instance():
    info = get_contract_info()
    if not info:
        raise ValueError("Contract info not found. Has the smart contract been deployed?")
        
    contract_address = info["address"]
    abi = info["abi"]
    
    # Check web3 connection
    if not w3.is_connected():
        raise ConnectionError(f"Failed to connect to blockchain RPC at {RPC_URL}")
        
    return w3.eth.contract(address=contract_address, abi=abi)

def mint_merchant_score(merchant_address: str, score: int, f1: str, f2: str, f3: str) -> str:
    """
    Calls the TrustLedger smart contract to mint a credit score for the merchant address.
    Uses the backend's issuer private key to sign and submit the transaction.
    Returns the transaction hash.
    """
    contract = get_contract_instance()
    
    # Resolve checksum addresses
    merchant_checksum = Web3.to_checksum_address(merchant_address)
    
    # Retrieve issuer address from private key
    account = w3.eth.account.from_key(ISSUER_PRIVATE_KEY)
    issuer_address = account.address
    
    # Scale score transparently: 0-100 mapped to 300-900
    scaled_score = int(score)
    if 0 <= scaled_score <= 100:
        scaled_score = 300 + (scaled_score * 6)

    print(f"Minting score {scaled_score} (scaled from {score}) for merchant {merchant_checksum} using issuer {issuer_address}")
    
    # Build transaction
    nonce = w3.eth.get_transaction_count(issuer_address)
    
    # Get gas estimates
    try:
        gas_estimate = contract.functions.mintScore(
            merchant_checksum,
            scaled_score,
            f1,
            f2,
            f3
        ).estimate_gas({'from': issuer_address})
    except Exception as e:
        print(f"Gas estimation failed, using fallback: {str(e)}")
        gas_estimate = 200000  # Conservative fallback
        
    chain_id = w3.eth.chain_id
    
    tx = contract.functions.mintScore(
        merchant_checksum,
        scaled_score,
        f1,
        f2,
        f3
    ).build_transaction({
        'chainId': chain_id,
        'gas': int(gas_estimate * 1.2),  # add buffer
        'gasPrice': w3.eth.gas_price,
        'nonce': nonce,
    })
    
    # Sign transaction
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=ISSUER_PRIVATE_KEY)
    
    # Send transaction
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    
    # Return transaction hash hex
    return w3.to_hex(tx_hash)

def lookup_merchant_score(merchant_address: str) -> dict:
    """
    Queries the TrustLedger smart contract (read-only view) for a merchant's score record.
    """
    contract = get_contract_instance()
    merchant_checksum = Web3.to_checksum_address(merchant_address)
    
    try:
        result = contract.functions.getScore(merchant_checksum).call()
        score, timestamp, f1, f2, f3, exists = result
        
        # Descale score transparently: 300-900 mapped back to 0-100
        descaled_score = score
        if exists and score >= 300:
            descaled_score = int((score - 300) // 6)

        return {
            "score": descaled_score,
            "timestamp": timestamp,
            "factor1": f1,
            "factor2": f2,
            "factor3": f3,
            "exists": exists
        }
    except Exception as e:
        print(f"Error querying contract for merchant {merchant_address}: {str(e)}")
        return {
            "exists": False,
            "error": str(e)
        }
