import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ArrowLeft, UserPlus, Edit2, Trash2, X } from 'lucide-react';
import './Usuarios.css';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', perfil: 'CIDADAO' });

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao carregar usuários');
      setUsuarios(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/usuarios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao deletar usuário');
      }

      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({ nome: user.nome, email: user.email, senha: '', perfil: user.perfil || 'CIDADAO' });
    } else {
      setFormData({ nome: '', email: '', senha: '', perfil: 'CIDADAO' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingUser 
        ? `http://localhost:5000/usuarios/${editingUser.id}` 
        : 'http://localhost:5000/usuarios';
      
      const method = editingUser ? 'PATCH' : 'POST';

      const payload = {
        nome: formData.nome,
        email: formData.email,
        perfil: formData.perfil
      };
      if (editingUser) {
        if (formData.senha) {
          payload.senha = formData.senha;
          payload.confirmacao_senha = formData.senha;
        }
      } else {
        payload.senha = formData.senha;
        payload.confirmacao_senha = formData.senha;
      }

      const response = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao salvar usuário');

      fetchUsuarios(); // Refresh list
      closeModal();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="usuarios-container">
      <header className="page-header">
        <Button variant="secondary" onClick={() => navigate('/dashboard')} className="back-btn">
          <ArrowLeft size={18} /> Voltar
        </Button>
        <h1>Gerenciar Usuários</h1>
        <Button className="add-btn" onClick={() => openModal()}>
          <UserPlus size={18} /> Novo Usuário
        </Button>
      </header>

      <main className="usuarios-main">
        {error && <div className="error-message">{error}</div>}
        
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <div className="usuarios-list">
            {usuarios.length === 0 ? (
              <p>Nenhum usuário encontrado.</p>
            ) : (
              usuarios.map(usuario => (
                <Card key={usuario.id} className="usuario-card">
                  <div className="usuario-info">
                    <h3>{usuario.nome}</h3>
                    <p>{usuario.email}</p>
                    <span className="cargo-badge">{usuario.perfil === 'ADMIN' ? 'Administrador' : 'Cidadão'}</span>
                  </div>
                  <div className="usuario-actions">
                    <Button variant="secondary" onClick={() => openModal(usuario)}>
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="secondary" onClick={() => handleDelete(usuario.id)} style={{ color: 'var(--error)' }}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </main>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay">
          <Card className="modal-content">
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
              <button className="close-btn" onClick={closeModal}><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <Input 
                label="Nome" 
                value={formData.nome} 
                onChange={e => setFormData({...formData, nome: e.target.value})} 
                required 
              />
              <Input 
                label="E-mail" 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
              />
              <Input 
                label={editingUser ? "Nova Senha (opcional)" : "Senha"} 
                type="password" 
                value={formData.senha} 
                onChange={e => setFormData({...formData, senha: e.target.value})} 
                required={!editingUser} 
              />
              <div className="input-group">
                <label>Perfil</label>
                <select 
                  className="cargo-select" 
                  value={formData.perfil} 
                  onChange={e => setFormData({...formData, perfil: e.target.value})}
                >
                  <option value="CIDADAO">Cidadão</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="modal-actions">
                <Button variant="secondary" type="button" onClick={closeModal}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
