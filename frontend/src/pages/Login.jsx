import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
import './Login.css';

export function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Register state
  const [regNome, setRegNome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSenha, setRegSenha] = useState('');
  const [regConfirmaSenha, setRegConfirmaSenha] = useState('');
  const [isRegLoading, setIsRegLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar login. Verifique suas credenciais.');
      }

      localStorage.setItem('token', data.access_token);
      if (data.data) {
        localStorage.setItem('user', JSON.stringify(data.data));
      }

      showToast(`Bem-vindo, ${data.data?.nome || 'Usuário'}!`, 'success');

      if (data.data && data.data.perfil === 'CIDADAO') {
        navigate('/brinquedos');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setIsRegLoading(true);

    try {
      const response = await fetch('/api/primeiro-acesso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: regNome,
          email: regEmail,
          senha: regSenha,
          confirmacao_senha: regConfirmaSenha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar cadastro.');
      }

      showToast('Cadastro realizado com sucesso! Faça login para continuar.', 'success');
      setRegNome('');
      setRegEmail('');
      setRegSenha('');
      setRegConfirmaSenha('');

      setTimeout(() => {
        setIsRegistering(false);
      }, 1000);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsRegLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="login-container">
      {/* Background Animated Morphing Blobs */}
      <div className="blob-container">
        <div className="blob blob-orange" />
        <div className="blob blob-green" />
        <div className="blob blob-yellow" />
      </div>

      <div className="login-content">
        <div className="login-header">
          <div className="icon-container">
            <img src="/logo.png" alt="TO Brincando Logo" className="login-logo" />
          </div>
          <h1>TO Brincando</h1>
          <p>{isRegistering ? 'Crie sua conta de cidadão' : 'Acesse o sistema da Brinquedoteca'}</p>
        </div>

        <Card className="login-card glass">
          {/* Tab switcher */}
          <div className="auth-tabs">
            <div className={`auth-tabs-slider ${isRegistering ? 'register' : 'login'}`} />
            <button
              className={`auth-tab ${!isRegistering ? 'active' : ''}`}
              onClick={() => !isRegistering || switchMode()}
              type="button"
            >
              Entrar
            </button>
            <button
              className={`auth-tab ${isRegistering ? 'active' : ''}`}
              onClick={() => isRegistering || switchMode()}
              type="button"
            >
              Cadastrar
            </button>
          </div>

          {!isRegistering ? (
            <form onSubmit={handleLogin} className="auth-form">
              <Input
                label="E-mail"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoginLoading}
              />
              <Input
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoginLoading}
              />
              <Button type="submit" className="login-button" disabled={isLoginLoading}>
                {isLoginLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCadastro} className="auth-form">
              <Input
                label="Nome completo"
                type="text"
                placeholder="Digite seu nome"
                value={regNome}
                onChange={(e) => setRegNome(e.target.value)}
                required
                disabled={isRegLoading}
              />
              <Input
                label="E-mail"
                type="email"
                placeholder="Digite seu e-mail"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                disabled={isRegLoading}
              />
              <Input
                label="Senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={regSenha}
                onChange={(e) => setRegSenha(e.target.value)}
                required
                disabled={isRegLoading}
              />
              <Input
                label="Confirmar senha"
                type="password"
                placeholder="Repita sua senha"
                value={regConfirmaSenha}
                onChange={(e) => setRegConfirmaSenha(e.target.value)}
                required
                disabled={isRegLoading}
              />
              <Button type="submit" className="login-button" disabled={isRegLoading}>
                {isRegLoading ? 'Cadastrando...' : 'Criar conta'}
              </Button>
              <p className="register-note">
                Sua conta será criada com perfil de <strong>Cidadão</strong>.
              </p>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
