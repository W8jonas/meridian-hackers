class Wallets:
    def __init__(self):        
     self.wallets = []
     self.wallets.append({
    "public_key": "GACGQKLIML7NGOSFXAKS6UXSG4ZOFBNOYFDG7VYZYZGSZ266GUHG74JT",
    "pass": "SAVQ66BWHZIEGF5TOHZX3QBX62QT4UDAM6GW3O34EAGX4NMQFXIROA3Z"
})
    def get_all_wallets(self):
        return self.wallets
    def get_wallet_by_key(self, chave):
        for wallet in self.wallets:
            if wallet["chave"] == chave:
                return wallet
        return None