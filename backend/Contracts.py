import time
from stellar_sdk import Keypair, Network, Server, SorobanServer, TransactionBuilder

def create_contract():
    # Configurações
    horizon_url = "https://horizon-testnet.stellar.org"
    soroban_rpc = "https://soroban-testnet.stellar.org"
    network_passphrase = Network.TESTNET_NETWORK_PASSPHRASE

    # Conta que fará o deploy (tem que ter fundos!)
    source_secret = "SCTU3CBQ7OAQ53YERVCUYB4535K2EEOWLL6T5EKQTZJ6UKQM46HSSWHU"
    source_keypair = Keypair.from_secret(source_secret)

    # Inicializa servidores
    server = Server(horizon_url)
    soroban_server = SorobanServer(soroban_rpc)

    # Carrega conta do usuário
    source_account = server.load_account(source_keypair.public_key)

    # Lê o arquivo WASM
    with open("fee_vault_v2.wasm", "rb") as f:
        wasm_bytes = f.read()

    # 1. Upload do WASM
    upload_tx = (
        TransactionBuilder(source_account, network_passphrase)
        .append_upload_contract_wasm_op(wasm_bytes)
        .set_timeout(300)
        .build()
    )
    upload_tx.sign(source_keypair)

    upload_response = soroban_server.send_transaction(upload_tx)
    print("Upload TX enviado:", upload_response)

    # 2. Espera confirmação
    while True:
        status = soroban_server.get_transaction(upload_response.hash)
        print("Status:", status.status)
        if status.status == "SUCCESS":
            wasm_hash = status.wasm_id
            print("Upload OK! WASM Hash:", wasm_hash)
            break
        elif status.status == "FAILED":
            raise Exception("Falha no upload do contrato!")
        time.sleep(2)

    # 3. Deploy do contrato
    source_account = server.load_account(source_keypair.public_key)
    deploy_tx = (
        TransactionBuilder(source_account, network_passphrase)
        .append_create_contract_op(wasm_hash, source_keypair.public_key)
        .set_timeout(300)
        .build()
    )
    deploy_tx.sign(source_keypair)

    deploy_response = soroban_server.send_transaction(deploy_tx)
    print("Deploy TX enviado:", deploy_response)
