use crate::{
    pool,
    storage,
    vault,
};

use soroban_sdk::{contract, contracttype, contractimpl, Address, Env, token::TokenClient};

#[contracttype]
pub enum Enum {
  User,
  DepositManager,
}

#[contract]
pub struct FeeVault;

#[contractimpl]
impl FeeVault {
    pub fn __constructor(env: Env, user: Address, deposit_manager: Address, pool: Address, asset: Address) {
        user.require_auth();

        env.storage().instance().set(&Enum::User, &user);
        env.storage().instance().set(&Enum::DepositManager, &deposit_manager); // TODO: restrict Admin permissions to only invoke Blend's contract deposit function
        storage::set_pool(&env, pool.clone());
        storage::set_asset(&env, asset.clone());
    }

    pub fn deposit(
        env: Env,
        amount: i128,
    ) {
        let user: Address = env.storage().instance().get(&Enum::User).unwrap();
        user.require_auth();

        // TODO: the deposit_manager key should be the one singing this transaction
        // let manager: Address = env.storage().instance().get(&Enum::DepositManager).unwrap();
        // manager.require_auth();

        // TODO: validation
        // TODO: get account current balance and remove amount param

        let pool = storage::get_pool(&env);
        let asset = storage::get_asset(&env);
        pool::supply(&env, &pool, &asset, &user, amount);
    }

    pub fn balance(
        env: Env,
    ) -> i128 {
        // TODO: not working, always 0
        let user: Address = env.storage().instance().get(&Enum::User).unwrap();
        // let user: Address = env.current_contract_address();
        user.require_auth();

        let shares = storage::get_vault_shares(&env, &user);
        if shares > 0 {
            let pool = storage::get_pool(&env);
            let asset = storage::get_asset(&env);
            let vault = vault::get_vault_updated(&env, &pool, &asset);
            let b_tokens = vault.shares_to_b_tokens_down(shares);
            vault.b_tokens_to_underlying_down(b_tokens)
        } else {
            0
        }
    }

    pub fn payment(env: Env, to: Address, amount: i128) {
        let user: Address = env.storage().instance().get(&Enum::User).unwrap();
        user.require_auth();
        
        // Step 1: withdraw from Blend pool
        let pool = storage::get_pool(&env);
        let asset = storage::get_asset(&env);
        pool::withdraw(&env, &pool, &asset, &user, amount);

        // Step 2: execute the transfer to the destination address
        let token_client: TokenClient<'_> = TokenClient::new(&env, &asset);
        token_client.transfer(&user, &to, &amount)
    }

    // pub fn __check_auth(
    //     env: Env,
    //     signature_payload: BytesN<32>,
    //     signature: BytesN<64>,
    //     _auth_context: Vec<Context>,
    // ) {

    //     let user: Address = env.storage().instance().get(&Enum::User).unwrap();
    //     let public_key: BytesN<32> = env
    //         .storage()
    //         .instance()
    //         .get::<_, BytesN<32>>(&DataKey::Owner)
    //         .unwrap();
    //     env.crypto()
    //         .ed25519_verify(&public_key, &signature_payload.into(), &signature);
    // }
}
