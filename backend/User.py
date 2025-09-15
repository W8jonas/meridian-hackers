import requests

from stellar_sdk import Keypair

import config

class User:
    def get_new_user():
            keypair = Keypair.random()
            url = config.URL_GET_BOT
            response = requests.get(url, params={"addr": keypair.public_key})
            if response.status_code == 200:
                friendbot_response = response.json()
            else:
                friendbot_response = {"error": "Não foi possível criar a conta"}

            return {"public_key":keypair.public_key,"secret_seed":keypair.secret,"response":friendbot_response}
