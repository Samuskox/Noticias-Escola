import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseclient';
import bcrypt from 'bcryptjs';
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
    // 1. Busca no Supabase apenas pelo Nome do Usuário
    const { data, error } = await supabase
      .from('ADMINISTRADOR')
      .select('ID_ADMIN, NOME_ADMINISTRADOR, SENHA_ADMINISTRADOR')
      .eq('NOME_ADMINISTRADOR', usuario.trim());

    if (error) throw error;

    if (data && data.length > 0) {
      const adminLogado = data[0];

      const senhaEstaCorreta = bcrypt.compareSync(senha.trim(), adminLogado.SENHA_ADMINISTRADOR);
      console.log(senha.trim())

      if (senhaEstaCorreta) {
        const dadosSessao = {
          ID_ADMIN: adminLogado.ID_ADMIN,
          NOME_ADMINISTRADOR: adminLogado.NOME_ADMINISTRADOR
        };

        localStorage.setItem('adminLogado', JSON.stringify(dadosSessao));
        navigate('/Dashboard');
      } else {
        setErro('Usuário ou senha inválidos!');
      }
    } else {
      setErro('Usuário ou senha inválidos!');
    }
  } catch (err) {
    console.error("Erro na autenticação:", err);
    setErro('Não foi possível conectar ao banco de dados.');
  } finally {
    setCarregando(false);
  }
  };

  return (

    

    <div className="login-page-wrapper">

      <div className="login-container">
        <h2>Área do Administrador</h2>
        <span className="login-aviso-texto">
      ⚠️ Atenção: A área de postagem e gerenciamento é permitida apenas para os administradores!
      </span>
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
