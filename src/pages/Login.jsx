import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseclient';


export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true)

    try {
    const {data, error} = await supabase
    .from('ADMINISTRADOR')
    .select('ID_ADMIN, NOME_ADMINISTRADOR')
    .eq('NOME_ADMINISTRADOR', usuario.trim())
    .eq('SENHA_ADMINISTRADOR', senha.trim());

    if (error) throw error;


    if(data && data.length > 0){
      const adminLogado = data[0];

      localStorage.setItem('adminLogado', JSON.stringify(adminLogado));
      navigate('/admin')
    }
    else{
      setErro('Usúario ou senha inválidos');
    }
    } catch (err) {
      console.error("Erro ao autenticar com firebase: ", err);
      setErro('Não foi possível conectar ao servidor.');
    } finally{
      setCarregando(false);
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
          {carregando ? 'Autenticando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}