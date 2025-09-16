import threading
from flask import Flask, jsonify, request
from User import User
import Observer
import ContractInvoker
import config
from wallets import Wallets
from ContractInvoker import SorobanContractInvoker
# Inicializa a aplicação Flask
app = Flask(__name__)
# Rota principal
@app.route("/", methods=["GET"])
def home():
    return jsonify({"mensagem": "Bem-vindo à API Flask!"})
@app.route("/get-new-user", methods=["GET"])
def get_new_user():  
    return User.get_new_user()
def run_observer():
    wallets = Wallets()
    observer = Observer.Observer(wallets)
    observer.run()
    return jsonify({"message":"observador iniciado com sucesso!"})

@app.route("/run-observer",methods=["GET"])
def run():
    thread = threading.Thread(target=run_observer, daemon=True)
    thread.start() 
    return jsonify({"message": "observador iniciado com sucesso!"})
@app.route("/invoke-contract",methods=["POST"])
def invoke_contract():
    data =  request.get_json()
    contract_id = data.get("contract_id")
    function_name = data.get("function_name")
    contract = SorobanContractInvoker(config.RPC_SERVER_URL,config.NETWORK_PASSPHRASE)
    contract.invoke()

# Executa a aplicação
if __name__ == "__main__":
    app.run(debug=True)
