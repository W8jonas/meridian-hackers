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
wallets = Wallets()
observer = Observer.Observer(wallets)
# Rota principal
@app.route("/", methods=["GET"])
def home():
    return jsonify({"mensagem": "Bem-vindo à API Flask!"})
@app.route("/get-new-user", methods=["GET"])
def get_new_user():  
    return User.get_new_user()
def run_observer():
    observer.run()
    return jsonify({"message":"observador iniciado com sucesso!"})

@app.route("/run-observer",methods=["GET"])
def run():
    thread = threading.Thread(target=run_observer, daemon=True)
    thread.start() 
    return jsonify({"message": "observador iniciado com sucesso!"})
@app.route("/depositar",methods=["POST"])
def depositar():
    data =  request.get_json()
    contract_id = data.get("contract_id")
    function_name = 'deposit'
    wallet_public_key = data.get("wallet_public_key")
    parameters = data.get("parameters")
    #amount _asset
    wallet_key_pair = Wallets.get_wallet_by_key(wallet_public_key)
    invoke_contract(contract_id,function_name,parameters,wallet_key_pair)
@app.route("/invoke-contract-test",methods=["POST"])
def invoke_contract_test():
    data =  request.get_json()
    contract_id = data.get("contract_id")
    function_name = data.get("function_name")
    wallet_public_key = data.get("wallet_public_key")
    parameters = data.get("parameters")
    wallet_key_pair = Wallets.get_wallet_by_key(wallet_public_key)
    invoke_contract(contract_id,function_name,parameters,wallet_key_pair)

def invoke_contract(contract_id,function_name,parameters,wallet_key_pair):

    contract = SorobanContractInvoker(config.RPC_SERVER_URL,config.NETWORK_PASSPHRASE)
    contract.invoke(wallet_key_pair,contract_id,function_name,parameters)
@app.route("/consultar-saldo",methods=["GET"])
def consultar_saldo():
    data = request.args.get("public_key")
    return jsonify(observer.check_saldo(data))
# Executa a aplicação
if __name__ == "__main__":
    app.run(debug=True)
