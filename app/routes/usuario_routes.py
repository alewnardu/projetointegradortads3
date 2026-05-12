from flask import Blueprint, request
from app.schemas.usuario_schema import UsuarioSchema
from app.services.usuario_service import UsuarioService

usuario_bp = Blueprint('usuario_bp', __name__)

usuario_schema = UsuarioSchema()
usuarios_schema = UsuarioSchema(many=True)

@usuario_bp.route('/usuarios', methods=['GET'])
def listar_usuarios():
    usuarios = UsuarioService.listar_usuarios()
    return usuarios_schema.dump(usuarios), 200

@usuario_bp.route('/usuarios/<int:usuario_id>', methods=['GET'])
def buscar_usuario(usuario_id):
    usuario = UsuarioService.buscar_usuario(usuario_id)
    
    if not usuario:
        return {
            'mensagem': 'Usuário não encontrado'
        }, 404
    
    return usuario_schema.dump(usuario), 200
    
@usuario_bp.route('/usuarios', methods=['POST'])
def criar_usuario():
    dados = request.get_json()
    
    try:
        usuario = UsuarioService.criar_usuario(dados)
        return usuario_schema.dump(usuario), 201
    except Exception as e:
        return {
            'mensagem': str(e)
        }, 400

@usuario_bp.route('/usuarios/<int:usuario_id>', methods=['DELETE'])
def deletar_usuario(usuario_id):
    sucesso = UsuarioService.deletar_usuario(usuario_id)
    
    if not sucesso:
        return {
            'mensagem': 'Usuário não encontrado'
        }, 404
    
    return {
        'mensagem': 'Usuário deletado com sucesso'
    }, 200

@usuario_bp.route('/usuarios/<int:usuario_id>/alterar-dados', methods=['PATCH'])
def alterar_dados_usuario(usuario_id):

    usuario = UsuarioService.buscar_usuario(usuario_id)

    if not usuario:
        return {
            'mensagem': 'Usuário não encontrado'
        }, 404

    dados = request.get_json()

    try:

        if 'nome' in dados:
            usuario.nome = dados['nome']

        if 'email' in dados:
            usuario.email = dados['email']

        if 'perfil' in dados:
            usuario.perfil = dados['perfil']

        usuario = UsuarioService.alterar_dados_usuario(usuario)

        return usuario_schema.dump(usuario), 200

    except Exception as e:
        return {
            'mensagem': str(e)
        }, 400