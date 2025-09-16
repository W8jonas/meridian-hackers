class Wallets:
    def __init__(self):        
     self.wallets = []
     self.wallets.append({
    "public_key": "GDMVZJEQFP6VZ75EUXT7PM7OTZPCUHJSV7V35D2AER6D4IRVDD7HFQD2",
    "pass": "SAVQ66BWHZIEGF5TOHZX3QBX62QT4UDAM6GW3O34EAGX4NMQFXIROA3Z"
})
    def get_all_wallets(self):
        return self.wallets
    def get_wallet_by_key(self, chave):
        for wallet in self.wallets:
            if wallet["public_key"] == chave:
                return wallet
        return None
