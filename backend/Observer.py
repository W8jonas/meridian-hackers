import time
from stellar_sdk import Server, Keypair
import config
class Observer:
    def __init__(self, wallets):
        self.wallets = wallets
        self.server = Server(config.URL_SERVER) 
        self.seen_transactions = set()  
    def check_new_transactions(self,public_key):
        try:
            payments = self.server.payments().for_account(public_key).limit(10).order(desc=True).call()
        except Exception as e:
            print("Erro ao consultar a wallet:", e)
            return []

        new_tx = []
        for record in payments['_embedded']['records']:
            tx_id = record['id']
            if tx_id not in self.seen_transactions:
                self.seen_transactions.add(tx_id)
                new_tx.append({
                    "id": tx_id,
                    "from": record.get('from'),
                    "to": record.get('to'),
                    "amount": record.get('amount'),
                    "asset_type": record.get('asset_type'),
                    "type": record.get('type')
                })
        return new_tx
    def run(self, interval=20):
        while True:
            print(f"Monitorando wallet na Testnet")
            for wallet in self.wallets.wallets:
                new_transactions = self.check_new_transactions(wallet["public_key"])
                if new_transactions:
                    for tx in new_transactions:
                        print("Nova transação detectada:", tx)
            time.sleep(interval)
    def check_saldo(self,public_key):
        account = self.server.accounts().account_id(public_key).call()
        lista_saldo = []
        for balance in account['balances']:
            asset_type = balance['asset_type']
            balance_amount = balance['balance']
            print(f"Ativo: {asset_type}, Saldo: {balance_amount}")
            lista_saldo.append({"ativo":asset_type,"saldo":balance_amount})
        return lista_saldo
