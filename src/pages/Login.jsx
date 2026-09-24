import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const resposta = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok && dados.sucesso) {
        // Guarda a sessão básica no navegador
        console.log("Deu certo");
        console.log(JSON.stringify(dados.admin));
        localStorage.setItem('adminLogado', JSON.stringify(dados.admin));
        navigate('/admin');
      } else {
        setErro(dados.mensagem || 'Erro ao autenticar');
      }
    } catch (err) {
      setErro('Não foi possível conectar ao servidor.');
    }
  };

  return (
    <div style={{ maxWidth: '350px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Área do Administrador</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label>Usuário:</label>
          <input 
            type="text" 
            value={usuario} 
            onChange={(e) => setUsuario(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label>Senha:</label>
          <input 
            type="password" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}