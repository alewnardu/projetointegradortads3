from flask import Blueprint

pagina_inicial_bp = Blueprint('pagina_inicial', __name__)

@pagina_inicial_bp.route('/', methods=['GET'])
def index():

    return {
        'mensagem': 'Projeto Integrador TADS 3 - Sistema de Brinquedotecas'
    }, 200