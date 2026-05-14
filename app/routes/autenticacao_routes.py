from flask import Blueprint, request, jsonify
from app.services.autenticacao_service import AutenticacaoService
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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
            'data': {
                'id': usuario.id,
                'nome': usuario.nome,
                'email': usuario.email
            }
        }), 200
    except Exception as erro:
        return jsonify({
            'error': str(erro)
        }), 401

@autenticacao_bp.route('/alterar-senha', methods=['PATCH'])
@jwt_required()
def alterar_senha():
    try:
        dados = request.get_json()

        usuario_id = get_jwt_identity()

        AutenticacaoService.alterar_senha(usuario_id,dados)

        return jsonify({
            'success': 'Senha alterada com sucesso.'
        }), 200
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 400