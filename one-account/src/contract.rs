use crate::{
    pool,
    storage,
    vault,
};
use blend_contract_sdk::pool::{Client as PoolClient, Request};
use soroban_sdk::{auth::{ContractContext, InvokerContractAuthEntry, SubContractInvocation}, contract, contractimpl, contracttype, token::TokenClient, vec, Address, Env, IntoVal, Symbol};

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
        let manager: Address = env.storage().instance().get(&Enum::DepositManager).unwrap();
        manager.require_auth();

        // TODO: validation

        let asset = storage::get_asset(&env);
        let pool = storage::get_pool(&env);

        env.authorize_as_current_contract(vec![
                &env,
                InvokerContractAuthEntry::Contract(SubContractInvocation {
                    context: ContractContext {
                        contract: asset.clone(),
                        fn_name: Symbol::new(&env, "transfer"),
                        args: (
                            env.current_contract_address(),
                            pool.clone(),
                            amount,
                        )
                        .into_val(&env),
                    },
                    sub_invocations: vec![&env],
                }),
            ]);
        let smart_wallet: Address = env.current_contract_address();
        let pool = storage::get_pool(&env);
        let asset = storage::get_asset(&env);
        pool::supply(&env, &pool, &asset, &smart_wallet, amount);
    }

    pub fn balance(
        env: Env,
    ) -> i128 {
        let pool = storage::get_pool(&env);
        let asset = storage::get_asset(&env);
        let pool_client = PoolClient::new(&env, &pool);
        let positions = pool_client.get_positions(&env.current_contract_address());
        let reserve = pool_client.get_reserve(&asset.clone());
        let b_tokens = positions.supply.get(reserve.config.index).unwrap_or(0);

        (b_tokens * reserve.data.b_rate) / 1000_000_000_000
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
