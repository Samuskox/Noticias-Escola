import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


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
      const queryFirebase = query(
        collection(db, 'administradores'),
        where('usuario', '==', usuario.trim()),
        where('senha','==', senha.trim())
    );

    const querySnapshot = await getDocs(queryFirebase);

    if(!querySnapshot.empty){
      const docAdmin = querySnapshot.docs[0];
      const dadosAdmin = docAdmin.data();

      const usuarioSessao = {
        ID_ADMIN: docAdmin.id,
        NOME_ADMINISTRADOR: dadosAdmin.usuario
      };

      localStorage.setItem('adminLogado', JSON.stringify(usuarioSessao));
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