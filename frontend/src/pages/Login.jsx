import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import './Login.css';

export function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Register state
  const [regNome, setRegNome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSenha, setRegSenha] = useState('');
  const [regConfirmaSenha, setRegConfirmaSenha] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [isRegLoading, setIsRegLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoginLoading(true);

    try {
      const response = await fetch('http://localhost:5000/login', {
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

      if (data.data && data.data.perfil === 'CIDADAO') {
        navigate('/brinquedos');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setIsRegLoading(true);

    try {
      const response = await fetch('http://localhost:5000/primeiro-acesso', {
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

      setRegSuccess('Cadastro realizado com sucesso! Faça login para continuar.');
      setRegNome('');
      setRegEmail('');
      setRegSenha('');
      setRegConfirmaSenha('');

      setTimeout(() => {
        setIsRegistering(false);
        setRegSuccess('');
      }, 2000);
    } catch (err) {
      setRegError(err.message);
    } finally {
      setIsRegLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setLoginError('');
    setRegError('');
    setRegSuccess('');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <div className="icon-container">
            <img src="/logo.png" alt="TO Brincando Logo" className="login-logo" />
          </div>
          <h1>TO Brincando</h1>
          <p>{isRegistering ? 'Crie sua conta de cidadão' : 'Acesse o sistema da Brinquedoteca'}</p>
        </div>

        <Card className="login-card">
          {/* Tab switcher */}
          <div className="auth-tabs">
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
              {loginError && <div className="login-error">{loginError}</div>}
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
              {regError && <div className="login-error">{regError}</div>}
              {regSuccess && <div className="login-success">{regSuccess}</div>}
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
