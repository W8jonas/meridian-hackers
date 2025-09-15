from flask import Flask, jsonify, request
from User import User
# Inicializa a aplicação Flask
app = Flask(__name__)
# Rota principal
@app.route("/", methods=["GET"])
def home():
    return jsonify({"mensagem": "Bem-vindo à API Flask!"})
@app.route("/get-new-user", methods=["GET"])
def get_new_user():  
    return User.get_new_user()
# Executa a aplicação
if __name__ == "__main__":
    app.run(debug=True)
