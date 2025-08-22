#![cfg(test)]
use super::*;
use soroban_sdk::{
    testutils::Address as _,
    vec, Address, Env, Symbol,
};
use soroban_sdk::token::{Client as TokenClient, StellarAssetClient};

fn create_token_contract<'a>(env: &'a Env, admin: &'a Address) -> (TokenClient<'a>, StellarAssetClient<'a>, Address) {
    let stellar_asset_contract = env.register_stellar_asset_contract_v2(admin.clone());
    let token_address = stellar_asset_contract.address();
    let token_client = TokenClient::new(env, &token_address);
    let stellar_asset_client = StellarAssetClient::new(env, &token_address);
    (token_client, stellar_asset_client, token_address)
}

fn create_account(env: &Env, _name: &str) -> Address {
    Address::generate(env)
}

#[test]
fn test_splitter_flow() {
    let env = Env::default();
    env.mock_all_auths(); // mock auth for easier testing

    // Accounts
    let admin = create_account(&env, "admin");
    let payer = create_account(&env, "payer");
    let recipient1 = create_account(&env, "alice");
    let recipient2 = create_account(&env, "bob");
    let recipient3 = create_account(&env, "carol");

    // Deploy token contract + mint tokens
    let (token, stellar_asset, token_address) = create_token_contract(&env, &admin);
    stellar_asset.mint(&payer, &1_000);

    // Deploy splitter registry contract
    let contract_id = env.register(SplitterRegistry, ());
    let splitter = SplitterRegistryClient::new(&env, &contract_id);

    // Set shares for the agreement
    let shares = vec![
        &env,
        Share {
            recipient: recipient1.clone(),
            bps: 5000, // 50%
        },
        Share {
            recipient: recipient2.clone(),
            bps: 3000, // 30%
        },
        Share {
            recipient: recipient3.clone(),
            bps: 2000, // 20%
        },
    ];

    // Create agreement
    let agreement_id = Symbol::new(&env, "test_job");
    let deadline = env.ledger().timestamp() + 86400; // 24 hours from now
    let approvers = vec![&env]; // empty approvers list

    splitter.create_agreement(
        &agreement_id,
        &payer,
        &token_address,
        &shares,
        &500, // budget
        &deadline,
        &approvers,
    );

    // Approve contract to transfer tokens on behalf of payer
    // The contract will use transfer_from, so payer needs to approve the contract
    token.approve(&payer, &contract_id, &500, &(env.ledger().sequence() + 100));

    // Split 500 tokens using the default shares
    splitter.release_split(&agreement_id, &500);

    // Check balances
    assert_eq!(token.balance(&recipient1), 250); // 50%
    assert_eq!(token.balance(&recipient2), 150); // 30% 
    assert_eq!(token.balance(&recipient3), 100); // 20%

    // Verify the agreement state
    let agreement = splitter.get(&agreement_id).unwrap();
    assert_eq!(agreement.released, 500);
    assert_eq!(agreement.budget, 500);
    assert!(!agreement.closed);
}

#[test]
fn test_individual_release() {
    let env = Env::default();
    env.mock_all_auths();

    // Setup accounts and token
    let admin = create_account(&env, "admin");
    let payer = create_account(&env, "payer");
    let contractor = create_account(&env, "contractor");

    let (token, stellar_asset, _token_address) = create_token_contract(&env, &admin);
    stellar_asset.mint(&payer, &1_000);

    // Deploy contract
    let contract_id = env.register(SplitterRegistry, ());
    let splitter = SplitterRegistryClient::new(&env, &contract_id);

    // Create a simple agreement with one payee
    let shares = vec![
        &env,
        Share {
            recipient: contractor.clone(),
            bps: 10000, // 100%
        },
    ];

    let agreement_id = Symbol::new(&env, "individual_job");
    let deadline = env.ledger().timestamp() + 86400;
    let approvers = vec![&env];

    splitter.create_agreement(
        &agreement_id,
        &payer,
        &token.address,
        &shares,
        &500, // budget
        &deadline,
        &approvers,
    );

    // Approve and release individual payment
    token.approve(&payer, &contract_id, &200, &(env.ledger().sequence() + 100));
    splitter.release(&agreement_id, &contractor, &200);

    // Check balance and agreement state
    assert_eq!(token.balance(&contractor), 200);
    let agreement = splitter.get(&agreement_id).unwrap();
    assert_eq!(agreement.released, 200);
}

#[test]
fn test_close_agreement() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = create_account(&env, "admin");
    let payer = create_account(&env, "payer");
    let contractor = create_account(&env, "contractor");

    let (_token, stellar_asset, token_address) = create_token_contract(&env, &admin);
    stellar_asset.mint(&payer, &1_000);

    let contract_id = env.register(SplitterRegistry, ());
    let splitter = SplitterRegistryClient::new(&env, &contract_id);

    let shares = vec![
        &env,
        Share {
            recipient: contractor.clone(),
            bps: 10000,
        },
    ];

    let agreement_id = Symbol::new(&env, "closeable_job");
    let deadline = env.ledger().timestamp() + 86400;
    let approvers = vec![&env];

    splitter.create_agreement(
        &agreement_id,
        &payer,
        &token_address,
        &shares,
        &500, // budget
        &deadline,
        &approvers,
    );

    // Close the agreement
    splitter.close(&agreement_id);

    // Verify it's closed
    let agreement = splitter.get(&agreement_id).unwrap();
    assert!(agreement.closed);
}