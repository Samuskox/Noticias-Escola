import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseclient';
import './Login.css';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const { data, error } = await supabase
        .from('ADMINISTRADOR')
        .select('ID_ADMIN, NOME_ADMINISTRADOR')
        .eq('NOME_ADMINISTRADOR', usuario.trim())
        .eq('SENHA_ADMINISTRADOR', senha.trim());

      if (error) throw error;

      if (data && data.length > 0) {
        const adminLogado = data[0];
        localStorage.setItem('adminLogado', JSON.stringify(adminLogado));
        navigate('/Dashboard');
      } else {
        setErro('Usuário ou senha inválidos');
      }
    } catch (err) {
      console.error("Erro ao autenticar com Supabase: ", err); // Corrigido de Firebase para Supabase no log
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (

    <div className="login-page-wrapper">

      <div className="login-container">
        <h2>Área do Administrador</h2>
        {erro && <p className="login-error">{erro}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Usuário:</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={carregando}>
            {carregando ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
      </div>

    </div>

  );
}
