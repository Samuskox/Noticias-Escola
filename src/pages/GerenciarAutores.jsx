import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function GerenciarAutores() {
  const [autores, setAutores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  // ➕ Estado para cadastrar novo autor
  const [novoAutor, setNovoAutor] = useState('');
  const [carregandoCriacao, setCarregandoCriacao] = useState(false);
  
  // Estados para edição
  const [idEditando, setIdEditando] = useState(null);
  const [nomeEditando, setNomeEditando] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const adminLogado = localStorage.getItem('adminLogado');
    if (!adminLogado) navigate('/login');
    else buscarAutores();
  }, [navigate]);

  // Carrega a lista completa de autores
  const buscarAutores = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('AUTORES')
        .select('*')
        .order('NOME', { ascending: true });

      if (error) throw error;
      setAutores(data || []);
    } catch (error) {
      alert('Erro ao carregar autores: ' + error.message);
    } finally {
      setCarregando(false);
    }
  };

  // ➕ Função para Adicionar um Novo Autor no banco
  const handleAdicionarAutor = async (e) => {
    e.preventDefault();
    if (novoAutor.trim() === '') return;
    setCarregandoCriacao(true);

    try {
      // Insere o novo nome na tabela AUTORES
      const { error } = await supabase
        .from('AUTORES')
        .insert([{ NOME: novoAutor.trim() }]);

      if (error) {
        // Trata erro caso tentem cadastrar um nome que já existe (regra UNIQUE)
        if (error.code === '23505') {
          throw new Error('Este autor já está cadastrado no sistema!');
        }
        throw error;
      }

      alert('✅ Novo autor cadastrado com sucesso!');
      setNovoAutor(''); // Limpa o campo de texto
      buscarAutores(); // Atualiza a listagem na tela
    } catch (error) {
      alert('Erro ao cadastrar autor: ' + error.message);
    } finally {
      setCarregandoCriacao(false);
    }
  };

  // Ativa o modo de edição na linha do autor
  const iniciarEdicao = (id, nomeAtual) => {
    setIdEditando(id);
    setNomeEditando(nomeAtual);
  };

  // Salva o nome alterado no Supabase
  const handleSalvarEdicao = async (id) => {
    if (nomeEditando.trim() === '') return;

    try {
      const { error } = await supabase
        .from('AUTORES')
        .update({ NOME: nomeEditando.trim() })
        .eq('ID_AUTOR', id);

      if (error) throw error;

      alert('✍️ Nome do autor atualizado com sucesso!');
      setIdEditando(null); 
      buscarAutores(); 
    } catch (error) {
      alert('Erro ao editar: ' + error.message);
    }
  };

  // Exclui o autor do banco de dados
  const handleExcluirAutor = async (id, name) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir o autor "${name}"? As notícias vinculadas a ele continuarão existindo, mas sem o nome dele.`);
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('AUTORES')
        .delete()
        .eq('ID_AUTOR', id);

      if (error) throw error;

      alert('🗑️ Autor removido com sucesso!');
      buscarAutores();
    } catch (error) {
      alert('Erro ao excluir autor: ' + error.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <Link to="/Dashboard" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>← Voltar ao Painel</Link>
      
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px', marginTop: '20px' }}>
        Gerenciar Autores / Alunos
      </h2>

      {/* ➕ FORMULÁRIO PARA CADASTRAR NOVO AUTOR */}
      <form onSubmit={handleAdicionarAutor} style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', gap: '12px', marginBottom: '30px', alignItems: 'flex-end' }}>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#333' }}>Cadastrar Novo Autor:</label>
          <input 
            type="text" 
            placeholder="Ex: Nome do Aluno Redator" 
            required 
            disabled={carregandoCriacao}
            value={novoAutor} 
            onChange={(e) => setNovoAutor(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={carregandoCriacao}
          style={{ background: '#007bff', color: 'white', padding: '11px 20px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {carregandoCriacao ? '...' : 'Adicionar'}
        </button>
      </form>

      {/* LISTAGEM DOS AUTORES CADASTRADOS */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '14px', color: '#555' }}>Autores Cadastrados ({autores.length})</h3>

      {carregando && <p style={{ color: '#666' }}>Carregando lista de redatores...</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {autores.map((autor) => (
          <div 
            key={autor.ID_AUTOR} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px', 
              border: '1px solid #eee', 
              borderRadius: '8px', 
              background: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)' 
            }}
          >
            {idEditando === autor.ID_AUTOR ? (
              <input 
                type="text" 
                value={nomeEditando} 
                onChange={(e) => setNomeEditando(e.target.value)} 
                style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #007bff', fontSize: '1rem', width: '60%' }}
              />
            ) : (
              <span style={{ fontSize: '1.05rem', color: '#333', fontWeight: '500' }}>
                ✍️ {autor.NOME}
              </span>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              {idEditando === autor.ID_AUTOR ? (
                <>
                  <button onClick={() => handleSalvarEdicao(autor.ID_AUTOR)} style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Salvar
                  </button>
                  <button onClick={() => setIdEditando(null)} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => iniciarEdicao(autor.ID_AUTOR, autor.NOME)} style={{ background: '#ffc107', color: '#212529', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Editar
                  </button>
                  <button onClick={() => handleExcluirAutor(autor.ID_AUTOR, autor.NOME)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Excluir
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {!carregando && autores.length === 0 && (
          <p style={{ color: '#777', fontStyle: 'italic' }}>Nenhum autor cadastrado no sistema.</p>
        )}
      </div>
    </div>
  );
}
