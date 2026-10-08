import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

import './GerenciarMural.css';

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

      alert('Novo bloco adicionado ao mural!');
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
    <div className="mural-manager-container">
      <Link to="/Dashboard" className="btn-voltar-painel">← Voltar ao Painel</Link>
      
      <h2>⚙️ Gerenciar Blocos do Mural</h2>
      
      {/* FORMULÁRIO PARA ADICIONAR NOVO BLOCO */}
      <form onSubmit={handleAdicionarBloco} className="form-cadastro-bloco">
        <h4>➕ Adicionar Novo Bloco Informativo</h4>
        <input 
          type="text" 
          placeholder="Título do Bloco (Ex: ⚽ Grêmio Estudantil)" 
          required 
          value={novoTitulo} 
          onChange={(e) => setNovoTitulo(e.target.value)} 
        />
        <textarea 
          placeholder="Conteúdo informativo..." 
          required 
          rows="3" 
          value={novoConteudo} 
          onChange={(e) => setNovoConteudo(e.target.value)} 
        />
        <button type="submit" className="btn-inserir" disabled={carregando}>
          {carregando ? 'Adicionando...' : 'Inserir no Mural'}
        </button>
      </form>

      {/* LISTAGEM DOS BLOCOS EXISTENTES PARA GERENCIAMENTO */}
      <h3>Blocos Ativos no Site ({listaBlocos.length})</h3>
      <div className="lista-blocos-ativos">
        {listaBlocos.map((bloco) => (
          <div key={bloco.ID} className="bloco-item-gerenciável">
            <div className="bloco-item-info">
              <strong>{bloco.TITULO}</strong>
              <span>{bloco.CONTEUDO}</span>
            </div>
            <button onClick={() => handleExcluirBloco(bloco.ID)} className="btn-excluir">
              Excluir
            </button>
          </div>
        ))}
        {listaBlocos.length === 0 && (
          <p className="mural-vazio-notificacao">Nenhum bloco ativo no momento.</p>
        )}
      </div>
    </div>
  );
}
