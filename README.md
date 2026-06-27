# TrustLedger - Web3 Merchant Underwriting Platform

TrustLedger is a decentralized credit underwriting platform designed to convert Paytm merchant transaction statements into transparent, tamper-proof, and private credit ratings minted on the Polygon blockchain. 

The platform is designed to process transaction ledgers strictly **in-memory** to comply with the **Digital Personal Data Protection (DPDP) Act 2023**.

---

## 🚀 Key Features

### 1. In-Memory Statement Ingestion & Scoring
- Drag-and-drop ingestion of standard Paytm bank statements (CSV format).
- Flexibly maps heterogeneous columns (supporting values, dates, reference IDs, descriptions, and separate debit/credit tables) and formats commas in numeric strings.
- Computes a weighted credit score (0-100) based on 5 parameters:
  - **Transaction Volume Consistency** (30%)
  - **Payment Failure Rate** (25%)
  - **Revenue Growth Trend** (20%)
  - **Average Ticket Size** (15%)
  - **Settlement Regularity** (10%)

### 2. On-Chain Attestation & Smart Contracts
- Smart contract deployed on the **Polygon (Hardhat) network** at `0x5FbDB2315678afecb367f032d93F642f64180aa3`.
- Allows authorized node issuers to cryptographically sign and anchor ratings (scaled transparently to a standard 300-900 credit rating).
- Integrates with Metamask; falls back to simulated secure ledger connection if no Web3 wallet is present.

### 3. Lender verification & Credit Matchmaking
- **Audit Credentials**: Lenders can verify any merchant wallet address to pull their audited rating trend directly from the Polygon ledger.
- **Credit Offers**: Lenders can configure loan parameters (principal, tenure, interest rate) to generate monthly EMIs and issue loan offers back to the merchant.

### 4. Premium Accessibility & Theme Controls
- Supports a global theme switcher supporting a dark slate high-tech mode and a clean light slate mode.
- Interactive text-to-speech (TTS) screen reader that dynamically synthesizes credit metrics in both **English** and **Hindi** to support diverse merchants.

---

## 🤖 AgentField & AgentFieldAI Integrations

TrustLedger integrates with **AgentField** to enforce strict code security, attestations, and ecosystem growth:

### 1. AgentFieldAI Threat Attestation (CSV Injection Defense)
Processing raw CSV sheets exposes parsing engines to security exploits. We integrated the **AgentFieldAI Threat Gate** inside our FastAPI backend:
- **Detection**: Incoming transactions are inspected for formula indicators starting with `=`, `+`, `@`, or command line parameters (`-`).
- **Response**: Upon detecting a threat (such as the `=cmd|' /C calc'!A0` preset), the backend terminates transaction processing with a `400 Bad Request` attestation.
- **Frontend Quarantine**: The frontend intercepts this response and immediately redirects to a custom **AgentFieldAI Threat Blocked** quarantine view. This isolates the session, displays logged details, and blocks the wallet from attempting Web3 smart contract executions.

### 2. Audited by `Agent-Field/sec-af`
We leverage [sec-af](https://github.com/Agent-Field/sec-af) (an AI-native security auditor on AgentField) to audit TrustLedger for critical vulnerabilities:
- **Solidity Smart Contracts**: Auditing access control modifiers to ensure only authorized issuers can call `mintScore`.
- **FastAPI Engine**: Ensuring variables processed in-memory do not leak to log files or temp disks, preserving DPDP Act 2023 compliance.

### 3. AgentField Directory Linking
To introduce merchants and lenders to autonomous web utilities, the Agentfield directory (`https://agentfield.ai/?utm_source=luma`) is integrated into:
- **Global Footer**: Standard resource link for exploring AI agents.
- **Demo Mode Banner**: Recommends exploring alternative credit scoring protocols on the Agentfield platform.

---

## 🛠️ Local Installation & Development

### 1. Blockchain Testnet (Hardhat)
```bash
cd blockchain
npm install
npx hardhat node
```

### 2. FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 3. Vite Frontend
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible locally at [http://127.0.0.1:5173](http://127.0.0.1:5173).
