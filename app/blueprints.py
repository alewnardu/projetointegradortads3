from app.routes.pagina_inicial import pagina_inicial_bp
from app.routes.usuario_routes import usuario_bp
from app.routes.autenticacao_routes import autenticacao_bp
from app.routes.indicacao_routes import indicacao_bp

def lista_blueprints():
    return [pagina_inicial_bp, usuario_bp, autenticacao_bp, indicacao_bp]