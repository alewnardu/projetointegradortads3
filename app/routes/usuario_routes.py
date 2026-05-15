from flask import Blueprint, request, jsonify
from app.schemas.usuario_schema import UsuarioSchema
from app.services.usuario_service import UsuarioService
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.exceptions import *

usuario_bp = Blueprint('usuario_bp', __name__)

usuario_schema = UsuarioSchema()
usuarios_schema = UsuarioSchema(many=True)

@usuario_bp.route('/usuarios', methods=['GET'])
@jwt_required()
def listar_usuarios():
    try:
        usuario_logado_id = get_jwt_identity()
        usuarios = UsuarioService.listar_usuarios(usuario_logado_id)
        return jsonify({
            'data': usuarios_schema.dump(usuarios)
        }), 200
    except UnauthorizedError as e:
        return jsonify({
            'error': str(e)
        }), 401
    except ForbiddenError as e:
        return jsonify({
            'error': str(e)
        }), 403
    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500

@usuario_bp.route('/usuarios/<int:usuario_id>', methods=['GET'])
@jwt_required()
def buscar_usuario(usuario_id):
    
    try:
        usuario_logado_id = get_jwt_identity()

        usuario = UsuarioService.buscar_usuario(usuario_logado_id, usuario_id)
        return jsonify({
            'data': usuario_schema.dump(usuario)
        }), 200

    except UnauthorizedError as e:
        return jsonify({
            'error': str(e)
        }), 401
        
    except NotFoundError as e:
        return jsonify({
            'error': str(e)
        }), 404

    except ForbiddenError as e:
        return jsonify({
            'error': str(e)
        }), 403

    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500

@usuario_bp.route('/usuarios', methods=['POST'])
@jwt_required()
def criar_usuario():
    
    try:
        dados = request.get_json()
        usuario_logado_id = get_jwt_identity()
        usuario = UsuarioService.criar_usuario(usuario_logado_id, dados)
        
        return jsonify({
            "success": True,
            "message": "Usuário criado com sucesso",
            "data": usuario_schema.dump(usuario)
        }), 201
        
    except UnauthorizedError as e:
        return jsonify({
            'error': str(e)
        }), 401

    except ForbiddenError as e:
        return jsonify({
            'error': str(e)
        }), 403
    
    except ValidationError as e:
        return jsonify({
            'error': str(e)
        }), 400
    
    except EmailAlreadyExistsError as e:
        return jsonify({
            'error': str(e)
        }), 409
    
    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500

@usuario_bp.route('/usuarios/<int:usuario_id>', methods=['DELETE'])
@jwt_required()
def deletar_usuario(usuario_id):

    try:
        usuario_logado_id = get_jwt_identity()
        sucesso = UsuarioService.deletar_usuario(usuario_logado_id, usuario_id)
        return '', 204
        
    except UnauthorizedError as e:
        return jsonify({
            'error': str(e)
        }), 401
    except ForbiddenError as e:
        return jsonify({
            'error': str(e)
        }), 403
    except NotFoundError as e:
        return jsonify({
            'error': str(e)
        }), 404
    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500

@usuario_bp.route('/usuarios/<int:usuario_id>', methods=['PATCH'])
@jwt_required()
def alterar_dados_usuario(usuario_id):

    try:
        dados = request.get_json()
        usuario_logado_id = get_jwt_identity()
        usuario = UsuarioService.alterar_dados_usuario(usuario_logado_id, usuario_id, dados)

        return jsonify({
            'success': True,
            'message': 'Dados do usuário alterados com sucesso',
            'data': usuario_schema.dump(usuario)
        }), 200
        
    except UnauthorizedError as e:
        return jsonify({
            'error': str(e)
        }), 401
    except NotFoundError as e:
        return jsonify({
            'error': str(e)
        }), 404
    except ForbiddenError as e:
        return jsonify({
            'error': str(e)
        }), 403
    except EmailAlreadyExistsError as e:
        return jsonify({
            'error': str(e)
        }), 409

    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500