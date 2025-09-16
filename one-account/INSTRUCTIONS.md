
## Upload the contract
````
stellar contract upload \
  --wasm target/wasm32v1-none/release/fee_vault_v2.wasm \
  --source owner \
  --verbose

````

## Deplying the contract

Client application will generate two keypairs (`user` and `deposit_manager`) to be added as signers of the wallet. Their addresses should be passed in as a parameter when deploying the contract (creating the account).

````
stellar contract deploy \
    --network testnet \
    --source user \
    --wasm-hash 365e7a095821a377a68a1a7686686f9a9fb9d16c9f209544d13cfee830fe9e45 \
    -- \
    --user GAEODK7EDGDFXLK7KGUCPEKV4F53VIUONJDMWYJ26G5TXO7KKKQ53OB5 \
    --deposit_manager GDNBWUVCBUV6H2M5WF5EY5E3WTBXXARUYCH7OHLWA2WCJ3C6F3VRWFDR \
    --pool CDDG7DLOWSHRYQ2HWGZEZ4UTR7LPTKFFHN3QUCSZEXOWOPARMONX6T65 \
    --asset CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC

````

## Depositing into Blend
````
stellar contract invoke \
    --id CD7MR75PDUZOIAAWS7DX5ISPEIVV2PDPFMPNG7D6U3YHH4Z43DRTMSTL \
    --network testnet \
    --source deposit_manager \
    -- deposit  \
    --amount 79950000000
````

## Making a payment
````
stellar contract invoke \
    --id CD7MR75PDUZOIAAWS7DX5ISPEIVV2PDPFMPNG7D6U3YHH4Z43DRTMSTL \
    --network testnet \
    --source user \
    -- payment  \
    --to GB3A6NWEQO4GVDXYQ5UWFAH7NXMLUDG3QLAVONQOHGDRLI46MI3BTQBS \
    --amount 50000000000
````

## Checking the user's current balance in Blend (NOT WORKING)
````
stellar contract invoke \
    --id CD7MR75PDUZOIAAWS7DX5ISPEIVV2PDPFMPNG7D6U3YHH4Z43DRTMSTL \
    --network testnet \
    --source user \
    -- balance

````