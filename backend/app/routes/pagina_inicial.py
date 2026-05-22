from flask import Blueprint

pagina_inicial_bp = Blueprint('pagina_inicial', __name__)

@pagina_inicial_bp.route('/', methods=['GET'])
def index():

    return {
        'success': 'Projeto Integrador TADS 3 - Sistema de Brinquedotecas'
    }, 200