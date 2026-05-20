from app.routes.pagina_inicial import pagina_inicial_bp
from app.routes.usuario_routes import usuario_bp
from app.routes.autenticacao_routes import autenticacao_bp
from app.routes.indicacao_routes import indicacao_bp
from app.routes.brinquedoteca_routes import brinquedoteca_bp
from app.routes.endereco_routes import endereco_indicacao_bp
from app.routes.localizacao_routes import localizacao_endereco_indicacao_bp
from app.routes.fotografia_routes import fotografia_bp
from app.routes.avaliacao_routes import avaliacao_bp

def lista_blueprints():
    return [
        pagina_inicial_bp, 
        usuario_bp, 
        autenticacao_bp, 
        indicacao_bp, 
        brinquedoteca_bp, 
        endereco_indicacao_bp, 
        localizacao_endereco_indicacao_bp, 
        fotografia_bp,
        avaliacao_bp
    ]