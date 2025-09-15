import time
from stellar_sdk import Server, Keypair
import config
class Observer:
    def __init__(self, public_key):
        self.public_key = public_key
        self.server = Server(config.URL_SERVER) 
        self.seen_transactions = set()  
    def check_new_transactions(self):
        try:
            payments = self.server.payments().for_account(self.public_key).limit(10).order(desc=True).call()
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
    def run(self, interval=200):
        print(f"Monitorando wallet {self.public_key} na Testnet")
        while True:
            new_transactions = self.check_new_transactions()
            if new_transactions:
                for tx in new_transactions:
                    print("Nova transação detectada:", tx)
            time.sleep(interval)