import time
from stellar_sdk import Keypair, Network, SorobanServer, TransactionBuilder, scval
from stellar_sdk.soroban_rpc import GetTransactionStatus
from stellar_sdk.keypair import Keypair
from typing import List, Any
class SorobanContractInvoker:
    def __init__(self, rpc_server_url: str, network_passphrase: str):
        
        self.soroban_server = SorobanServer(rpc_server_url)
        self.network_passphrase = network_passphrase

    def _wait_for_transaction(self, transaction_hash: str) -> dict:
        print(f"Polling para a transação: {transaction_hash}")
        while True:
            get_transaction_response = self.soroban_server.get_transaction(transaction_hash)
            status = get_transaction_response.status

            if status == GetTransactionStatus.SUCCESS:
                print("Transação bem-sucedida!")
                result_meta = get_transaction_response.result_meta_xdr
                return scval.from_xdr_object(result_meta.v3.tx_result.result.results[0].tr.invoke_host_function_result.success)
            elif status == GetTransactionStatus.FAILED:
                print("Transação falhou!")
                raise Exception(f"Erro na transação: {get_transaction_response.error_result_xdr}")
            else:
                print(f"Status atual: {status.name}. Aguardando...")
                time.sleep(3)

    def invoke(self, 
               source_keypair: Keypair, 
               contract_id: str, 
               function_name: str, 
               parameters: List[Any] = []) -> Any:
        print(f"Carregando detalhes da conta: {source_keypair.public_key}")
        source_account = self.soroban_server.load_account(source_keypair.public_key)
        
        # Constrói a transação de invocação
        print(f"Construindo transação para a função '{function_name}'...")
        transaction = (
            TransactionBuilder(source_account, self.network_passphrase)
            .append_invoke_contract_function_op(
                contract_id=contract_id,
                function_name=function_name,
                parameters=parameters,
            )
            .set_timeout(60)
            .build()
        )
        
        # Simula a transação para obter as taxas de recursos
        print("Simulando transação para obter taxas de recursos...")
        simulation_response = self.soroban_server.simulate_transaction(transaction)
        transaction.set_soroban_transaction_data(simulation_response.transaction_data)
        transaction.add_resource_fee(simulation_response.min_resource_fee)

        # Assina e envia a transação
        print("Assinando transação...")
        transaction.sign(source_keypair)
        
        print("Submetendo transação para a rede...")
        send_transaction_response = self.soroban_server.send_transaction(transaction)
        transaction_hash = send_transaction_response.hash
        print(f"Transação submetida. Hash: {transaction_hash}")
        
        # Espera pelo resultado da transação
        result = self._wait_for_transaction(transaction_hash)
        return result
