from flask import Flask, jsonify, request

# Inicializa a aplicação Flask
app = Flask(__name__)

# Rota principal
@app.route("/", methods=["GET"])
def home():
    return jsonify({"mensagem": "Bem-vindo à API Flask!"})


# Executa a aplicação
if __name__ == "__main__":
    app.run(debug=True)
