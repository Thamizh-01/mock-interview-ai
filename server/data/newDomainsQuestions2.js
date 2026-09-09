/**
 * Questions for:
 * 1. Blockchain & Web3 (Solidity, Ethereum & EVM, Web3 Protocols & DeFi Security)
 * 2. QA & Test Automation (Automated Testing, API Testing & Performance, QA Methodologies)
 * 3. Product & UI/UX Design (UI/UX Design Systems, Product Management & Strategy)
 * Total: 8 Sub-types x 30 Questions = 240 Questions
 */

const newDomainsQuestions2 = {
  // -------------------------------------------------------------
  // 1. SOLIDITY & SMART CONTRACTS (30 Questions)
  // -------------------------------------------------------------
  solidity: [
    {
      id: 'sol-1',
      q: 'What is Reentrancy Attack in Solidity and how does the Checks-Effects-Interactions pattern prevent it?',
      a: 'Reentrancy occurs when an external contract call hands execution control over to an untrusted contract before the calling contract updates its internal state balances. The recipient\'s fallback/receive function calls back into the vulnerable withdraw function repeatedly, draining funds. Mitigation: 1) Follow Checks-Effects-Interactions (validate conditions, update state balances, then interact/transfer). 2) Use OpenZeppelin\'s ReentrancyGuard (nonReentrant modifier).'
    },
    {
      id: 'sol-2',
      q: 'What is the difference between storage, memory, and calldata in Solidity?',
      a: 'storage: persistent state variables stored permanently on the blockchain state trie (most gas-expensive). memory: temporary mutable byte array allocated in RAM during function execution, erased when execution halts. calldata: non-modifiable, non-allocated temporary byte array where function arguments are stored directly from the transaction payload (cheapest gas for read-only parameters).'
    },
    {
      id: 'sol-3',
      q: 'How does Integer Overflow/Underflow protection work in Solidity 0.8+ vs earlier SafeMath?',
      a: 'In Solidity <0.8.0, arithmetic operations silently wrapped around upon overflow/underflow (e.g. 0 - 1 = 2^256 - 1), requiring libraries like OpenZeppelin SafeMath. Starting in Solidity 0.8.0, the compiler includes built-in overflow/underflow checks that automatically revert transactions on arithmetic errors. If wrapping behavior is explicitly desired for gas savings, use unchecked { ... } blocks.'
    },
    {
      id: 'sol-4',
      q: 'What are ERC-20, ERC-721, and ERC-1155 token standards?',
      a: 'ERC-20: standard for fungible tokens where all tokens are identical and interchangeable (balances mapping). ERC-721: standard for Non-Fungible Tokens (NFTs) where every token has a unique uint256 tokenId and distinct metadata URI. ERC-1155: multi-token standard allowing a single smart contract to manage both fungible and non-fungible tokens with batch transfers, drastically reducing gas costs.'
    },
    {
      id: 'sol-5',
      q: 'What is the difference between transfer(), send(), and call() for sending Ether?',
      a: 'transfer() forwards a hardcoded 2300 gas stipend and automatically reverts on failure. send() forwards 2300 gas and returns a boolean (false on failure). Both are obsolete because 2300 gas is insufficient for modern contracts with complex fallback logic. Modern standard is call{value: amount}("") which forwards all remaining gas (or specified gas) and returns (bool success, bytes memory data).'
    },
    {
      id: 'sol-6',
      q: 'What is delegatecall and how is it used in Upgradeable Proxy Contracts (EIP-1967)?',
      a: 'delegatecall executes code from a target contract in the context of the calling contract: storage, msg.sender, and msg.value remain that of the caller. In proxy patterns (Transparent / UUPS), a proxy contract holds all state storage and Ether, delegating calls to an implementation logic contract; upgrading code simply involves updating the implementation contract address in proxy storage.'
    },
    {
      id: 'sol-7',
      q: 'What are Storage Collisions in Upgradeable Proxy contracts and how are they prevented?',
      a: 'Solidity assigns state variables to consecutive 32-byte storage slots (slot 0, slot 1). If an upgraded contract alters variable order or inserts a variable before existing ones, slot layouts collide, corrupting critical state. Prevent by: 1) Appending new variables only at the end. 2) Using EIP-1967 specific hash slots for proxy admin pointers. 3) Using ERC-7201 namespaced storage.'
    },
    {
      id: 'sol-8',
      q: 'What is Flash Loan attack and how do Price Oracles (TWAP / Chainlink) defend against it?',
      a: 'Flash loans borrow millions in capital with zero collateral, provided the loan is repaid within the same transaction block. Attackers use flash loans to manipulate spot prices in decentralized exchanges (Uniswap pools) within a single block. Defenses: never use spot DEX reserves for pricing; use decentralized, multi-sourced Chainlink Price Feeds or Time-Weighted Average Prices (TWAP).'
    },
    {
      id: 'sol-9',
      q: 'What are fallback() and receive() functions in Solidity?',
      a: 'receive() external payable executes when a contract receives plain Ether with empty calldata. fallback() external payable executes when no other function matches the requested function signature (or when Ether is sent with non-empty calldata and no receive() exists).'
    },
    {
      id: 'sol-10',
      q: 'What is Gas Optimization in Solidity (packing variables, custom errors, immutable)?',
      a: '1) Variable Packing: order storage variables so smaller types fit into a single 32-byte slot (e.g. two uint128 in one slot saves an SSTORE). 2) Custom Errors (error InsufficientBalance(); revert InsufficientBalance();) replace expensive revert strings. 3) immutable and constant keywords inline values into bytecode without storage lookups. 4) Use calldata instead of memory for read-only arguments.'
    },
    {
      id: 'sol-11',
      q: 'What is Front-Running and Maximal Extractable Value (MEV) in Ethereum?',
      a: 'Transactions sit in the public mempool before inclusion in blocks. MEV bots monitor the mempool and pay higher gas fees (priority fees) to front-run profitable transactions (arbitrage, liquidations) or sandwich user DEX swaps (front-running buy, user buy, back-running sell). Defenses include private RPC relays (Flashbots Protect) and slippage limits.'
    },
    {
      id: 'sol-12',
      q: 'What is tx.origin vs msg.sender and why should tx.origin NEVER be used for authorization?',
      a: 'msg.sender is the immediate caller of the function (can be a user or an intermediary contract). tx.origin is the original external account (EOA) that signed and initiated the transaction. If an authorized user is tricked into interacting with a malicious contract, that malicious contract can call the victim contract; tx.origin will still equal the user\'s address, bypassing security checks.'
    },
    {
      id: 'sol-13',
      q: 'What are Events and Indexed parameters in Solidity and how do Bloom filters track them?',
      a: 'Events allow smart contracts to record logs on the Ethereum blockchain that external dApps listen to via WebSockets. Up to 3 parameters can be marked indexed (topics); Ethereum uses Bloom filters in block headers to allow clients to query and filter events for specific addresses/IDs in O(1) without scanning entire block transactions.'
    },
    {
      id: 'sol-14',
      q: 'What is Denial of Service (DoS) with Unexpected Revert in Solidity?',
      a: 'Occurs when a contract pushes payments to multiple addresses iteratively (e.g. for loop sending Ether to bidders). If one recipient contract lacks a payable fallback or deliberately reverts, the entire transaction reverts, permanently halting the auction. Mitigation: Pull-over-Push pattern (users must withdraw their own funds individually).'
    },
    {
      id: 'sol-15',
      q: 'What is the difference between view and pure function modifiers?',
      a: 'view promises that the function will not modify state (it can read storage state variables). pure promises that the function will neither modify NOR read any storage state variables (it operates strictly on passed arguments and mathematical constants).'
    },
    {
      id: 'sol-16',
      q: 'What is AccessControl in OpenZeppelin and how does Role-Based Access Control (RBAC) work?',
      a: 'Instead of simple onlyOwner (single point of failure), AccessControl defines granular roles (bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE")). Addresses can be granted or revoked specific roles by role admin accounts using hasRole() modifiers.'
    },
    {
      id: 'sol-17',
      q: 'What is ERC-4337 (Account Abstraction) and Smart Contract Wallets?',
      a: 'ERC-4337 enables smart contract wallets without consensus layer changes. It introduces UserOperations sent to an alternative mempool, Bundlers that package them into transactions, and Paymasters that sponsor gas fees (enabling gasless transactions, social recovery, session keys, and multi-signature authorization).'
    },
    {
      id: 'sol-18',
      q: 'What is Selfdestruct in Solidity and EIP-6780 (Dencun upgrade)?',
      a: 'selfdestruct(recipient) removed a contract from state storage and forcefully sent its entire Ether balance to a recipient address. In EIP-6780 (Dencun hard fork), selfdestruct only deletes the contract and clears storage if called within the exact same transaction in which the contract was created.'
    },
    {
      id: 'sol-19',
      q: 'What is Signature Replay attack and EIP-712 Typed Structured Data?',
      a: 'Signature replay occurs when a valid off-chain signed message is submitted multiple times or reused on a different blockchain network. EIP-712 standardizes structured typed data signing with a Domain Separator containing the verifying contract address, chainId, and a nonce to ensure signatures are valid only once on the designated contract.'
    },
    {
      id: 'sol-20',
      q: 'What is Foundry (Forge, Cast, Anvil) vs Hardhat in modern Solidity development?',
      a: 'Hardhat is TypeScript-based, using ethers.js/viem for testing. Foundry is Rust-based, blazingly fast, and allows writing unit and integration tests directly in Solidity (Forge), providing built-in fuzz testing, invariant testing, and trace debugging without JavaScript context switching.'
    },
    {
      id: 'sol-21',
      q: 'What is Fuzz Testing and Invariant Testing in smart contract security?',
      a: 'Fuzz testing generates thousands of random inputs to find edge cases that trigger reverts or unexpected state mutations. Invariant testing asserts that fundamental business properties (e.g. total_pool_shares == sum_of_user_balances) hold true across arbitrary sequences of complex transactions.'
    },
    {
      id: 'sol-22',
      q: 'What is create2 opcode and how does Deterministic Contract Deployment work?',
      a: 'create computes address from: keccak256(rlp([sender, nonce])). create2 computes address deterministically before deployment: keccak256(0xff ++ sender ++ salt ++ keccak256(bytecode)). This enables predicting contract addresses ahead of time across all EVM chains and deploying counterfactual contracts.'
    },
    {
      id: 'sol-23',
      q: 'What is Slippage Tolerance in Automated Market Maker (AMM) token swaps?',
      a: 'Slippage is the difference between expected price and executed price due to volatility or front-running. A transaction specifies minAmountOut; if the received tokens fall below this threshold during execution, the transaction reverts to protect the user from sandwich attacks.'
    },
    {
      id: 'sol-24',
      q: 'What is a Multi-Signature Wallet (Gnosis / Safe) architecture?',
      a: 'A smart contract wallet requiring M-of-N authorized owners to sign transactions before execution. Owners submit and confirm transaction hashes off-chain or on-chain; once the quorum threshold is reached, any owner can trigger execution.'
    },
    {
      id: 'sol-25',
      q: 'What is Assembly (Yul) in Solidity and when should inline assembly be used?',
      a: 'Yul is an intermediate low-level language providing direct access to EVM opcodes (mload, sstore, call, extcodesize). Inline assembly (assembly { ... }) allows extreme gas optimizations and operations impossible in pure Solidity, but bypasses compiler safety checks.'
    },
    {
      id: 'sol-26',
      q: 'What is Timelock Controller in decentralized governance?',
      a: 'A timelock forces an intentional delay (e.g. 48 hours) between when a governance proposal passes and when the transaction is actually executed on-chain. This gives users time to inspect approved changes, audit code, or exit the protocol if they disagree with changes.'
    },
    {
      id: 'sol-27',
      q: 'What is Oracle Manipulation and how do Read-Only Reentrancy attacks exploit it?',
      a: 'Read-only reentrancy occurs when an attacker triggers a state-modifying action in contract A (like burning LP tokens), and before contract A recalculates balances, contract B reads the temporary skewed price from contract A\'s view functions to execute an under-collateralized loan.'
    },
    {
      id: 'sol-28',
      q: 'What is Solidity ABI Encoding (abi.encode, abi.encodePacked, abi.encodeWithSignature)?',
      a: 'abi.encode standardizes parameters according to official ABI specification with 32-byte padding. abi.encodePacked concatenates variables without padding (saves space, but causes hash collisions if multiple dynamic types like string/bytes are concatenated into keccak256). abi.encodeWithSignature prepends the 4-byte function selector.'
    },
    {
      id: 'sol-29',
      q: 'What is Slither and Mythril in smart contract static analysis?',
      a: 'Slither is a static analysis framework for Solidity that converts code to SlithIR intermediate representation, detecting common vulnerabilities (reentrancy, uninitialized variables, shadow variables). Mythril uses symbolic execution and SMT solvers to find execution paths leading to exploits.'
    },
    {
      id: 'sol-30',
      q: 'What is Decentralized Staking and Liquid Staking Derivatives (Lido / stETH)?',
      a: 'Ethereum Proof-of-Stake requires 32 ETH locked in validators. Liquid Staking protocols pool ETH from multiple users to run validators, issuing a fungible ERC-20 token (e.g. stETH) representing the deposited ETH plus accrued staking rewards, which can be traded or used in DeFi.'
    }
  ],

  // -------------------------------------------------------------
  // 2. ETHEREUM & EVM ARCHITECTURE (30 Questions)
  // -------------------------------------------------------------
  ethereum_evm: [
    {
      id: 'evm-1',
      q: 'What is the Ethereum Virtual Machine (EVM) and how does its Stack-based architecture work?',
      a: 'The EVM is a quasi-Turing complete, sandboxed state machine executing bytecode across all Ethereum nodes. It has a word size of 256 bits (32 bytes), optimized for cryptographic hashes (keccak256). It is stack-based with a maximum stack depth of 1024 words, operating on stack instructions (PUSH, POP, DUP, SWAP, ADD, MUL).'
    },
    {
      id: 'evm-2',
      q: 'Explain the 4 EVM Data Storage components: Stack, Memory, Storage, and Calldata.',
      a: '1) Stack: volatile LIFO data structure of max 1024 256-bit elements (cheap gas). 2) Memory: linear volatile byte array allocated per execution context, expanding quadratically in gas cost. 3) Storage: persistent key-value store mapping 2^256 slots of 32 bytes to 32-byte values in the global World State trie. 4) Calldata: immutable transaction input payload.'
    },
    {
      id: 'evm-3',
      q: 'What is the World State in Ethereum and how does the Merkle Patricia Trie represent it?',
      a: 'World State maps all Ethereum addresses to Accounts (nonce, balance, storageRoot, codeHash). It is stored in a modified Merkle Patricia Trie (combining Radix trie efficiency with Merkle tree cryptographic integrity), enabling nodes to verify account states and generate light-client cryptographic proofs in O(log N).'
    },
    {
      id: 'evm-4',
      q: 'What are Externally Owned Accounts (EOA) vs Contract Accounts?',
      a: 'EOA: controlled by private keys, has no code, can initiate transactions, and costs zero storage to create. Contract Account: controlled by its compiled bytecode, has contract storage, cannot initiate transactions on its own (must be triggered by an EOA or another contract), and has a codeHash.'
    },
    {
      id: 'evm-5',
      q: 'How does Ethereum Gas mechanism work: Gas Limit, Base Fee, Priority Fee (EIP-1559)?',
      a: 'EIP-1559 introduced: 1) Base Fee: dynamically adjusted protocol fee per gas, burned automatically to offset ETH issuance. 2) Priority Fee (Tip): incentive paid directly to block validators. Total Fee = Units of Gas Used * (Base Fee + Priority Fee). Gas Limit sets the maximum gas units a user is willing to spend.'
    },
    {
      id: 'evm-6',
      q: 'What is the difference between Opcode SSTORE and SLOAD and why are they so expensive?',
      a: 'SLOAD reads a 32-byte word from storage; SSTORE writes a 32-byte word to persistent storage. They are the most gas-expensive EVM opcodes (cold SLOAD costs 2100 gas; writing a non-zero to zero slot costs up to 20,000 gas) because every full node globally must persist and update that storage value forever.'
    },
    {
      id: 'evm-7',
      q: 'What is Proof of Stake (PoS) consensus: Beacon Chain, Validators, Attestations, and Slashing?',
      a: 'Ethereum PoS replaced PoW in "The Merge". Validators stake 32 ETH to propose and attest to blocks. Time is divided into Slots (12s) and Epochs (32 slots / 6.4 min). Validators earn rewards for accurate attestations. Slashing penalizes malicious actions (double signing, surround voting) by burning part of the validator\'s 32 ETH and forcibly ejecting them.'
    },
    {
      id: 'evm-8',
      q: 'What are Layer 2 Scaling Solutions: Optimistic Rollups vs Zero-Knowledge (ZK) Rollups?',
      a: 'Rollups process transactions off-chain and post compressed batch data to L1 Ethereum: Optimistic Rollups (Arbitrum, Optimism) assume transactions are valid by default, enforcing a 7-day challenge window for Fraud Proofs. ZK-Rollups (zkSync, Starknet) compute cryptographic Validity Proofs (SNARKs/STARKs) verifying mathematical correctness instantly on L1.'
    },
    {
      id: 'evm-9',
      q: 'What is EIP-4844 (Proto-Danksharding) and Blob Transactions?',
      a: 'EIP-4844 introduced temporary data "Blobs" attached to blocks that persist on Ethereum nodes for ~18 days before being pruned automatically. L2 rollups post their transaction batches into blobs rather than permanent calldata, slashing Layer 2 transaction fees by 90-95%.'
    },
    {
      id: 'evm-10',
      q: 'What is EVM Bytecode and Function Selectors (4-byte signature)?',
      a: 'EVM bytecode is a sequence of hexadecimal opcodes. When an external call is made, the first 4 bytes of calldata represent the Function Selector: the first 4 bytes of keccak256("transfer(address,uint256)"). The contract\'s dispatcher uses a jump table to match the selector and jump to function code.'
    },
    {
      id: 'evm-11',
      q: 'What is a "Stack Too Deep" error in Solidity and how does the EVM 16-element limit cause it?',
      a: 'The EVM only allows direct access to the top 16 elements on the stack (using DUP1-DUP16 and SWAP1-SWAP16). When a function declares more than 16 local variables/parameters active simultaneously, the compiler cannot swap or read variables deeper on the stack. Mitigate by grouping variables into structs or splitting functions.'
    },
    {
      id: 'evm-12',
      q: 'What is Gas Left (GAS opcode) and the 63/64th Rule for external calls (EIP-150)?',
      a: 'When an external contract call is made, EIP-150 mandates that at most 63/64 of the remaining gas is forwarded to the child call. The calling contract always retains at least 1/64 of remaining gas, preventing a malicious child contract from consuming all gas and preventing the parent from finishing execution.'
    },
    {
      id: 'evm-13',
      q: 'What is the difference between CALL, STATICCALL, and DELEGATECALL opcodes?',
      a: 'CALL executes code in target context with normal state reading and writing. STATICCALL executes code in target context, but strictly forbids state modifications (SSTORE, LOG, CREATE) - throwing an error if state is modified. DELEGATECALL executes target code in the calling contract\'s context.'
    },
    {
      id: 'evm-14',
      q: 'What is Memory Expansion Cost in the EVM and why is it non-linear?',
      a: 'Memory gas cost increases quadratically: C_mem(a) = 3*a + (a^2)/512, where a is the number of 32-byte memory words. Writing to memory index 10,000 is cheap, but expanding memory to gigabytes quickly exhausts transaction gas limits, preventing memory exhaustion attacks on nodes.'
    },
    {
      id: 'evm-15',
      q: 'What is Precompiled Contracts in the EVM (ecrecover, sha256, bn256Pairing)?',
      a: 'Precompiles are complex cryptographic operations implemented directly in native node client code (Go/Rust/C++) rather than EVM bytecode, assigned to fixed addresses 0x01 through 0x09 (e.g. 0x01 is ecrecover, 0x08 is ecPairing). They execute at near-native speeds with low fixed gas costs.'
    },
    {
      id: 'evm-16',
      q: 'What is Finality in Ethereum PoS (Casper FFG)?',
      a: 'Casper the Friendly Finality Ghost (FFG) finalizes blocks when 2/3 of all staked validators sign off on epoch checkpoints. Once a block is finalized (after 2 epochs / ~12.8 minutes), reverting it requires burning at least 1/3 of the entire global staked ETH supply ($10B+).'
    },
    {
      id: 'evm-17',
      q: 'What is MEV-Boost and Proposer-Builder Separation (PBS)?',
      a: 'PBS separates block building from block proposal. Specialized Block Builders assemble transactions from private order flows and MEV searchers to maximize fees. Validators (Proposers) simply select the most profitable block header via MEV-Boost relays without knowing internal transactions, democratizing MEV rewards.'
    },
    {
      id: 'evm-18',
      q: 'What is State Rent vs State Expiry debate in Ethereum scaling?',
      a: 'Ethereum state grows continuously as contracts are deployed, requiring terabytes of fast SSD storage on nodes. State Expiry proposes that state inactive for over a year is pruned from active node memory; accessing expired state requires providing a Merkle witness proof alongside the transaction.'
    },
    {
      id: 'evm-19',
      q: 'What is EVM Object Format (EOF)?',
      a: 'EOF is an upgrade to EVM bytecode structure introducing a validated container format with static header sections (types, code, data). It enables static code validation during deployment, separates code from data, removes runtime code introspection (EXTCODECOPY), and optimizes JIT compilation.'
    },
    {
      id: 'evm-20',
      q: 'What is the Transaction Lifecycle: from RPC submission to Block Inclusion?',
      a: '1) User signs transaction with private key. 2) Submitted to node via eth_sendRawTransaction. 3) Node validates signature, nonce, and balance; broadcasts to mempool. 4) Block builder includes transaction. 5) Block proposer proposes block. 6) Attestation committees vote. 7) Transaction receipt (logs, gas used, status) is generated.'
    },
    {
      id: 'evm-21',
      q: 'What is a Nonce in an Ethereum Account and what causes "Nonce Too Low" or Stuck Transactions?',
      a: 'The account nonce is a scalar counter equal to the number of transactions sent from that address. Transactions must be processed strictly in sequential order. A stuck transaction occurs when a transaction has a low gas fee; all higher-nonce transactions remain queued until the stuck nonce is confirmed or replaced with higher gas (Speed Up).'
    },
    {
      id: 'evm-22',
      q: 'What is Geth, Nethermind, Besu, and Erigon (Execution Clients)?',
      a: 'Execution clients parse state, execute EVM bytecode, and maintain the transaction pool. Geth (Go), Nethermind (C#), Besu (Java), and Erigon (optimized modular database design). Client diversity is vital: if a majority client (Geth) has a critical bug, it risks forking the network.'
    },
    {
      id: 'evm-23',
      q: 'What is Consensus Client (Prysm, Lighthouse, Teku) vs Execution Client in Ethereum post-Merge?',
      a: 'Post-Merge, an Ethereum full node runs two coupled software clients communicating via Engine API: 1) Consensus Client (Lighthouse/Prysm) handles Proof-of-Stake consensus, peer discovery, and attestations. 2) Execution Client (Geth) executes EVM bytecode and manages state storage.'
    },
    {
      id: 'evm-24',
      q: 'What is Warm vs Cold Storage Access (EIP-2929)?',
      a: 'EIP-2929 increased gas costs for first-time access to storage slots or addresses in a transaction (Cold access: 2100 gas) to reflect disk I/O cost. Subsequent accesses within the same transaction are added to an accessed_addresses set (Warm access: 100 gas).'
    },
    {
      id: 'evm-25',
      q: 'What is Transient Storage (EIP-1153: TSTORE and TLOAD) introduced in Dencun?',
      a: 'Transient Storage behaves like storage, but is cleared at the end of the transaction. TSTORE and TLOAD cost only 100 gas, enabling hyper-efficient reentrancy guards, intra-transaction communication, and temporary memory buffers without polluting global persistent state.'
    },
    {
      id: 'evm-26',
      q: 'What is Gas Refund mechanism and why was it capped (EIP-3529)?',
      a: 'Clearing storage slots (setting to zero) previously gave large gas refunds (up to 50% of gas). Attackers exploited this with "GasTokens" (minting state when gas was cheap and freeing it when gas was high). EIP-3529 capped refunds to 20% and eliminated refunds for selfdestruct, killing GasTokens.'
    },
    {
      id: 'evm-27',
      q: 'What is the EVM Instruction Pointer and JUMP / JUMPI rules (JUMPDEST)?',
      a: 'The Instruction Pointer (PC) points to the current opcode byte. JUMP and JUMPI change the PC to branch execution. To prevent jumping into the middle of multi-byte data, the EVM strictly enforces that any jump destination must point to a designated JUMPDEST (0x5B) opcode; otherwise execution reverts.'
    },
    {
      id: 'evm-28',
      q: 'What are EVM Log Topics and how are indexed parameters stored?',
      a: 'The LOG0-LOG4 opcodes append log entries to block receipts. Topic 0 is always the 32-byte hash of the event signature: keccak256("Transfer(address,address,uint256)"). Topics 1, 2, and 3 store indexed 32-byte parameters. Unindexed parameters are ABI-encoded in the log data section.'
    },
    {
      id: 'evm-29',
      q: 'What is zkEVM (Type 1, Type 2, Type 3, Type 4)?',
      a: 'Type 1: 100% Ethereum-equivalent (exact consensus, proof generation takes hours). Type 2: 100% EVM-equivalent (minor state trie modifications, fast proofs; e.g. Scroll, Polygon zkEVM). Type 3: almost EVM equivalent (removes hard-to-prove precompiles). Type 4: High-level language equivalent (compiles Solidity to custom zk-friendly VM, e.g. zkSync Era).'
    },
    {
      id: 'evm-30',
      q: 'What is Data Availability (DA) problem and Celestia / EigenDA?',
      a: 'Rollup execution is verified by proofs, but nodes must guarantee that raw transaction data is publicly accessible to reconstruct state if rollup sequencers go rogue. EigenDA and Celestia provide dedicated, high-throughput modular Data Availability layers at a fraction of Ethereum L1 storage cost.'
    }
  ],

  // -------------------------------------------------------------
  // 3. WEB3 PROTOCOLS & DEFI SECURITY (30 Questions)
  // -------------------------------------------------------------
  web3_defi: [
    {
      id: 'defi-1',
      q: 'What is Uniswap v2 Constant Product Market Maker formula: x * y = k?',
      a: 'Uniswap v2 pools two tokens (X and Y). The invariant is x * y = k, where x is the reserve of token A, y is reserve of token B, and k is a constant. When a trader buys token X by depositing token Y, y increases, and x must decrease to maintain k, dynamically increasing the price of token X.'
    },
    {
      id: 'defi-2',
      q: 'What is Uniswap v3 Concentrated Liquidity and Tick ranges?',
      a: 'In Uniswap v2, liquidity is spread uniformly across 0 to infinity price range (99% of capital sits idle). Uniswap v3 introduces Concentrated Liquidity: Liquidity Providers (LPs) allocate capital within custom price intervals [p_lower, p_upper] divided into discrete Ticks, delivering up to 4000x higher capital efficiency and earning higher trading fees.'
    },
    {
      id: 'defi-3',
      q: 'What is Impermanent Loss (IL) in DeFi liquidity provision and when does it become permanent?',
      a: 'Impermanent loss is the difference in value between holding tokens in an AMM liquidity pool versus holding them in a private wallet when relative token prices diverge. It is "impermanent" because if relative prices return to their initial ratio, the loss disappears. It becomes permanent the instant the LP withdraws liquidity.'
    },
    {
      id: 'defi-4',
      q: 'What is Collateralized Debt Position (CDP) and Over-collateralization (MakerDAO / DAI)?',
      a: 'In decentralized lending (MakerDAO), borrowers mint stablecoins (DAI) by depositing crypto assets (ETH) as collateral. Because crypto is volatile, CDPs require Over-collateralization (e.g. 150% collateral ratio: deposit $150 of ETH to mint $100 DAI). If collateral value drops near the threshold, the position is liquidated.'
    },
    {
      id: 'defi-5',
      q: 'What is Liquidation and Health Factor in Aave / Compound?',
      a: 'Health Factor (HF) measures the safety of a borrow position: HF = (Total Collateral in ETH * Liquidation Threshold) / Total Borrow in ETH. If HF drops below 1.0, third-party liquidators repay up to 50% of the borrowed debt in exchange for seized collateral at a liquidation bonus discount (e.g. 5-10%).'
    },
    {
      id: 'defi-6',
      q: 'What is Yield Farming and Liquidity Mining in DeFi protocols?',
      a: 'Yield farming is the practice of moving crypto assets between different DeFi protocols to maximize returns (staking, lending, LP fees). Liquidity Mining rewards users who provide liquidity to pools with native protocol governance tokens (e.g. earning UNI or COMP on top of trading fees).'
    },
    {
      id: 'defi-7',
      q: 'What is Curve Finance (Stableswap invariant) and why is it optimized for pegged assets?',
      a: 'Curve combines the Constant Product formula (x*y=k) with the Constant Sum formula (x+y=k). For assets pegged to the same value (USDC, USDT, DAI or ETH/stETH), Curve produces an ultra-flat bonding curve around 1:1 price parity, allowing massive trades with virtually zero price slippage.'
    },
    {
      id: 'defi-8',
      q: 'What is a Flash Loan and how do Uncollateralized Loans function within a single block?',
      a: 'A Flash loan (pioneered by Aave) allows borrowing millions without collateral under the strict condition that the principal plus a small fee (e.g. 0.09%) is returned before the transaction completes. If repayment fails, the EVM reverts the entire transaction, meaning the funds never left the pool.'
    },
    {
      id: 'defi-9',
      q: 'What is Price Oracle Manipulation and why is TWAP (Time-Weighted Average Price) necessary?',
      a: 'Attackers manipulate low-liquidity spot AMM pools using flash loans to inflate asset values, borrowing massive collateral. TWAP tracks prices over rolling time windows (e.g. 30 minutes) using cumulative prices, making single-block price manipulation impossible since instantaneous spikes have negligible impact on the time-weighted average.'
    },
    {
      id: 'defi-10',
      q: 'What is Sandwich Attack in MEV and how do private RPC endpoints prevent it?',
      a: 'A searcher bot detects a pending user swap in the public mempool. The bot submits two transactions: 1) Front-run: buys tokens before user, driving price up. 2) User swap executes at higher price with slippage. 3) Back-run: bot sells immediately for profit. Private RPCs (Flashbots Protect) route transactions directly to block builders, hiding them from the public mempool.'
    },
    {
      id: 'defi-11',
      q: 'What is Cross-Chain Bridge Security (Lock & Mint vs Liquidity Pools vs Burn & Mint)?',
      a: 'Lock & Mint: locks token on source chain and mints wrapped token on destination (vulnerable if central custodian or multisig validator is hacked, e.g. Ronin $625M hack). Liquidity Pools: maintains liquidity pools on both sides, swapping native assets. Burn & Mint (Circle CCTP): burns native token on source and mints native token on destination.'
    },
    {
      id: 'defi-12',
      q: 'What is Automated Vault (Yearn Finance) and Yield Aggregation?',
      a: 'Yield aggregators automate yield optimization. Users deposit tokens into a smart contract Vault. The Vault executes automated yield strategies (moving capital across Aave, Curve, and Compound, reinvesting rewards, and compounding interest) while socializing gas costs across all pool depositors.'
    },
    {
      id: 'defi-13',
      q: 'What is Staking vs Restaking (EigenLayer)?',
      a: 'Staking locks 32 ETH to secure Ethereum consensus. Restaking (EigenLayer) allows staked ETH to be repurposed to secure Actively Validated Services (AVSs: bridges, oracles, data availability layers) simultaneously, earning additional yield while exposing the stake to additional slashing conditions.'
    },
    {
      id: 'defi-14',
      q: 'What is Real World Assets (RWA) tokenization in DeFi?',
      a: 'RWA tokenizes traditional financial assets (US Treasury bills, real estate, private credit) as ERC-20 tokens on-chain (e.g. Ondo USDY, BlackRock BUIDL), bringing predictable risk-free yields from traditional finance directly into decentralized finance.'
    },
    {
      id: 'defi-15',
      q: 'What is Decentralized Governance (GovernorAlpha/Bravo, Compound-style)?',
      a: 'Token holders vote on on-chain proposals based on token balances snapshot at proposal creation block. Successful proposals queue in a Timelock contract, which autonomously executes bytecoded function calls (e.g. updating interest rate parameters or treasury grants).'
    },
    {
      id: 'defi-16',
      q: 'What is a Governance 51% Attack (Beanstalk Farms exploit)?',
      a: 'An attacker takes a flash loan to acquire a majority (>51%) of governance voting tokens, creates a malicious proposal, votes for it immediately, bypasses emergency timelocks, and executes the proposal to drain the entire protocol treasury, repaying the flash loan in the same transaction.'
    },
    {
      id: 'defi-17',
      q: 'What is Synthetix and Synthetic Assets (Synths)?',
      a: 'Synthetix allows minting synthetic assets (sUSD, sBTC, sTSLA) tracking price feeds without owning the underlying asset. Positions are backed by high over-collateralization (e.g. 400% SNX) against a shared debt pool, allowing zero-slippage trades against the smart contract contract debt.'
    },
    {
      id: 'defi-18',
      q: 'What is Perpetual Protocol / Decentralized Perps (dYdX, GMX) and Funding Rates?',
      a: 'Perpetual contracts allow leveraged trading without expiration dates. Funding Rate is a periodic cash flow exchanged between long and short traders to anchor the perpetual contract price to the spot index price: if perp price > spot, longs pay shorts; if perp price < spot, shorts pay longs.'
    },
    {
      id: 'defi-19',
      q: 'What is Bad Debt in DeFi lending and how do Reserve Funds handle insolvency?',
      a: 'Bad debt occurs when the value of collateral crashes faster than liquidators can liquidate positions, leaving total debt higher than remaining collateral. Protocols mitigate this with Safety Modules (staked governance tokens slashed to cover deficits) and Insurance / Reserve Funds.'
    },
    {
      id: 'defi-20',
      q: 'What is ERC-4626 (Tokenized Vault Standard)?',
      a: 'ERC-4626 standardizes yield-bearing vaults. Prior to ERC-4626, every protocol (Yearn, Aave, Compound) used custom share-token interfaces. ERC-4626 provides uniform methods (deposit, mint, withdraw, redeem, totalAssets, convertToShares), eliminating integration fragmentation across DeFi.'
    },
    {
      id: 'defi-21',
      q: 'What is The Inflation Attack / First Depositor Bug in ERC-4626 vaults?',
      a: 'An attacker deposits 1 wei to mint 1 share, then donates a massive amount (e.g. 10,000 ETH) directly to the vault. The price per share inflates massively. When a victim deposits funds, integer division rounds their minted shares down to 0, allowing the attacker to redeem and steal the victim\'s deposit. Fix: mint dead shares to address(0).'
    },
    {
      id: 'defi-22',
      q: 'What is Algorithmic Stablecoin vs Fiat-Backed Stablecoin (Terra/Luna collapse)?',
      a: 'Fiat-backed stablecoins (USDC, USDT) maintain 1:1 reserves in bank cash/T-bills. Algorithmic stablecoins (like Terra UST) rely on paired mint-burn arbitrage mechanics with a native volatile token (LUNA) without external backing. Under market panic, a "death spiral" hyper-inflates the native token, collapsing the peg.'
    },
    {
      id: 'defi-23',
      q: 'What is GMX GLP / GM Pool Multi-Asset Index architecture?',
      a: 'GMX uses a multi-asset pool (GLP / GM) containing index assets (ETH, BTC, USDC). Traders trade against the pool with zero price impact using Chainlink oracles. LPs deposit capital to mint pool shares, acting as the counterparty to all traders (earning trading fees plus trader losses, but taking on trader win risk).'
    },
    {
      id: 'defi-24',
      q: 'What is Read-Only Reentrancy in Curve Liquidity Pools?',
      a: 'Curve pool contracts update balances when liquidity is removed (remove_liquidity), but the virtual price getter get_virtual_price() is marked view/pure. An attacker removes liquidity, triggering a callback before the virtual price updates, using the inflated price in external lending protocols that rely on Curve as an oracle.'
    },
    {
      id: 'defi-25',
      q: 'What is DeFi Composability and "Money Legos"?',
      a: 'Composability means smart contracts can interact, build upon, and integrate with other smart contracts like open building blocks. A single transaction can borrow funds on Aave, swap on Uniswap, add liquidity to Curve, and deposit into Yearn seamlessly.'
    },
    {
      id: 'defi-26',
      q: 'What is veTokenomics (Vote-Escrowed Tokens like veCRV)?',
      a: 'Users lock governance tokens (CRV) for a chosen duration (1 to 4 years) in exchange for non-transferable veCRV. veCRV grants boosted liquidity rewards, voting power on pool gauge weights (directing token emissions), and protocol fee shares, encouraging long-term protocol alignment over speculative dumping.'
    },
    {
      id: 'defi-27',
      q: 'What is Proof of Reserve (PoR) in centralized exchanges and bridges (Chainlink PoR)?',
      a: 'Proof of Reserve uses cryptographic Merkle tree auditing and automated Chainlink oracle checks to verify on-chain that custodians hold sufficient real assets matching issued wrapped tokens or customer deposits in real time.'
    },
    {
      id: 'defi-28',
      q: 'What is Tornado Cash and Zero-Knowledge Mixer architecture?',
      a: 'Tornado Cash breaks the on-chain link between source and destination addresses using zk-SNARKs. A user deposits ETH and receives a cryptographic secret (commitment). Later, the user withdraws from a new address by providing a zero-knowledge proof proving they deposited funds without revealing which commitment was theirs.'
    },
    {
      id: 'defi-29',
      q: 'What is Bug Bounty (Immunefi) and Whitehat Responsible Disclosure in Web3?',
      a: 'Immunefi is Web3\'s primary bug bounty platform. Whitehat hackers identify smart contract vulnerabilities and responsibly disclose them to protocol teams, earning payouts (up to $10M) rather than exploiting the vulnerability, protecting user funds.'
    },
    {
      id: 'defi-30',
      q: 'What are Smart Contract Audits and why are they insufficient on their own?',
      a: 'An audit is a manual and automated review of smart contract code by security firms (OpenZeppelin, Trail of Bits). Audits identify known vulnerabilities, but do not guarantee 100% security: they cannot prevent novel economic attack vectors, composability risks with external protocols, or oracle manipulation.'
    }
  ],

  // -------------------------------------------------------------
  // 4. AUTOMATED TESTING (PLAYWRIGHT / CYPRESS / SELENIUM) (30 Questions)
  // -------------------------------------------------------------
  automation_testing: [
    {
      id: 'qa-auto-1',
      q: 'What is the architectural difference between Playwright, Cypress, and Selenium WebDriver?',
      a: 'Selenium uses JSON Wire Protocol / W3C WebDriver via separate browser drivers (chromedriver) over HTTP, sending out-of-process commands. Cypress executes tests directly inside the browser run-loop in the same execution context as the app (limited to single tab/domain). Playwright uses native Chrome DevTools Protocol (CDP) and WebSocket connections to control multiple isolated browser contexts out-of-process at high speed.'
    },
    {
      id: 'qa-auto-2',
      q: 'What is the Page Object Model (POM) and why is it recommended for UI test maintenance?',
      a: 'POM is a design pattern that abstracts web pages into reusable class representations containing locators and user interaction methods. Test scripts interact with page objects rather than raw DOM selectors directly. When UI selectors change, updates are made in a single page class file rather than hundreds of individual test cases.'
    },
    {
      id: 'qa-auto-3',
      q: 'What is Auto-Waiting in Playwright / Cypress and how does it eliminate flaky sleep() statements?',
      a: 'Auto-waiting automatically checks actionability criteria (element attached to DOM, visible, stable, enabled, and receiving events) before performing actions (click, fill). It eliminates arbitrary hardcoded thread sleeps (Thread.sleep(5000)), reducing flakiness and accelerating test execution.'
    },
    {
      id: 'qa-auto-4',
      q: 'What are Browser Contexts in Playwright and how do they achieve multi-tab and parallel test isolation?',
      a: 'A BrowserContext is an isolated incognito-like session within a single browser instance. Creating contexts takes milliseconds and requires negligible memory. Each context has private cookies, localStorage, and cache, allowing thousands of independent test cases to run in parallel without cross-contamination.'
    },
    {
      id: 'qa-auto-5',
      q: 'What are Locators in Playwright and why are Role Locators (getByRole) preferred over XPath/CSS?',
      a: 'Playwright locators (page.getByRole(\'button\', { name: \'Submit\' })) mirror how assistive technologies and real users interact with the page. They are resilient to internal markup and styling changes (unlike fragile CSS paths or absolute XPaths) and simultaneously validate web accessibility (a11y).'
    },
    {
      id: 'qa-auto-6',
      q: 'What is Network Interception / Mocking in Playwright (page.route()) and Cypress (cy.intercept())?',
      a: 'Network interception intercepts HTTP requests before they leave the browser. Tests can stub backend responses with mock JSON data (e.g. mocking 500 server errors, slow connections, or edge case states) without depending on live backend databases, ensuring deterministic and ultra-fast UI testing.'
    },
    {
      id: 'qa-auto-7',
      q: 'What is Visual Regression Testing (Snapshot / Pixel Diffing)?',
      a: 'Visual regression testing compares a screenshot of a rendered UI component against an approved baseline image pixel-by-pixel (expect(page).toHaveScreenshot()). It catches unintended visual shifts, color mismatches, font breakage, and CSS regressions across browser engines.'
    },
    {
      id: 'qa-auto-8',
      q: 'What is Headless vs Headed browser execution and when should each be used?',
      a: 'Headless mode executes the browser without displaying the graphical user interface, running ~30-50% faster and consuming significantly less CPU/RAM (standard for CI/CD pipelines). Headed mode opens visible browser windows, essential for local debugging and inspecting user flows.'
    },
    {
      id: 'qa-auto-9',
      q: 'What is Playwright Trace Viewer and how does it revolutionize test failure debugging?',
      a: 'Playwright Trace Viewer records a complete execution trace (DOM snapshots before and after every action, network requests/responses, console logs, and video frames). Developers open the interactive trace to scrub through time, inspect DOM state at the exact millisecond of failure, and debug without reproducing locally.'
    },
    {
      id: 'qa-auto-10',
      q: 'What is Flaky Test detection, Quarantining, and Retries in automation pipelines?',
      a: 'A flaky test fails intermittently without code changes due to network latency, timing, or shared state. Best practices: enable automated retries in CI (retries: 2), quarantine persistently flaky tests into a non-blocking test suite, record traces on failure, and eliminate race conditions.'
    },
    {
      id: 'qa-auto-11',
      q: 'What are Shadow DOM and Iframes and how do modern automation tools interact with them?',
      a: 'Shadow DOM encapsulates internal DOM trees. Playwright locators pierce Shadow DOM boundaries automatically by default. For Iframes, Playwright uses frameLocator(\'#my-iframe\').getByRole(...) to locate elements within nested cross-origin frames cleanly without manual frame switching.'
    },
    {
      id: 'qa-auto-12',
      q: 'What is Data-Driven Testing (Parametrized Tests) in automated test frameworks?',
      a: 'Data-driven testing executes the identical test logic against an array of multiple input datasets and expected outputs (e.g. valid emails, invalid emails, empty fields). It maximizes test coverage without duplicating test implementation code.'
    },
    {
      id: 'qa-auto-13',
      q: 'What is Cypress Architecture limitation regarding Multi-Domain and Multi-Tab support?',
      a: 'Because Cypress executes inside the browser tab, historically it could not interact with multiple browser tabs or navigate across multiple different superdomains within a single test case (requires cy.origin()). Playwright controls the browser out-of-process, handling multiple simultaneous domains and tabs effortlessly.'
    },
    {
      id: 'qa-auto-14',
      q: 'How do you handle Authentication State caching in Playwright (storageState)?',
      a: 'Instead of logging in via UI before every single test case (adding minutes to test runs), a global setup script logs in once and saves the authenticated cookies and localStorage to a storageState.json file. Tests load the saved state, starting immediately as authenticated users.'
    },
    {
      id: 'qa-auto-15',
      q: 'What is Explicit Wait vs Implicit Wait vs Fluent Wait in Selenium WebDriver?',
      a: 'Implicit wait sets a global poll timeout for all element lookups. Explicit wait pauses execution until a specific ExpectedCondition (elementToBeClickable, visibilityOf) is met. Fluent wait is an explicit wait with configurable polling intervals (e.g. check every 250ms) and ignored exceptions.'
    },
    {
      id: 'qa-auto-16',
      q: 'What is Selenium Grid and Cloud Test Platforms (BrowserStack, SauceLabs)?',
      a: 'Selenium Grid routes test execution commands across a distributed network of remote worker nodes running different operating systems (Windows, macOS, Linux) and browsers. Cloud platforms provide on-demand access to thousands of real mobile devices and browser versions.'
    },
    {
      id: 'qa-auto-17',
      q: 'What are Custom Commands in Cypress and Fixtures?',
      a: 'Cypress Custom Commands (Cypress.Commands.add(\'login\', ...)) create reusable workflow shortcuts across tests. Fixtures (cy.fixture(\'users.json\')) load external static test data for mocking API responses or populating form inputs.'
    },
    {
      id: 'qa-auto-18',
      q: 'How do you handle File Uploads and Downloads in automated browser tests?',
      a: 'Playwright provides setInputFiles(\'input[type="file"]\', \'path/to/file.png\') which directly populates the file input without triggering native OS file dialogs. For downloads, page.waitForEvent(\'download\') captures the download stream and verifies file size/content.'
    },
    {
      id: 'qa-auto-19',
      q: 'What is Mobile Emulation in Playwright and Chrome DevTools?',
      a: 'Playwright can emulate real mobile device viewports, user agent strings, touch events, and device pixel ratios (e.g. playwright.devices[\'iPhone 14 Pro\']), allowing responsive mobile layout and touch interaction testing without running native emulators.'
    },
    {
      id: 'qa-auto-20',
      q: 'What is Web Accessibility Testing with Axe-Core (Playwright @axe-core/playwright)?',
      a: 'Integrates the Deque Axe automated accessibility scanning engine into browser tests. It analyzes rendered DOM trees against WCAG 2.1 AA guidelines, automatically reporting color contrast failures, missing aria-labels, and invalid heading hierarchies.'
    },
    {
      id: 'qa-auto-21',
      q: 'What is Sharding in automated testing pipelines and how does it reduce CI runtime?',
      a: 'Sharding splits a large test suite across multiple parallel CI runner jobs (e.g. npx playwright test --shard=1/4). Four parallel runners execute 25% of the test suite each, slashing total test pipeline time from 20 minutes down to 5 minutes.'
    },
    {
      id: 'qa-auto-22',
      q: 'What is the difference between Unit, Component, and End-to-End (E2E) testing?',
      a: 'Unit: tests individual isolated functions/methods (ms execution). Component: mounts an isolated React/Vue component in a sandboxed test runner, testing rendering and props without full backend. E2E: tests full integrated software journey in a real browser against a real environment.'
    },
    {
      id: 'qa-auto-23',
      q: 'What is Har (HTTP Archive) recording and replay in Playwright?',
      a: 'Playwright can record all network traffic of a test into a standard HAR file (recordHar: { path: \'network.har\' }). In future test runs, Playwright replays responses from the local HAR file with zero real network requests, speeding up tests and testing offline states.'
    },
    {
      id: 'qa-auto-24',
      q: 'What is Allure Report and test reporting in automated QA?',
      a: 'Allure is an open-source multi-language test reporting tool that generates rich HTML test reports containing test execution steps, failure stack traces, screenshots, video recordings, and historical trend metrics.'
    },
    {
      id: 'qa-auto-25',
      q: 'What is Cross-Browser Testing and why is WebKit testing on Linux significant in Playwright?',
      a: 'Playwright includes open-source builds of Chromium, Firefox, and WebKit (Safari engine). Significantly, Playwright can execute WebKit tests directly on Linux and Windows CI runners without requiring expensive macOS hardware machines.'
    },
    {
      id: 'qa-auto-26',
      q: 'What is Cypress cy.wait() anti-pattern and how should dynamic aliases be used instead?',
      a: 'Hardcoding arbitrary time waits like cy.wait(5000) makes tests slow and brittle. The proper pattern is intercepting the backend API call (cy.intercept(\'GET\', \'/api/users\').as(\'getUsers\')) and waiting explicitly for the network call to complete (cy.wait(\'@getUsers\')).'
    },
    {
      id: 'qa-auto-27',
      q: 'How do you test Drag-and-Drop and complex mouse gestures in Playwright?',
      a: 'Playwright provides locator.dragTo(targetLocator) which automatically calculates source and target center points, dispatches mousedown, moves pointer smoothly, and releases mouseup. Alternatively, use page.mouse.move(), down(), and up().'
    },
    {
      id: 'qa-auto-28',
      q: 'What is Codegen / Test Recorder in Playwright (npx playwright codegen)?',
      a: 'Playwright Codegen opens a browser window and automatically generates clean TypeScript/JavaScript locator code and user actions in real time as the tester clicks, types, and navigates through the application.'
    },
    {
      id: 'qa-auto-29',
      q: 'What is Geolocation and Permissions mocking in browser tests?',
      a: 'Playwright allows setting geolocation coordinates and granting browser permissions programmatically: context.setGeolocation({ latitude: 37.7749, longitude: -122.4194 }); context.grantPermissions([\'geolocation\', \'notifications\']), enabling testing location-based features without user prompts.'
    },
    {
      id: 'qa-auto-30',
      q: 'What is Continuous Testing in DevOps pipelines and Quality Gates?',
      a: 'Continuous testing automatically executes automated test suites at every commit and pull request. Quality Gates block PR merges or production deployments if test pass rate falls below 100%, code coverage decreases, or visual regressions are detected.'
    }
  ],

  // -------------------------------------------------------------
  // 5. API TESTING & PERFORMANCE (30 Questions)
  // -------------------------------------------------------------
  api_testing: [
    {
      id: 'qa-api-1',
      q: 'What is the difference between Functional API Testing and Contract Testing (Pact)?',
      a: 'Functional API testing verifies that an API behaves correctly given specific inputs (validating status codes, response payloads, database state). Contract testing verifies that independent microservices conform to an agreed-upon contract (schema, endpoints, parameters) without requiring end-to-end environments, preventing breaking changes in CI.'
    },
    {
      id: 'qa-api-2',
      q: 'What are the essential HTTP Status Code categories and key codes (201, 204, 400, 401, 403, 409, 429)?',
      a: '2xx Success: 200 OK, 201 Created (resource created), 204 No Content (successful delete). 4xx Client Error: 400 Bad Request (malformed syntax), 401 Unauthorized (unauthenticated/missing token), 403 Forbidden (authenticated but lacking permission), 404 Not Found, 409 Conflict (duplicate record), 429 Too Many Requests (rate limited). 5xx Server Error: 500 Internal, 502 Bad Gateway, 503 Service Unavailable.'
    },
    {
      id: 'qa-api-3',
      q: 'How does JSON Schema Validation work in API testing?',
      a: 'JSON Schema defines the required structure, types, and constraints of a JSON response (e.g. verifying that id is integer, email matches regex, and items array contains required fields). Tests validate responses against the schema (using Ajv or Rest Assured) in a single assertion rather than writing dozens of individual property checks.'
    },
    {
      id: 'qa-api-4',
      q: 'What is REST Assured and how does the Given-When-Then syntax work in Java API testing?',
      a: 'REST Assured is a Java DSL for testing REST services: given().header("Auth", token).param("id", 1).when().get("/api/user").then().statusCode(200).body("name", equalTo("Alice")). It provides built-in Hamcrest matchers and JSONPath assertions.'
    },
    {
      id: 'qa-api-5',
      q: 'What is Newman and how do you run Postman Collections in automated CI/CD pipelines?',
      a: 'Newman is Postman’s command-line collection runner. It executes Postman collection JSON files and environment variable files directly in CI/CD pipelines (newman run collection.json -e env.json -r cli,html), integrating API test suites into automated builds.'
    },
    {
      id: 'qa-api-6',
      q: 'What is Load Testing vs Stress Testing vs Soak (Endurance) Testing vs Spike Testing?',
      a: 'Load Testing: tests system behavior under expected normal and peak traffic. Stress Testing: pushes traffic beyond normal limits until the system breaks to identify breaking points and recovery behavior. Soak Testing: runs moderate load for prolonged periods (24-48 hours) to detect memory leaks and resource exhaustion. Spike Testing: simulates sudden dramatic surges in traffic.'
    },
    {
      id: 'qa-api-7',
      q: 'What is Apache JMeter architecture (Thread Groups, Samplers, Listeners, Timers)?',
      a: 'JMeter simulates multi-user loads: Thread Groups represent virtual users. Samplers send specific protocol requests (HTTP, JDBC, FTP). Listeners capture and visualize metrics (Summary Report, Aggregate Graph). Timers insert realistic delays (think time) between requests. Assertions validate responses.'
    },
    {
      id: 'qa-api-8',
      q: 'What is k6 (Grafana k6) and why is code-based performance testing preferred over JMeter GUI?',
      a: 'k6 is a modern developer-centric load testing tool written in Go that executes test scripts written in JavaScript. It is headless, consumes significantly less memory than Java-based JMeter, stores tests as version-controlled code in Git, and integrates natively into CI/CD with CLI thresholds (thresholds: { http_req_duration: [\'p(95)<200\'] }).'
    },
    {
      id: 'qa-api-9',
      q: 'What are Key Performance Metrics: Latency, Throughput (RPS), p95/p99 Response Time, and Error Rate?',
      a: 'Throughput (RPS): requests per second handled. Latency: time to process a request. p95/p99: 95th/99th percentile response time (e.g. p99 < 200ms means 99% of requests completed under 200ms, exposing tail latency that averages conceal). Error Rate: percentage of failed requests.'
    },
    {
      id: 'qa-api-10',
      q: 'What is Virtual Users (VUs) and Think Time in load simulation?',
      a: 'Virtual Users (VUs) simulate real users executing test iterations concurrently. Real users do not click buttons instantly; Think Time introduces realistic random pauses between actions (e.g. sleep(random(2, 5))) to simulate human reading time, ensuring accurate server concurrency modeling.'
    },
    {
      id: 'qa-api-11',
      q: 'What is Idempotency Testing in REST APIs?',
      a: 'Verifies that calling an API multiple times produces the identical state as calling it once. Tests send duplicate PUT or DELETE requests and verify that subsequent calls do not alter state or create duplicate resources. For POST, tests verify that passing identical Idempotency-Key headers returns cached responses without duplicate charges.'
    },
    {
      id: 'qa-api-12',
      q: 'What is Boundary Value Analysis (BVA) and Equivalence Partitioning in API parameter testing?',
      a: 'Equivalence Partitioning divides input ranges into valid and invalid partitions (e.g. age 18-65). Boundary Value Analysis tests edge boundary values (17, 18, 65, 66) where software defects most commonly occur (off-by-one errors).'
    },
    {
      id: 'qa-api-13',
      q: 'What is API Fuzzing and how does it uncover unhandled exceptions and security crashes?',
      a: 'Fuzz testing sends randomized, malformed, or unexpectedly large payloads (SQL injection characters, null bytes, 10MB strings, invalid JSON) to API endpoints to verify that the server validates input gracefully (returning 400 Bad Request) rather than crashing with 500 unhandled exceptions.'
    },
    {
      id: 'qa-api-14',
      q: 'What is API Chaining in Postman or test scripts?',
      a: 'API Chaining passes data from one API response into subsequent requests: e.g. Step 1: POST /login extracts JWT token; Step 2: POST /orders passes token in header and extracts orderId; Step 3: GET /orders/{orderId} verifies order status.'
    },
    {
      id: 'qa-api-15',
      q: 'What is Rate Limiting and Throttle testing in APIs?',
      a: 'Tests send bursts of requests exceeding configured rate limits (e.g. 100 req/min) and verify that: 1) Excess requests receive HTTP 429 Too Many Requests. 2) Headers include Retry-After. 3) Normal access resumes after the throttle window resets.'
    },
    {
      id: 'qa-api-16',
      q: 'What is MockServer / WireMock in integration testing?',
      a: 'WireMock runs an HTTP server that simulates external third-party API dependencies (Stripe, Twilio). Tests configure stubbed endpoints with verification (verify(postRequestedFor(urlEqualTo("/pay")))), enabling fast, isolated tests without calling real paid third-party APIs.'
    },
    {
      id: 'qa-api-17',
      q: 'What is gRPC API testing and tools like BloomRPC / grpcurl / ghz?',
      a: 'gRPC uses Protocol Buffers and HTTP/2. grpcurl is a command-line tool for invoking gRPC endpoints using JSON inputs. ghz is a dedicated high-performance load testing tool for benchmarking gRPC services.'
    },
    {
      id: 'qa-api-18',
      q: 'What is GraphQL API testing (queries, mutations, variables, error array)?',
      a: 'Unlike REST where HTTP status codes indicate errors, GraphQL almost always returns HTTP 200 OK. Tests must inspect the JSON response body: asserting that data contains expected fields and that the errors array is either null or contains expected error messages.'
    },
    {
      id: 'qa-api-19',
      q: 'What is Distributed Load Testing and how does k6 Cloud or JMeter Master-Worker work?',
      a: 'A single load test machine cannot generate enough network traffic to stress large distributed systems (bottlenecked by CPU/RAM/NIC). Distributed load testing coordinates hundreds of worker load generator instances in parallel from multiple cloud regions to generate massive synthetic traffic.'
    },
    {
      id: 'qa-api-20',
      q: 'What is Chaos Engineering in API resilience testing (Chaos Mesh / Litmus)?',
      a: 'Injects controlled faults (introducing 500ms network latency, dropping 20% packets, corrupting responses, or killing pod replicas) during API test execution to verify that circuit breakers, retries, and fallbacks function properly under failure.'
    },
    {
      id: 'qa-api-21',
      q: 'What is API Versioning testing (URI path, Header, Query Parameter)?',
      a: 'Tests verify that older API versions (/v1/users) remain functional and backwards-compatible for legacy mobile apps when new versions (/v2/users) are deployed, and that deprecation warnings (Sunset header) are returned.'
    },
    {
      id: 'qa-api-22',
      q: 'What is CORS Preflight (OPTIONS) request testing?',
      a: 'For non-simple cross-origin requests, browsers send an OPTIONS preflight request. Tests verify that the server returns HTTP 200/204 with correct Access-Control-Allow-Origin, Access-Control-Allow-Methods, and Access-Control-Allow-Headers.'
    },
    {
      id: 'qa-api-23',
      q: 'How do you test Pagination, Sorting, and Filtering in REST APIs?',
      a: 'Tests verify: 1) Default page size and limit parameters. 2) Boundary cases (page 0, negative pages, empty last page). 3) Correct ascending/descending order on key fields. 4) Filter parameter combinations and SQL injection prevention.'
    },
    {
      id: 'qa-api-24',
      q: 'What is Soak Testing and how does it uncover Memory Leaks in APIs?',
      a: 'Running continuous moderate traffic over 24-48 hours monitors server memory, open file descriptors, and database connection pools. A steady upward slope in memory without stabilization indicates unclosed connections, memory leaks, or uncollected garbage.'
    },
    {
      id: 'qa-api-25',
      q: 'What is OpenTelemetry distributed tracing validation in API tests?',
      a: 'Tests inject W3C traceparent headers into incoming API calls and query distributed tracing backends (Jaeger/Tempo) to verify that all child spans across microservices were created with proper parent IDs and accurate latency tags.'
    },
    {
      id: 'qa-api-26',
      q: 'What is Mutation Testing in unit and API tests (Stryker / PIT)?',
      a: 'Mutation testing injects small faults (mutants: changing > to >=, inverting booleans, removing statements) into application code and runs test suites. If tests still pass, the mutant "survives", revealing gaps in test assertion thoroughness.'
    },
    {
      id: 'qa-api-27',
      q: 'What are SLA, SLO, and SLI in API performance engineering?',
      a: 'SLI (Service Level Indicator): measurable metric (e.g. 99th percentile response time is 180ms). SLO (Service Level Objective): internal target agreed by engineering (e.g. 99.9% of requests < 200ms). SLA (Service Level Agreement): contractual commitment to customers with financial penalties if breached.'
    },
    {
      id: 'qa-api-28',
      q: 'How do you test OAuth 2.0 and JWT token expiration / refresh flows?',
      a: 'Tests verify: 1) Valid access token grants access. 2) Expired token returns HTTP 401. 3) POST /oauth/token with refreshToken returns new access token. 4) Revoked refresh token fails. 5) Tampered token signature fails.'
    },
    {
      id: 'qa-api-29',
      q: 'What is Connection Pooling exhaustion testing in backend APIs?',
      a: 'Simulates concurrent slow database queries to saturate database connection pools (HikariCP). Tests verify whether the API handles pool starvation gracefully with timeouts and circuit breakers or hangs indefinitely and crashes.'
    },
    {
      id: 'qa-api-30',
      q: 'What is Shift-Right Testing and Synthetic API Monitoring in Production?',
      a: 'Shift-Right tests applications in live production. Synthetic monitoring schedules automated tests every 1-5 minutes against live production endpoints (e.g. creating test carts, health checks), alerting on-call engineers to production outages before users report them.'
    }
  ],

  // -------------------------------------------------------------
  // 6. QA METHODOLOGIES & TDD/BDD (30 Questions)
  // -------------------------------------------------------------
  qa_methodologies: [
    {
      id: 'qa-meth-1',
      q: 'What is the Test Pyramid and why are anti-patterns like the Ice Cream Cone harmful?',
      a: 'The Test Pyramid recommends: a broad base of Unit Tests (fast, isolated, cheap), a middle layer of Integration Tests, and a narrow peak of End-to-End Tests. The Ice Cream Cone anti-pattern has few unit tests and an overwhelming number of slow, brittle, expensive E2E tests, resulting in slow CI pipelines and high maintenance costs.'
    },
    {
      id: 'qa-meth-2',
      q: 'What is Test-Driven Development (TDD) and the Red-Green-Refactor cycle?',
      a: 'TDD writes tests before writing implementation code: 1) Red: write an automated test that fails because the feature does not exist yet. 2) Green: write the minimum amount of code required to make the test pass. 3) Refactor: clean up code structure, improve design, and eliminate duplication while keeping tests green.'
    },
    {
      id: 'qa-meth-3',
      q: 'What is Behavior-Driven Development (BDD) and Gherkin Syntax (Given-When-Then)?',
      a: 'BDD bridges communication between technical and non-technical business stakeholders. Requirements are written in human-readable Gherkin syntax (.feature files): Given (preconditions), When (user actions), Then (expected outcomes). Tools like Cucumber map Gherkin steps to executable automated test code.'
    },
    {
      id: 'qa-meth-4',
      q: 'What is the difference between Verification and Validation in Software QA?',
      a: 'Verification ("Are we building the product right?"): static evaluation of requirements, design documents, and code reviews against specifications without executing code. Validation ("Are we building the right product?"): dynamic testing of the running software to ensure it satisfies user needs and real-world business requirements.'
    },
    {
      id: 'qa-meth-5',
      q: 'What is Exploratory Testing vs Scripted Testing?',
      a: 'Scripted testing executes pre-defined step-by-step test cases to verify expected behavior. Exploratory testing is simultaneous learning, test design, and test execution where skilled QA testers explore edge cases, unexpected user paths, and software boundaries using intuition and creativity.'
    },
    {
      id: 'qa-meth-6',
      q: 'What is Defect Severity vs Defect Priority?',
      a: 'Severity measures the technical impact of a defect on system functionality (Critical, Major, Minor). Priority measures the business urgency of fixing the defect (High, Medium, Low). Example: a company logo typo has Low Severity but High Priority; an obscure crash in an unused edge case has High Severity but Low Priority.'
    },
    {
      id: 'qa-meth-7',
      q: 'What is the Defect Lifecycle (New, Assigned, Open, Fixed, Retest, Verified, Closed)?',
      a: '1) New: defect logged by tester. 2) Assigned: triage lead assigns to developer. 3) Open: developer investigates. 4) Fixed: developer resolves issue in code. 5) Retest: tester re-runs tests on new build. 6) Verified: tester confirms fix works. 7) Closed: defect closed. If fix fails, status moves to Reopened.'
    },
    {
      id: 'qa-meth-8',
      q: 'What is Regression Testing vs Retesting?',
      a: 'Retesting verifies that a specific previously failed defect has been successfully fixed by the developer. Regression testing tests the entire remaining application to ensure that the code changes or bug fixes did not unintentionally break existing, unmodified functionality.'
    },
    {
      id: 'qa-meth-9',
      q: 'What is Smoke Testing vs Sanity Testing?',
      a: 'Smoke Testing (Build Verification Test): shallow, broad test verifying that the critical fundamental features work after a new build (e.g. app starts, user can log in); if it fails, the build is rejected. Sanity Testing: focused, deep test performed after minor bug fixes to verify specific functionality works before full regression testing.'
    },
    {
      id: 'qa-meth-10',
      q: 'What is Black-Box, White-Box, and Gray-Box Testing?',
      a: 'Black-box: testing software functionality without knowledge of internal code or architecture. White-box: testing with complete access to internal source code, algorithms, and data structures (unit tests, code coverage). Gray-box: testing with partial knowledge of internal architecture (e.g. inspecting DB state or API payloads).'
    },
    {
      id: 'qa-meth-11',
      q: 'What is Static Testing vs Dynamic Testing?',
      a: 'Static testing evaluates code, documentation, and requirements without executing the software (code reviews, linters, SAST). Dynamic testing executes the compiled software on a machine with input data and evaluates actual runtime outputs against expected outcomes.'
    },
    {
      id: 'qa-meth-12',
      q: 'What is Equivalence Class Partitioning and Boundary Value Analysis?',
      a: 'Black-box test design techniques: Equivalence Partitioning groups inputs into valid and invalid classes where any value in a class is treated equally. Boundary Value Analysis tests the edge extremes (minimum, just above minimum, nominal, just below maximum, maximum) where programmers frequently introduce boundary bugs.'
    },
    {
      id: 'qa-meth-13',
      q: 'What is Decision Table Testing and when should it be used?',
      a: 'A decision table lists combinations of multiple input conditions (rules) and corresponding system actions. Used when business logic involves complex combinations of business rules (e.g. insurance eligibility based on age, driving history, and claims).'
    },
    {
      id: 'qa-meth-14',
      q: 'What is State Transition Testing?',
      a: 'A black-box testing technique based on finite state machines. Tests verify that the system transitions correctly from one state to another when valid events occur (e.g. Draft -> In Review -> Published) and rejects invalid transitions (e.g. Draft -> Published without review).'
    },
    {
      id: 'qa-meth-15',
      q: 'What is User Acceptance Testing (UAT) and Alpha vs Beta Testing?',
      a: 'UAT verifies that the solution works for end users in real-world scenarios. Alpha testing is conducted by internal employees in a controlled staging environment before public release. Beta testing releases the software to a select group of external end users in real environments to gather feedback.'
    },
    {
      id: 'qa-meth-16',
      q: 'What is a Traceability Matrix (RTM - Requirements Traceability Matrix)?',
      a: 'An RTM is a document mapping user requirements to test cases. It guarantees 100% test coverage for all functional requirements and helps evaluate the impact of requirement changes on existing test suites.'
    },
    {
      id: 'qa-meth-17',
      q: 'What is Test Coverage vs Code Coverage?',
      a: 'Code coverage is a quantitative metric measuring the percentage of source code lines, branches, or functions executed by automated unit tests. Test coverage is a qualitative measurement of how thoroughly test cases cover business requirements, features, and risk scenarios.'
    },
    {
      id: 'qa-meth-18',
      q: 'What is Risk-Based Testing (RBT) and how do you prioritize test cases?',
      a: 'RBT prioritizes testing based on the probability of failure and the business impact of that failure (Risk = Probability x Impact). Critical financial transactions and high-traffic flows receive comprehensive automated testing, while low-impact, rarely used features receive minimal testing.'
    },
    {
      id: 'qa-meth-19',
      q: 'What is Mutation Testing and how does it evaluate test quality?',
      a: 'Mutation testing introduces small syntactic mutants into source code (e.g. changing == to != or deleting statements). If existing test suites fail (killing the mutant), test quality is validated. If tests pass despite the mutation, the mutant survived, exposing inadequate test assertions.'
    },
    {
      id: 'qa-meth-20',
      q: 'What is Pairwise / All-Pairs Testing and combinatorial optimization?',
      a: 'Most software defects are triggered by interactions between at most two parameters. Pairwise testing generates a discrete test suite covering all possible pairs of input parameter combinations rather than testing every exhaustive combination, reducing thousands of test combinations to dozens.'
    },
    {
      id: 'qa-meth-21',
      q: 'What is Shift-Left Testing and how does it reduce software development costs?',
      a: 'Shift-Left moves testing earlier in the software development lifecycle: involving QA in requirement reviews, writing unit tests during development, and running linters. Fixing a bug during requirement analysis costs 10-100x less than fixing a bug found in production.'
    },
    {
      id: 'qa-meth-22',
      q: 'What is Shift-Right Testing (Testing in Production - TiP)?',
      a: 'Shift-Right tests applications in live production environments using feature flags, canary releases, synthetic user monitoring, chaos engineering, and real-time observability to catch unforeseen environmental issues that staging cannot replicate.'
    },
    {
      id: 'qa-meth-23',
      q: 'What are Test Doubles: Mocks, Stubs, Fakes, Dummies, and Spies (Gerard Meszaros)?',
      a: 'Dummy: passed around but never used (fills parameters). Stub: provides canned answers to calls during the test. Spy: records information about calls made to it (number of calls, arguments). Mock: pre-programmed with expectations of calls it must receive. Fake: working implementation with shortcut (in-memory database).'
    },
    {
      id: 'qa-meth-24',
      q: 'What is Continuous Integration (CI) and the role of Automated Testing in CI/CD?',
      a: 'CI mandates that developers merge code changes frequently into main branch. Every merge triggers automated builds, unit tests, integration tests, and security scans. If any test fails, the build breaks immediately, preventing regression bugs from entering production.'
    },
    {
      id: 'qa-meth-25',
      q: 'What is Non-Functional Testing (Performance, Usability, Security, Compatibility)?',
      a: 'Functional testing verifies what the system does. Non-functional testing verifies how the system performs: Performance (speed, scalability), Usability (intuitive UI/UX), Security (vulnerabilities), Reliability (failover), and Compatibility (browsers, devices, operating systems).'
    },
    {
      id: 'qa-meth-26',
      q: 'What is Root Cause Analysis (RCA) and the "5 Whys" methodology?',
      a: 'RCA investigates underlying systemic causes of a critical defect rather than treating superficial symptoms. The 5 Whys technique iteratively asks "Why?" five times to drill down from the immediate bug to systemic organizational or architectural flaws.'
    },
    {
      id: 'qa-meth-27',
      q: 'What is Agile Testing and how does QA operate in Scrum sprints?',
      a: 'In Agile, QA is integrated directly into cross-functional teams rather than operating as an isolated phase. QA participates in sprint planning (defining acceptance criteria), writes automation in parallel with development, and performs continuous testing within the 2-week sprint.'
    },
    {
      id: 'qa-meth-28',
      q: 'What is Test Debt and how does it compromise engineering velocity?',
      a: 'Test debt accumulates when teams skip writing automated tests, fail to maintain flaky tests, or allow test suites to become slow. Over time, fear of breaking legacy code paralyzes release velocity, requiring manual testing cycles that delay releases.'
    },
    {
      id: 'qa-meth-29',
      q: 'What is Definition of Done (DoD) in Agile quality assurance?',
      a: 'DoD is an agreed-upon formal checklist that a user story must satisfy before being considered complete: code written, reviewed by peers, unit tests passing with >80% coverage, automated integration tests passing in CI, and documentation updated.'
    },
    {
      id: 'qa-meth-30',
      q: 'What is the role of AI in modern Software Testing (AI Test Generation, Self-Healing Locators)?',
      a: 'AI in testing: 1) Self-healing locators: automatically adapt locators when DOM attributes change, eliminating flaky failures. 2) Automated test generation: LLMs analyzing user journeys and generating Playwright/Cypress tests. 3) Visual regression diffing with computer vision.'
    }
  ],

  // -------------------------------------------------------------
  // 7. UI/UX DESIGN & DESIGN SYSTEMS (30 Questions)
  // -------------------------------------------------------------
  uiux_design: [
    {
      id: 'uiux-1',
      q: 'What is a Design System and what are Design Tokens (Color, Typography, Spacing)?',
      a: 'A Design System is a single source of truth containing reusable UI components, design patterns, and brand guidelines. Design Tokens are platform-agnostic design decisions stored as key-value pairs (e.g. spacing-md: 16px, color-primary: #6366f1) that compile into CSS variables, iOS Swift constants, and Android Compose tokens.'
    },
    {
      id: 'uiux-2',
      q: 'What is the Double Diamond Design Process (Discover, Define, Develop, Deliver)?',
      a: '1) Discover (Divergent): user research, interviews, and competitive analysis to understand problem space. 2) Define (Convergent): synthesize research into problem statements, personas, and journey maps. 3) Develop (Divergent): brainstorm solutions, wireframing, and interactive prototyping. 4) Deliver (Convergent): usability testing, high-fidelity design, and developer handoff.'
    },
    {
      id: 'uiux-3',
      q: 'Explain Jakob\'s Law of Internet User Experience.',
      a: 'Users spend most of their time on other websites. Therefore, users expect your site to work the same way as all the other sites they already know. Violating established interaction conventions (like navigation placement or checkout flows) increases cognitive load and causes frustration.'
    },
    {
      id: 'uiux-4',
      q: 'Explain Fitts\'s Law and its implications for Button sizing and Mobile Touch Targets.',
      a: 'The time required to rapidly move to a target area is a function of the distance to the target and the target\'s size. Larger targets that are closer to the user\'s thumb are significantly faster and easier to tap. iOS and Android guidelines mandate minimum touch targets of 44x44pt / 48x48dp.'
    },
    {
      id: 'uiux-5',
      q: 'Explain Hick\'s Law and how to optimize Decision-Making in UI design.',
      a: 'The time it takes to make a decision increases logarithmically with the number and complexity of choices: T = b * log2(n + 1). Reduce cognitive overload by breaking complex processes into multi-step wizards, highlighting recommended options, and minimizing form fields.'
    },
    {
      id: 'uiux-6',
      q: 'What is Visual Hierarchy and how do Scale, Contrast, Color, and White Space establish it?',
      a: 'Visual hierarchy guides the user’s eye across the page in order of importance. Established by: Scale (larger headlines attract attention first), Contrast (high contrast draws focus), Color (vibrant action buttons stand out against muted backgrounds), and White Space (isolates key elements).'
    },
    {
      id: 'uiux-7',
      q: 'What is WCAG (Web Content Accessibility Guidelines) and Contrast Ratio requirements for AA vs AAA?',
      a: 'WCAG ensures digital content is accessible. Level AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (18pt+). Level AAA requires 7:1 for normal text and 4.5:1 for large text. It also mandates keyboard navigation and ARIA screen reader support.'
    },
    {
      id: 'uiux-8',
      q: 'What is Information Architecture (IA) and Card Sorting methodology?',
      a: 'IA organizes, structures, and labels content to help users find information easily. Card Sorting is a UX research method where participants organize topics into categories: Open Card Sorting (users create their own category names, discovering mental models) vs Closed Card Sorting (users place cards into pre-defined categories, validating IA).'
    },
    {
      id: 'uiux-9',
      q: 'What is the difference between Qualitative and Quantitative UX Research?',
      a: 'Quantitative research answers "How many?" and "What happened?" with numerical data (analytics, heatmaps, bounce rates, A/B testing metrics). Qualitative research answers "Why?" and "How do users feel?" through direct observation (user interviews, moderated usability tests, contextual inquiries).'
    },
    {
      id: 'uiux-10',
      q: 'What is Usability Testing: Moderated vs Unmoderated and think-aloud protocol?',
      a: 'Usability testing evaluates a product by testing it on representative users. Moderated: a facilitator guides the user through tasks, probing for insights in real time. Unmoderated: users complete recorded tasks independently via tools like UserTesting. The think-aloud protocol asks participants to verbalize their thoughts while navigating.'
    },
    {
      id: 'uiux-11',
      q: 'What is Responsive Design vs Adaptive Design vs Fluid Typography?',
      a: 'Responsive design uses fluid percentage grids and CSS media queries to smoothly adjust layouts to any screen size. Adaptive design serves distinct static layouts tailored to specific device breakpoints. Fluid typography uses CSS clamp(1rem, 2vw, 2.5rem) to scale text smoothly across viewports.'
    },
    {
      id: 'uiux-12',
      q: 'What is Gestalt Principles of Perception (Proximity, Similarity, Continuity, Closure)?',
      a: 'Principles describing how humans perceive visual elements: Proximity (objects close together are perceived as a group). Similarity (elements sharing color/shape are perceived as having the same function). Continuity (eyes naturally follow smooth paths). Closure (brains complete incomplete shapes).'
    },
    {
      id: 'uiux-13',
      q: 'What are Micro-Interactions and why are they vital for user delight?',
      a: 'Micro-interactions are subtle, single-purpose animations or feedback moments: a button bouncing when tapped, a heart icon animating on like, a toggle switch gliding, or a progress spinner. They communicate system status, provide immediate tactile feedback, and inject personality into products.'
    },
    {
      id: 'uiux-14',
      q: 'What is Dark Mode design and how do you avoid pure black (#000000) and eye strain?',
      a: 'Pure black (#000000) creates harsh contrast with white text, causing visual vibration and halation. Professional dark mode uses dark slate/charcoal (#121212, #0f172a) with elevated elevation surfaces tinted with subtle white overlay opacity (5%, 8%, 12%) to communicate depth.'
    },
    {
      id: 'uiux-15',
      q: 'What is Skeuomorphism vs Flat Design vs Neumorphism vs Glassmorphism?',
      a: 'Skeuomorphism: realistic physical textures (leather, metallic bevels). Flat Design: 2D minimalist graphics with bold colors. Neumorphism: soft, extruded plastic look using dual soft drop-shadows (poor contrast/accessibility). Glassmorphism: frosted-glass blur (backdrop-filter: blur), semi-transparency, and subtle light borders.'
    },
    {
      id: 'uiux-16',
      q: 'What is an Empathy Map and User Journey Map in UX design?',
      a: 'An Empathy Map synthesizes user research into four quadrants: Says, Thinks, Does, and Feels. A User Journey Map visualizes the step-by-step timeline of a user’s experience achieving a goal across stages (Discovery, Onboarding, Use), mapping user touchpoints, emotional highs/lows, and pain points.'
    },
    {
      id: 'uiux-17',
      q: 'What is Nielsen\'s 10 Usability Heuristics for User Interface Design?',
      a: 'Key heuristics: 1) Visibility of system status (feedback). 2) Match between system and real world. 3) User control and freedom (undo/redo). 4) Consistency and standards. 5) Error prevention. 6) Recognition rather than recall. 7) Flexibility and efficiency of use. 8) Aesthetic and minimalist design. 9) Help users recognize and recover from errors. 10) Help and documentation.'
    },
    {
      id: 'uiux-18',
      q: 'What is the Doherty Threshold in user experience performance?',
      a: 'Productivity and engagement soar when a computer and its users interact at a pace (<400ms) where neither has to wait on the other. If an application responds in under 400ms, users perceive it as instantaneous and stay immersed in flow state.'
    },
    {
      id: 'uiux-19',
      q: 'What is Empty State design and how do you turn zero-data moments into engagement?',
      a: 'Empty states appear when no data exists (new account, cleared inbox, empty cart). Good design avoids blank screens: it uses inviting illustrations, educates the user on what will appear, and provides a clear primary Call to Action (e.g. "Create your first project").'
    },
    {
      id: 'uiux-20',
      q: 'What is Progressive Disclosure in UI design?',
      a: 'Progressive disclosure presents only the essential information initially, deferring advanced or secondary settings to subsequent screens or expandable accordions upon user request. It reduces initial cognitive overload for beginners while accommodating power users.'
    },
    {
      id: 'uiux-21',
      q: 'What is Skeleton Loading Screen vs Spinner for perceived performance?',
      a: 'Spinners make wait times feel longer because they draw attention to the delay. Skeleton screens render wireframe placeholder blocks that mimic the final page layout, giving the psychological perception of immediate progress and gradual content arrival.'
    },
    {
      id: 'uiux-22',
      q: 'What are UX Dark Patterns (Deceptive Patterns) and ethical design?',
      a: 'Dark patterns manipulate users into making unintended decisions (hidden recurring subscriptions, fake urgency countdowns, trick questions, pre-checked opt-in boxes). Ethical design respects user autonomy, builds long-term trust, and complies with consumer protection laws (FTC, GDPR).'
    },
    {
      id: 'uiux-23',
      q: 'What is Component-Driven Design in Figma (Auto Layout, Variants, Component Properties)?',
      a: 'Auto Layout creates dynamic, responsive components that adapt to content padding and resizing like CSS Flexbox. Variants group variations of a component (Primary, Secondary, Disabled) into a single master component. Component Properties (Boolean, Text, Instance Swap) reduce component bloat.'
    },
    {
      id: 'uiux-24',
      q: 'What is System Usability Scale (SUS) and how is it scored?',
      a: 'SUS is a standardized 10-item questionnaire scored on a 5-point Likert scale to evaluate product usability. Responses are calculated into a score from 0 to 100. A score of 68 is average; 80+ indicates world-class usability.'
    },
    {
      id: 'uiux-25',
      q: 'How do you design Accessible Forms (error states, field labels, tab order)?',
      a: '1) Never use placeholder text as the only label (placeholders disappear on typing). 2) Clearly indicate required fields. 3) Provide descriptive, persistent inline error messages linked via aria-describedby. 4) Never rely solely on color to indicate errors (use icons + text). 5) Ensure logical keyboard tab order.'
    },
    {
      id: 'uiux-26',
      q: 'What is Voice User Interface (VUI) and Conversational UI design?',
      a: 'Designing voice and conversational experiences (Alexa, Siri, LLM Chatbots). Requires defining explicit conversation flows, handling ambient noise and misrecognitions with graceful clarification prompts, keeping responses concise, and confirming high-stakes actions.'
    },
    {
      id: 'uiux-27',
      q: 'What is A/B Testing in UX (statistical significance, sample size, bounce rate)?',
      a: 'A/B testing splits traffic equally between two variations (A and B) to measure conversion rate differences. It requires adequate sample size to achieve statistical significance (typically p < 0.05, 95% confidence interval) before declaring a winning variation.'
    },
    {
      id: 'uiux-28',
      q: 'What is Design Handoff to Developers and how to minimize design-dev friction?',
      a: 'Effective handoff: 1) Align on shared Design Tokens matching code variables. 2) Document interactive states (hover, focus, pressed, disabled). 3) Specify responsive resizing rules. 4) Use tools like Figma Dev Mode to inspect CSS, margins, and exported SVG assets.'
    },
    {
      id: 'uiux-29',
      q: 'What is Infinite Scroll vs Pagination in e-commerce and content feeds?',
      a: 'Infinite scroll is ideal for casual browsing and discovery feeds (TikTok, Instagram) where users seek entertainment without a specific goal. Pagination is superior for goal-oriented search and e-commerce (Amazon) where users need to locate specific items, bookmark results, and reach the footer.'
    },
    {
      id: 'uiux-30',
      q: 'What is Service Design and how does a Service Blueprint map frontstage and backstage actions?',
      a: 'Service Design looks beyond digital screens to design the entire end-to-end customer journey. A Service Blueprint maps: 1) Customer Actions. 2) Frontstage actions (interactions with staff/app). 3) Backstage actions (internal employee tasks). 4) Support processes (databases, delivery systems).'
    }
  ],

  // -------------------------------------------------------------
  // 8. PRODUCT MANAGEMENT & STRATEGY (30 Questions)
  // -------------------------------------------------------------
  product_mgmt: [
    {
      id: 'pm-1',
      q: 'What is Product-Market Fit (PMF) and the 40% Sean Ellis Rule?',
      a: 'Product-Market Fit means being in a good market with a product that can satisfy that market. The Sean Ellis PMF test surveys users: "How would you feel if you could no longer use this product?" If 40% or more answer "Very disappointed", the product has achieved strong Product-Market Fit.'
    },
    {
      id: 'pm-2',
      q: 'What are Feature Prioritization Frameworks: RICE vs MoSCoW vs Kano Model?',
      a: 'RICE: scores features by (Reach x Impact x Confidence) / Effort. MoSCoW: categorizes requirements into Must-have, Should-have, Could-have, and Won\'t-have for fixed-deadline releases. Kano Model: classifies customer preferences into Basic Expectations, Performance Needs, and Delighters.'
    },
    {
      id: 'pm-3',
      q: 'What is North Star Metric (NSM) and why is it vital for product alignment?',
      a: 'A North Star Metric is the single key metric that best captures the core value a product delivers to its customers (e.g. Spotify: "Time spent listening", Airbnb: "Nights booked"). It aligns all engineering, product, and marketing teams around sustainable long-term value creation.'
    },
    {
      id: 'pm-4',
      q: 'What is the difference between Product Manager and Project Manager / Product Owner?',
      a: 'Product Manager owns the "Why" and "What": product strategy, customer problem discovery, market opportunity, roadmap, and business metrics. Project Manager owns the "When" and "How": execution schedule, resource allocation, and budget. Product Owner is a Scrum role managing the sprint backlog.'
    },
    {
      id: 'pm-5',
      q: 'What is Minimum Viable Product (MVP) vs Minimum Lovable Product (MLP)?',
      a: 'An MVP is the simplest version of a product that allows a team to collect the maximum amount of validated customer learning with the least effort. An MLP raises the bar: rather than just being technically functional, it focuses on delighting early adopters with an emotionally engaging experience.'
    },
    {
      id: 'pm-6',
      q: 'What are OKRs (Objectives and Key Results) and how do they differ from KPIs?',
      a: 'KPIs (Key Performance Indicators) measure ongoing operational health (e.g. server uptime 99.9%, current MRR). OKRs are aspirational goal-setting frameworks: an Objective is a qualitative inspirational goal ("Expand market reach in Europe"), and Key Results are 3-5 measurable quantitative outcomes ("Acquire 100,000 active European users by Q3").'
    },
    {
      id: 'pm-7',
      q: 'What is Pirate Metrics (AARRR: Acquisition, Activation, Retention, Revenue, Referral)?',
      a: 'Dave McClure\'s growth framework: 1) Acquisition: how users discover your product. 2) Activation: users experience the "Aha!" moment. 3) Retention: users return regularly. 4) Revenue: monetizing customer activity. 5) Referral: users invite others.'
    },
    {
      id: 'pm-8',
      q: 'What is Product-Led Growth (PLG) vs Sales-Led Growth (SLG)?',
      a: 'In SLG, revenue is driven by sales reps closing contracts before software deployment. In PLG (Slack, Zoom, Figma), the product itself drives acquisition, retention, and expansion through free tiers, self-serve onboarding, and viral network effects before users ever talk to sales.'
    },
    {
      id: 'pm-9',
      q: 'How do you define and measure Customer Lifetime Value (LTV) and Customer Acquisition Cost (CAC)?',
      a: 'CAC = Total Sales and Marketing Spend / Number of Customers Acquired. LTV = (Average Revenue Per Account x Gross Margin %) / Churn Rate. A healthy SaaS business maintains an LTV:CAC ratio of at least 3:1 with a CAC payback period under 12 months.'
    },
    {
      id: 'pm-10',
      q: 'What is Cohort Analysis and how does it diagnose Customer Retention vs Churn?',
      a: 'Cohort analysis groups users by a shared start date (e.g. users who signed up in January) and tracks their retention over time. A flattening retention curve indicates sustainable product-market fit; a curve that drops continuously to zero reveals a leaky bucket problem.'
    },
    {
      id: 'pm-11',
      q: 'What is the "Jobs to Be Done" (JTBD) framework (Clayton Christensen)?',
      a: 'JTBD posits that customers do not buy products; they "hire" products to make progress in a specific circumstance. Understanding the functional, emotional, and social job (e.g. "hiring a milkshake" on a morning commute to avoid boredom) helps build products aligned with real motivations.'
    },
    {
      id: 'pm-12',
      q: 'How do you write a Product Requirement Document (PRD)?',
      a: 'A strong PRD includes: 1) Executive Summary & Problem Statement. 2) User Personas & JTBD. 3) Business Goals & Success Metrics (OKRs). 4) Out of Scope (boundaries). 5) User Stories & Acceptance Criteria. 6) Technical constraints & edge cases. 7) Go-to-Market release plan.'
    },
    {
      id: 'pm-13',
      q: 'What is a Vanity Metric vs Actionable Metric in product analytics?',
      a: 'Vanity metrics make you feel good but do not reflect real business value or guide decision-making (e.g. total registered accounts, app page views). Actionable metrics connect directly to business outcomes and user value (e.g. weekly active users completing a core transaction, 30-day retention).'
    },
    {
      id: 'pm-14',
      q: 'What is Opportunity Solution Tree (Teresa Torres) in continuous discovery?',
      a: 'A visual framework connecting a desired Business Outcome (top) to discovered Customer Opportunities/Pain Points (branches), brainstorming multiple potential Solutions for each opportunity, and validating them with rapid Assumption Tests.'
    },
    {
      id: 'pm-15',
      q: 'What is the Churn Rate (Logo Churn vs Net Revenue Churn / Net Revenue Retention - NRR)?',
      a: 'Logo Churn: % of customer accounts that cancel over a period. Net Revenue Retention (NRR): (Starting ARR + Expansion ARR - Contraction ARR - Churn ARR) / Starting ARR. An NRR > 100% (e.g. 120%) means revenue grows even if zero new customers are acquired, driven by expansion.'
    },
    {
      id: 'pm-16',
      q: 'What is Network Effects (Direct, Indirect, Two-Sided) and why do they create strong Moats?',
      a: 'Network effects occur when a product becomes more valuable as more people use it: Direct (WhatsApp: value increases with each user). Two-Sided (Uber/Airbnb: more drivers attract more riders). They create defensible moats that make it nearly impossible for competitors to displace the incumbent.'
    },
    {
      id: 'pm-17',
      q: 'How do you resolve conflicts between Engineering (tech debt) and Business (feature deadlines)?',
      a: 'Translate tech debt into business impact: explain how unaddressed tech debt slows feature release velocity by 30%, causes customer-impacting outages, and increases cloud costs. Partner with engineering to allocate a fixed percentage of sprint capacity (e.g. 20%) continuously toward tech debt.'
    },
    {
      id: 'pm-18',
      q: 'What is User Story Mapping (Jeff Patton) and how does it organize backlogs?',
      a: 'Story mapping organizes user stories visually along two axes: Horizontal axis represents the chronological user journey across high-level activities (Narrative Flow). Vertical axis prioritizes user stories by necessity, slicing the map into release iterations (MVP, Release 2).'
    },
    {
      id: 'pm-19',
      q: 'What is Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and SOM?',
      a: 'TAM: total global market demand for a product category ($100B). SAM: portion of TAM targeted by your specific product and geography ($20B). SOM (Serviceable Obtainable Market): realistic percentage of SAM you can capture within 3-5 years ($2B).'
    },
    {
      id: 'pm-20',
      q: 'What is Competitive Analysis: Direct vs Indirect vs Replacement competitors?',
      a: 'Direct: offerings that solve the same problem for the same audience (Lyft vs Uber). Indirect: solve the same problem differently (public transit vs Uber). Replacement: solve a different problem that eliminates the original need (video conferencing eliminating business travel).'
    },
    {
      id: 'pm-21',
      q: 'What is the Hook Model (Nir Eyal: Trigger, Action, Variable Reward, Investment)?',
      a: 'A behavioral design loop for building habit-forming products: 1) Trigger (external notification or internal emotion like boredom). 2) Action (simple user behavior). 3) Variable Reward (intermittent positive feedback, social recognition). 4) Investment (user inputs data, increasing future switching cost).'
    },
    {
      id: 'pm-22',
      q: 'What is Price Elasticity of Demand and Pricing Strategies (Freemium, Tiered, Usage-Based)?',
      a: 'Price elasticity measures demand sensitivity to price changes. Pricing models: Freemium (free basic tier, paid advanced features). Tiered (Starter, Pro, Enterprise tiers based on feature gates). Usage-Based (Snowflake/AWS: pay for consumed compute/storage, aligning price with customer value).'
    },
    {
      id: 'pm-23',
      q: 'How do you conduct Customer Discovery Interviews without asking leading questions (The Mom Test)?',
      a: 'Rob Fitzpatrick\'s Mom Test rules: 1) Talk about their life and actual past behaviors instead of your idea. 2) Ask about specific instances in the past ("Tell me about the last time you..."), never hypotheticals ("Would you pay for..."). 3) Listen more than you speak; never defend your product.'
    },
    {
      id: 'pm-24',
      q: 'What is a Go-To-Market (GTM) Strategy and its 4 core pillars?',
      a: 'A GTM plan coordinates launching a product to market: 1) Target Market & Personas. 2) Value Proposition & Messaging. 3) Pricing & Packaging. 4) Distribution Channels (Direct sales, inbound marketing, self-serve PLG).'
    },
    {
      id: 'pm-25',
      q: 'What is the difference between Outcome-Based Roadmap and Feature-Based Roadmap?',
      a: 'Feature-based roadmaps commit to delivering specific outputs on fixed dates (brittle, leads to feature factories). Outcome-based roadmaps commit to solving customer problems and achieving measurable business outcomes (e.g. "Reduce onboarding drop-off by 15%") without dictating exact UI solutions.'
    },
    {
      id: 'pm-26',
      q: 'What is the "Aha!" Moment and Time to Value (TTV)?',
      a: 'The "Aha!" moment is the specific instant when a user first experiences the core utility of a product (e.g. Slack: sending 2,000 team messages; Facebook: adding 7 friends in 10 days). Time to Value (TTV) is the time it takes from sign-up to reaching that moment; shortening TTV maximizes activation.'
    },
    {
      id: 'pm-27',
      q: 'What is Net Promoter Score (NPS) and how is it calculated?',
      a: 'NPS asks: "How likely are you to recommend our product on a scale of 0-10?" Promoters (9-10), Passives (7-8), Detractors (0-6). NPS = % Promoters - % Detractors (ranges from -100 to +100).'
    },
    {
      id: 'pm-28',
      q: 'How do you manage Feature Sunset / Deprecation effectively?',
      a: '1) Analyze real usage data to understand impact. 2) Provide transparent communication 3-6 months in advance across email and in-app banners. 3) Offer automated migration paths or export tools. 4) Sunset in phases (read-only mode first) before final decommissioning.'
    },
    {
      id: 'pm-29',
      q: 'What is the Innovator\'s Dilemma (Clayton Christensen)?',
      a: 'Successful market leaders focus on sustaining innovations for their most profitable customers, ignoring low-margin fringe markets. Disruptive startups enter with simpler, cheaper, inferior solutions at the low end, iteratively improving until they disrupt and displace the incumbent.'
    },
    {
      id: 'pm-30',
      q: 'What does "Extreme Ownership" look like for a Senior Product Manager?',
      a: 'A PM owns product success end-to-end: when a feature succeeds, praise belongs to engineering, design, and marketing; when a feature flops or misses metrics, accountability rests on the PM. It means removing blockers proactively, aligning cross-functional partners, and ruthlessly prioritizing customer value.'
    }
  ]
};

module.exports = {
  newDomainsQuestions2
};
