import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { LogOut, TentTree } from 'lucide-react';
import './Dashboard.css';

export function Dashboard() {
  const navigate = useNavigate();
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
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <img src="/logo.png" alt="TO Brincando Logo" className="header-logo" />
          <h1>TO Brincando</h1>
        </div>
        <div className="dashboard-user">
          <span>Olá, {user?.nome || 'Usuário'}</span>
          <Button variant="secondary" onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            Sair
          </Button>
        </div>
      </header>

      <main className="dashboard-main">
        {user?.perfil === 'ADMIN' && (
          <div className="dashboard-grid">
            <Card className="dashboard-card action-card">
              <h2>Gerenciar Usuários</h2>
              <p>Cadastre, edite e remova usuários do sistema.</p>
              <Button onClick={() => navigate('/usuarios')}>Acessar</Button>
            </Card>
            
            <Card className="dashboard-card action-card">
              <h2>Gerenciar Brinquedos</h2>
              <p>Controle o acervo da brinquedoteca.</p>
              <Button onClick={() => navigate('/brinquedos')}>Acessar</Button>
            </Card>
          </div>
        )}
        {user?.perfil === 'CIDADAO' && (
          <div className="dashboard-grid">
            <Card className="dashboard-card action-card">
              <h2>Ver Brinquedotecas</h2>
              <p>Explore as brinquedotecas de Palmas, veja fotos, localizações e avaliações.</p>
              <Button onClick={() => navigate('/brinquedos', { state: { activeTab: 'explore' } })}>Acessar</Button>
            </Card>

            <Card className="dashboard-card action-card">
              <h2>Indicar Novo Espaço</h2>
              <p>Recomende uma nova área de lazer pública ou parquinho infantil.</p>
              <Button onClick={() => navigate('/brinquedos', { state: { activeTab: 'recommend' } })}>Indicar</Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
