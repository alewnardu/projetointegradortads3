from flask import Blueprint, request, jsonify
from app.services.autenticacao_service import AutenticacaoService
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.schemas.usuario_schema import UsuarioSchema
from app.exceptions import *

usuario_schema = UsuarioSchema()

autenticacao_bp = Blueprint('autenticacao_bp', __name__)

@autenticacao_bp.route('/login', methods=['POST'])
def login():

    try:
        dados = request.get_json()

        usuario = AutenticacaoService.autenticar_usuario(dados)
        
        access_token = create_access_token(identity=usuario.id)

        return jsonify({
            'access_token': access_token,
            'data': {
                'id': usuario.id,
                'nome': usuario.nome,
                'email': usuario.email
            }
        }), 200
    except NotFoundError as e:
        return jsonify({
            'error': str(e)
        }), 404
    except AuthenticationError as e:
        return jsonify({
            'error': str(e)
        }), 401
    except ValidationError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500

@autenticacao_bp.route('/recuperar-senha', methods=['POST'])
def recuperar_senha():
    try:
        dados = request.get_json()
        AutenticacaoService.recuperar_senha(dados)
        return jsonify({
            'success': True,
            'message': 'Instruções para recuperação de senha enviadas para o email cadastrado'
        }), 200
    except ValidationError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@autenticacao_bp.route('/redefinir-senha', methods=['PATCH'])
def redefinir_senha():
    try:
        dados = request.get_json()
        AutenticacaoService.redefinir_senha(dados)
        return jsonify({
            'success': True,
            'message': 'Senha redefinida com sucesso'
        }), 200
    except ValidationError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except AuthenticationError as e:
        return jsonify({
            'error': str(e)
        }), 401
    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500

@autenticacao_bp.route('/alterar-senha', methods=['PATCH'])
@jwt_required()
def alterar_senha():
    try:
        dados = request.get_json()

        usuario_id = get_jwt_identity()

        usuario = AutenticacaoService.alterar_senha(usuario_id, dados)

        return jsonify({
            'success': True,
            'message': 'Senha alterada com sucesso',
            'data': usuario_schema.dump(usuario)
        }), 200
    except NotFoundError as e:
        return jsonify({
            'error': str(e)
        }), 404
    except AuthenticationError as e:
        return jsonify({
            'error': str(e)
        }), 401
    except ValidationError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500