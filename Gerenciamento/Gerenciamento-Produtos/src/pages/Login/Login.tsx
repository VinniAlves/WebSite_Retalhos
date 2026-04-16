import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const { signInWithGoogle, loading, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/produtos');
    }
  }, [token, navigate]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      // Error handled in context via toast
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Área Restrita</h1>
          <p className="login-subtitle">Gerenciamento Retalhos Cascavel</p>
        </div>
        
        <button 
          className="google-btn" 
          onClick={handleLogin}
          disabled={loading}
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google logo" 
            className="google-icon"
          />
          {loading ? 'Verificando credenciais...' : 'Entrar com Google'}
        </button>

        <p className="login-footer-text">
          Acesso restrito apenas para e-mails autorizados.
        </p>
      </div>
    </div>
  );
};

export default Login;
