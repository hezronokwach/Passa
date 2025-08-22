# Soroban Project

## Project Structure

This repository uses the recommended structure for a Soroban project:
```text
.
├── contracts
│   └── hello_world
│       ├── src
│       │   ├── lib.rs
│       │   └── test.rs
│       └── Cargo.toml
├── Cargo.toml
└── README.md
```

- New Soroban contracts can be put in `contracts`, each in their own directory. There is already a `hello_world` contract in there to get you started.
- If you initialized this project with any other example contracts via `--with-example`, those contracts will be in the `contracts` directory as well.
- Contracts should have their own `Cargo.toml` files that rely on the top-level `Cargo.toml` workspace for their dependencies.
- Frontend libraries can be added to the top-level directory as well. If you initialized this project with a frontend template via `--frontend-template` you will have those files already included.


# deploy

For now we deploy without a dispatcher. We will use the redeploy with abandon old policy for now. When we begin working we will need a dispatcher

```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/hello_world.wasm \
  --source-account alice \
  --network testnet \
  --alias splitter_v1
```

With passphrase

```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/hello_world.wasm \
  --source-account alice \
  --network testnet \
  --network-passphrase "Test SDF Network ; September 2015" \
  --alias splitter_v1
```

# Invoke a function

Since this needs many addresses, we will have the documentation to get these addresses below the command

```bash
stellar contract invoke \
  --id YOUR_CONTRACT_ID \
  --source-account alice \
  --network testnet \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- create_agreement \
    --id "deal_2025_001" \
    --payer "G...PAYERADDRESS" \
    --token "G...TOKENADDRESS" \
    --payees '[{"recipient":"G...ADDR_A","bps":5000},{"recipient":"G...ADDR_B","bps":3000},{"recipient":"G...ADDR_C","bps":2000}]' \
    --budget 1000000 \
    --deadline 1735689600 \
    --approvers '["G...ORACLEADDRESS"]'
```

# process of funding the addresses

````markdown
# Soroban Agreement Contract – Testnet Setup

This guide explains how to set up accounts, deploy the token, and invoke the `create_agreement` function of the **Agreement contract** on the Stellar Testnet using the Soroban CLI.

---

## 1. Generate Keys

Create keys for the payer, oracle, and contractors:

```sh
stellar keys generate --global payer --network testnet
stellar keys generate --global oracle --network testnet
stellar keys generate --global contractor_a --network testnet
stellar keys generate --global contractor_b --network testnet
stellar keys generate --global contractor_c --network testnet
````

The `--global` flag saves them for future use.

---

## 2. Fund Accounts

Each account must hold testnet XLM to interact with contracts:

```sh
PASS="Test SDF Network ; September 2015"

stellar keys fund payer --network testnet --network-passphrase "$PASS"
stellar keys fund oracle --network testnet --network-passphrase "$PASS"
stellar keys fund contractor_a --network testnet --network-passphrase "$PASS"
stellar keys fund contractor_b --network testnet --network-passphrase "$PASS"
stellar keys fund contractor_c --network testnet --network-passphrase "$PASS"
```

---

## 3. Inspect Accounts

Retrieve the **public keys (G...)** for use in contract calls:

```sh
stellar keys ls
```
Wll list all global aliases

```text
alice
contractor_a
contractor_b
contractor_c
oracle
payer
```

See the wallet address of one user

```bash
stellar keys address payer
```

Will produce a specific address. Copy the `Public Key (G...)` values.

---

Inspect to get the **Contract ID (C...)**:

---

## 6. Invoke `create_agreement`

Replace placeholders (`G...`, `C...`) with actual account IDs:

```sh
stellar contract invoke \
  --id C...AGREEMENT_CONTRACT_ID \
  --source-account payer \
  --network testnet \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- create_agreement \
    --id "deal_2025_001" \
    --payer "G...PAYER" \
    --token "C...TOKEN_OR_NATIVE" \
    --payees '[{"recipient":"G...CONTRACTOR_A","bps":5000},{"recipient":"G...CONTRACTOR_B","bps":3000},{"recipient":"G...CONTRACTOR_C","bps":2000}]' \
    --budget 1000000 \
    --deadline 1735689600 \
    --approvers '["G...ORACLE"]'
```

* **payer** → `G...` of the payer account
* **token** → `C...` of the token contract (or `"native"` if using XLM)
* **payees** → array of contractor accounts + basis points (must total 10000 = 100%)
* **budget** → total amount in smallest token units (e.g., stroops for XLM)
* **deadline** → Unix timestamp for agreement expiry
* **approvers** → optional array of oracle accounts

---

## 7. Notes

* **Re-deploying contracts:** you can deploy the same WASM again with a new alias (each deployment gets a new `C...` contract ID).
* **Funding:** only the payer must fund the contract with tokens, but payees and approvers must exist on-chain.
* **Testnet passphrase:** always use

  ```
  "Test SDF Network ; September 2015"
  ```

---

