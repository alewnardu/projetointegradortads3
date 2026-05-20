from flask import Blueprint, request, jsonify
from app.schemas.indicacao_schema import IndicacaoSchema
from app.schemas.indicacao_update_schema import IndicacaoUpdateSchema
from app.services.indicacao_service import IndicacaoService
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.exceptions import *
from marshmallow import ValidationError as MarshmallowValidationError
import json

indicacao_bp = Blueprint('indicacao_bp', __name__)

indicacao_schema = IndicacaoSchema()
indicacoes_schema = IndicacaoSchema(many=True)
indicacao_update_schema = IndicacaoUpdateSchema()

@indicacao_bp.route('/indicacoes', methods=['GET'])
@jwt_required()
def listar_indicacoes():
    try:
        usuario_logado_id = get_jwt_identity()
        indicacoes = IndicacaoService.listar_indicacoes(usuario_logado_id)
        return jsonify({
            'data': indicacoes_schema.dump(indicacoes)
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

@indicacao_bp.route("/indicacoes/<int:indicacao_id>", methods=["GET"])
@jwt_required()
def buscar_indicacao(indicacao_id):
    try:
        usuario_logado_id = get_jwt_identity()
        indicacao = IndicacaoService.buscar_indicacao(indicacao_id, usuario_logado_id)
        return jsonify({
            'data': indicacao_schema.dump(indicacao)
        }), 200
    except NotFoundError as e:
        return jsonify({
            'error': str(e)
        }), 404
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

@indicacao_bp.route("/indicacoes", methods=["POST"])
@jwt_required()
def criar_indicacao():
    try:
        dados = json.loads(request.form.get('dados'))

        dados = indicacao_schema.load(dados)

        foto_principal = request.files.get('foto_principal')

        fotos_adicionais = request.files.getlist('fotos_adicionais')

        usuario_logado_id = get_jwt_identity()
        
        indicacao = IndicacaoService.criar_indicacao(
            usuario_logado_id, 
            dados,
            foto_principal,
            fotos_adicionais
        )
        
        return jsonify({
            'success': True,
            'message': 'Indicação criada com sucesso',
            'data': indicacao_schema.dump(indicacao)
        }), 201
    except MarshmallowValidationError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except UnauthorizedError as e:
        return jsonify({
            'error': str(e)
        }), 401
    except BadRequestError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'error': f'Erro interno do servidor - {str(e)}'
        }), 500
    
@indicacao_bp.route("/indicacoes/<int:indicacao_id>/rejeitar", methods=["PATCH"])
@jwt_required()
def rejeitar_indicacao(indicacao_id):
    try:
        usuario_logado_id = get_jwt_identity()
        indicacao = IndicacaoService.rejeitar_indicacao(indicacao_id, usuario_logado_id)
        return jsonify({
            'success': True,
            'message': 'Indicação rejeitada',
            'data': indicacao_schema.dump(indicacao)
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
    except BadRequestError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500
   
@indicacao_bp.route("/indicacoes/<int:indicacao_id>/cancelar", methods=["PATCH"])
@jwt_required()
def cancelar_indicacao(indicacao_id):
    try:
        usuario_logado_id = get_jwt_identity()
        indicacao = IndicacaoService.cancelar_indicacao(indicacao_id, usuario_logado_id)
        return jsonify({
            'success': True,
            'message': 'Indicação cancelada',
            'data': indicacao_schema.dump(indicacao)
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
    except BadRequestError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500

@indicacao_bp.route("/indicacoes/<int:indicacao_id>/aprovar", methods=["PATCH"])
@jwt_required()
def aprovar_indicacao(indicacao_id):
    try:
        usuario_logado_id = get_jwt_identity()
        indicacao = IndicacaoService.aprovar_indicacao(indicacao_id, usuario_logado_id)
        return jsonify({
            'success': True,
            'message': 'Indicação aprovada',
            'data': indicacao_schema.dump(indicacao)
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
    except BadRequestError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500

@indicacao_bp.route("/indicacoes/<int:indicacao_id>/fotografias", methods=["POST"])
@jwt_required()
def adicionar_fotografia_indicacao(indicacao_id):
    try:
        dados = json.loads(request.form.get('dados'))

        fotografia = request.files.get('fotografia')

        usuario_logado_id = get_jwt_identity()

        print(dados);
        print(fotografia);
        print(usuario_logado_id)
        
        indicacao = IndicacaoService.adicionar_fotografia_indicacao(indicacao_id, usuario_logado_id, dados, fotografia)

        return jsonify({
            'success': True,
            'message': 'Novo registro fotográfico adicionado',
            'data': indicacao_schema.dump(indicacao)
        }), 200
    except Exception as e:
        return jsonify({
            'error':  f'Ero interno do servidor - {str(e)}'
        })






    

@indicacao_bp.route("/indicacoes/<int:indicacao_id>", methods=["PATCH"])
@jwt_required()
def atualizar_indicacao(indicacao_id):
    try:
        dados = indicacao_update_schema.load(request.get_json(), partial=True)
        usuario_logado_id = get_jwt_identity()
        indicacao = IndicacaoService.atualizar_indicacao(indicacao_id, usuario_logado_id, dados)
        
        return jsonify({
            'success': True,
            'message': 'Indicação atualizada com sucesso',
            'data': indicacao_schema.dump(indicacao)
        }), 200
    except MarshmallowValidationError as e:
        return jsonify({
            'error': str(e)
        }), 400
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
    except BadRequestError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'error': f'Erro interno do servidor - {str(e)}'
        }), 500