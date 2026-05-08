from flask import Flask

app = Flask(__name__)

@app.route("/")

def index():
    return "Projeto Integrador TADS 3 - Sistema de Brinquedotecas"

if __name__ == "__main__":
    app.run(debug=True)