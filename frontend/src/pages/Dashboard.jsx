import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useToast } from '../components/Toast';
import { LogOut, Users, TentTree, Search, PlusCircle } from 'lucide-react';
import './Dashboard.css';

export function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Sessão encerrada com sucesso.', 'info');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Background Animated Blobs for brand cohesion */}
      <div className="blob-container">
        <div className="blob blob-orange" />
        <div className="blob blob-green" />
        <div className="blob blob-yellow" />
      </div>

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <img src="/logo.png" alt="TO Brincando Logo" className="header-logo" />
          <h1>TO Brincando</h1>
        </div>
        <div className="dashboard-user">
          <span>Olá, {user?.nome || 'Usuário'}</span>
          <Button variant="secondary" onClick={handleLogout} className="logout-btn">
            <LogOut size={16} />
            Sair
          </Button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Welcome Banner */}
        <section className="welcome-banner">
          <div className="welcome-content">
            <h2>Olá, {user?.nome?.split(' ')[0] || 'Usuário'}!</h2>
            <p>
              {user?.perfil === 'ADMIN'
                ? 'Bem-vindo ao painel administrativo. Gerencie os usuários do sistema e modere o acervo de brinquedotecas da cidade de Palmas.'
                : 'Seja bem-vindo! Explore as melhores brinquedotecas públicas e parquinhos infantis de Palmas ou sugira uma nova área de lazer.'}
            </p>
          </div>
        </section>

        {user?.perfil === 'ADMIN' && (
          <div className="dashboard-grid">
            <Card className="action-card" hoverable>
              <div className="action-icon-box orange">
                <Users size={28} />
              </div>
              <h2>Gerenciar Usuários</h2>
              <p>Cadastre, edite perfis e remova usuários administrativos ou cidadãos do sistema.</p>
              <Button onClick={() => navigate('/usuarios')}>Acessar Controle</Button>
            </Card>
            
            <Card className="action-card" hoverable>
              <div className="action-icon-box green">
                <TentTree size={28} />
              </div>
              <h2>Gerenciar Brinquedos</h2>
              <p>Controle as brinquedotecas ativas e gerencie as fotos, observações e análises de inativação.</p>
              <Button onClick={() => navigate('/brinquedotecas')}>Acessar Acervo</Button>
            </Card>
          </div>
        )}

        {user?.perfil === 'CIDADAO' && (
          <div className="dashboard-grid">
            <Card className="action-card" hoverable>
              <div className="action-icon-box blue">
                <Search size={28} />
              </div>
              <h2>Ver Brinquedotecas</h2>
              <p>Explore as brinquedotecas de Palmas, veja especificações completas, fotos reais, rotas e avaliações.</p>
              <Button onClick={() => navigate('/brinquedotecas', { state: { activeTab: 'explore' } })}>Acessar Mapa</Button>
            </Card>

            <Card className="action-card" hoverable>
              <div className="action-icon-box yellow">
                <PlusCircle size={28} />
              </div>
              <h2>Indicar Novo Espaço</h2>
              <p>Recomende uma nova área de lazer pública, praça infantil ou parquinho para transformarmos em brinquedoteca.</p>
              <Button onClick={() => navigate('/brinquedotecas', { state: { activeTab: 'recommend' } })}>Fazer Indicação</Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
