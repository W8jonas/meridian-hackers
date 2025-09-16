
## Deplying the contract

Client application will generate two keypairs (`user` and `deposit_manager`) to be added as signers of the wallet. Their addresses should be passed in as a parameter when deploying the contract (creating the account).

````
stellar contract deploy \
    --network testnet \
    --source user \
    --wasm target/wasm32v1-none/release/fee_vault_v2.wasm \
    -- \
    --user GDKQSS6CAD3V7PF3R5LGCV43AULAVHAT66MLF5X3745Q2I2D3R4P2SLG \
    --deposit_manager GBV4JYCCA3O3XBGM2BRUTJ3SLC6WQ6RB4MXW3XOVQMGN4MH73H44AVUR \
    --pool CDDG7DLOWSHRYQ2HWGZEZ4UTR7LPTKFFHN3QUCSZEXOWOPARMONX6T65 \
    --asset CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC

````

## Depositing into Blend
````
stellar contract invoke \
    --id CB7T4P63PBDMOLV2H4DCKKAXEYTZICE2N7IMF3KCU2BFVSWQKWMXVDQU \
    --network testnet \
    --source user \
    -- deposit  \
    --amount 94960000000
````

Questions:
- How do I make a payment to a C account?

## Making a payment
````
stellar contract invoke \
    --id CB7T4P63PBDMOLV2H4DCKKAXEYTZICE2N7IMF3KCU2BFVSWQKWMXVDQU \
    --network testnet \
    --source user \
    -- payment  \
    --to GBV4JYCCA3O3XBGM2BRUTJ3SLC6WQ6RB4MXW3XOVQMGN4MH73H44AVUR \
    --amount 2000000000
````

## Checking the user's current balance in Blend (NOT WORKING)
````
stellar contract invoke \
    --id CDM7NN6PSNZVJSTASHEQVK2PB7RHBR3FLTIBAYFYC7X3AS274A4IRLQY \
    --network testnet \
    --source user \
    -- balance

````