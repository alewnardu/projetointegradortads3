from flask import Blueprint, request, jsonify
from app.schemas.usuario_schema import UsuarioSchema
from app.services.usuario_service import UsuarioService
from flask_jwt_extended import jwt_required

usuario_bp = Blueprint('usuario_bp', __name__)

usuario_schema = UsuarioSchema()
usuarios_schema = UsuarioSchema(many=True)

@usuario_bp.route('/usuarios', methods=['GET'])
@jwt_required()
def listar_usuarios():
    usuarios = UsuarioService.listar_usuarios()
    return jsonify({
        'usuarios': usuarios_schema.dump(usuarios)
    }), 200

@usuario_bp.route('/usuarios/<int:usuario_id>', methods=['GET'])
def buscar_usuario(usuario_id):
    usuario = UsuarioService.buscar_usuario(usuario_id)
    
    if not usuario:
        return jsonify({
            'mensagem': 'Usuário não encontrado'
        }), 404
    
    return jsonify({
        'usuario': usuario_schema.dump(usuario)
    }), 200

@usuario_bp.route('/usuarios', methods=['POST'])
def criar_usuario():
    dados = request.get_json()
    
    try:
        usuario = UsuarioService.criar_usuario(dados)
        return jsonify({
            'mensagem': 'Usuário criado com sucesso',
            'usuario': usuario_schema.dump(usuario)
        }), 201
    except Exception as e:
        return jsonify({
            'mensagem': str(e)
        }), 400

@usuario_bp.route('/usuarios/<int:usuario_id>', methods=['DELETE'])
def deletar_usuario(usuario_id):
    sucesso = UsuarioService.deletar_usuario(usuario_id)
    
    if not sucesso:
        return jsonify({
            'mensagem': 'Usuário não encontrado'
        }), 404
    
    return jsonify({''
    }), 204

@usuario_bp.route('/usuarios/<int:usuario_id>/alterar-dados', methods=['PATCH'])
def alterar_dados_usuario(usuario_id):

    try:
        dados = request.get_json()

        usuario = UsuarioService.alterar_dados_usuario(usuario_id, dados)

        return jsonify({
            'mensagem': 'Dados do usuário alterados com sucesso',
            'usuario': usuario_schema.dump(usuario)
        }), 200

    except Exception as e:
        return jsonify({
            'mensagem': str(e)
        }), 400