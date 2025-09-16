
from stellar_sdk import Keypair, Network, SorobanServer, TransactionBuilder, Server
from stellar_sdk.soroban_rpc import deploy_contract


def CreateContract():
	# Configurações

	# 1. Configurações
	soroban_rpc = "https://soroban-testnet.stellar.org"  # RPC da testnet
	server = SorobanServer(soroban_rpc)

	# Conta que vai assinar (fonte do contrato)
	source_secret = "SDWEDFZAV5GEOMEAC7WPHYE6NWUZG5OMGYFOX5BXC2IRDBGO62SMNNFU"  # precisa ser a seed da conta "user"
	source_keypair = Keypair.from_secret(source_secret)

	# 2. Ler o wasm compilado
	with open("target/wasm32v1-none/release/fee_vault_v2.wasm", "rb") as f:
		wasm_bytes = f.read()

	# 3. Fazer upload e deploy do contrato
	wasm_hash = server.upload_wasm(source_keypair, wasm_bytes)
	print(f"WASM hash: {wasm_hash}")

	# 4. Deploy com parâmetros
	tx = deploy_contract(
		source_keypair,
		wasm_hash,
		args=[
			# Mesmos parâmetros do CLI
			"--user", "GDKQSS6CAD3V7PF3R5LGCV43AULAVHAT66MLF5X3745Q2I2D3R4P2SLG",
			"--deposit_manager", "GBV4JYCCA3O3XBGM2BRUTJ3SLC6WQ6RB4MXW3XOVQMGN4MH73H44AVUR",
			"--pool", "CDDG7DLOWSHRYQ2HWGZEZ4UTR7LPTKFFHN3QUCSZEXOWOPARMONX6T65",
			"--asset", "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
		],
		network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
		server=server
	)

	print("Contrato deployado! Endereço:", tx)
