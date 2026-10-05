import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function GerenciarMural() {
  const [listaBlocos, setListaBlocos] = useState([]);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoConteudo, setNovoConteudo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminLogado = localStorage.getItem('adminLogado');
    if (!adminLogado) navigate('/login');
    buscarBlocos();
  }, [navigate]);

  // Busca todos os blocos cadastrados atualmente no banco
  const buscarBlocos = async () => {
    const { data, error } = await supabase
      .from('MURAL_HOME')
      .select('*')
      .order('ORDEM', { ascending: true })
      .order('DATA_CRIACAO', { ascending: true });
    
    if (data) setListaBlocos(data);
  };

  // Cadastra um novo bloco livre no mural
  const handleAdicionarBloco = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      // Define a ordem baseado no tamanho atual da lista
      const proximaOrdem = listaBlocos.length + 1;

      const { error } = await supabase
        .from('MURAL_HOME')
        .insert([{ TITULO: novoTitulo, CONTEUDO: novoConteudo, ORDEM: proximaOrdem }]);

      if (error) throw error;

      alert('✅ Novo bloco adicionado ao mural!');
      setNovoTitulo('');
      setNovoConteudo('');
      buscarBlocos(); // Atualiza a lista na tela
    } catch (error) {
      alert('Erro ao adicionar bloco: ' + error.message);
    } finally {
      setCarregando(false);
    }
  };

  // Deleta um bloco específico do mural
  const handleExcluirBloco = async (id) => {
    if (!window.confirm('Tem certeza que deseja apagar este bloco do mural?')) return;

    try {
      const { error } = await supabase.from('MURAL_HOME').delete().eq('ID', id);
      if (error) throw error;
      buscarBlocos(); // Atualiza a lista na tela
    } catch (error) {
      alert('Erro ao excluir: ' + error.message);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <Link to="/painel" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>← Voltar ao Painel</Link>
      
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px', marginTop: '20px' }}>⚙️ Gerenciar Blocos do Mural</h2>
      
      {/* FORMULÁRIO PARA ADICIONAR NOVO BLOCO */}
      <form onSubmit={handleAdicionarBloco} style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
        <h4 style={{ margin: 0, color: '#333' }}>➕ Adicionar Novo Bloco Informativo</h4>
        <input type="text" placeholder="Título do Bloco (Ex: ⚽ Grêmio Estudantil)" required value={novoTitulo} onChange={(e) => setNovoTitulo(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        <textarea placeholder="Conteúdo informativo..." required rows="3" value={novoConteudo} onChange={(e) => setNovoConteudo(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' }} />
        <button type="submit" disabled={carregando} style={{ background: '#007bff', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          {carregando ? 'Adicionando...' : 'Inserir no Mural'}
        </button>
      </form>

      {/* LISTAGEM DOS BLOCOS EXISTENTES PARA GERENCIAMENTO */}
      <h3>Blocos Ativos no Site ({listaBlocos.length})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {listaBlocos.map((bloco) => (
          <div key={bloco.ID} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eee', borderRadius: '6px', background: '#fff' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '1.05rem' }}>{bloco.TITULO}</strong>
              <span style={{ fontSize: '0.9rem', color: '#555' }}>{bloco.CONTEUDO}</span>
            </div>
            <button onClick={() => handleExcluirBloco(bloco.ID)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
              Excluir
            </button>
          </div>
        ))}
        {listaBlocos.length === 0 && <p style={{ color: '#777', fontStyle: 'italic' }}>Nenhum bloco ativo no momento.</p>}
      </div>
    </div>
  );
}
