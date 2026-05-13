from flask import Blueprint, request, jsonify
from app.services.autenticacao_service import AutenticacaoService
from flask_jwt_extended import create_access_token

autenticacao_bp = Blueprint('autenticacao_bp', __name__)

@autenticacao_bp.route('/login', methods=['POST'])
def login():

    try:
        dados = request.get_json()

        usuario = AutenticacaoService.autenticar_usuario(dados)
        
        # Gera token JWT
        access_token = create_access_token(
            identity=str(usuario.id)
        )

        # Retorno
        return jsonify({
            'access_token': access_token,
            'usuario': {
                'id': usuario.id,
                'nome': usuario.nome,
                'email': usuario.email
            }
        }), 200
    except Exception as erro:
        return jsonify({
            'erro': str(erro)
        }), 401