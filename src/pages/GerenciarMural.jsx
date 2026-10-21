import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './GerenciarMural.css'; // Vamos criar esse arquivo com estilo limpo

export default function GerenciarMural() {
  const [listaBlocos, setListaBlocos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Estados do formulário (serve para criar E para editar)
  const [idEditando, setIdEditando] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [statusAtivo, setStatusAtivo] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const adminLogado = localStorage.getItem('adminLogado');
    if (!adminLogado) navigate('/login');
    else buscarBlocos();
  }, [navigate]);

  // Carrega todos os blocos do banco de dados (ativos e inativos)
  const buscarBlocos = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('MURAL_HOME')
        .select('*')
        .order('ORDEM', { ascending: true })
        .order('DATA_CRIACAO', { ascending: false });

      if (error) throw error;
      setListaBlocos(data || []);
    } catch (error) {
      alert('Erro ao buscar blocos do mural: ' + error.message);
    } finally {
      setCarregando(false);
    }
  };

  // Salva um bloco novo ou atualiza um existente (Graças ao upsert)
  const handleSalvarBloco = async (e) => {
    e.preventDefault();
    if (titulo.trim() === '' || conteudo.trim() === '') return;
    setSalvando(true);

    try {
      const dadosBloco = {
        TITULO: titulo.trim(),
        CONTEUDO: conteudo.trim(),
        STATUS: statusAtivo
      };

      // Se estiver editando, injeta o ID na linha para o Postgres substituir
      if (idEditando) {
        dadosBloco.ID = idEditando;
      } else {
        // Se for novo, define a ordem com base no tamanho da lista
        dadosBloco.ORDEM = listaBlocos.length + 1;
      }

      const { error } = await supabase
        .from('MURAL_HOME')
        .upsert([dadosBloco]);

      if (error) throw error;

      alert(idEditando ? '📝 Bloco alterado com sucesso!' : '✅ Novo bloco criado no mural!');
      handleLimparFormulario();
      buscarBlocos();
    } catch (error) {
      alert('Erro ao salvar bloco: ' + error.message);
    } finally {
      setSalvando(false);
    }
  };

  // Ativa o modo de edição, jogando as informações para os inputs superiores
  const iniciarEdicao = (bloco) => {
    setIdEditando(bloco.ID);
    setTitulo(bloco.TITULO);
    setConteudo(bloco.CONTEUDO);
    setStatusAtivo(bloco.STATUS);
  };

  // Alterna rapidamente o STATUS de ativo/inativo direto no clique do botão da linha
  const handleAlternarStatus = async (id, statusAtual) => {
    try {
      const { error } = await supabase
        .from('MURAL_HOME')
        .update({ STATUS: !statusAtual })
        .eq('ID', id);

      if (error) throw error;
      buscarBlocos(); // Recarrega a tabela imediatamente
    } catch (error) {
      alert('Erro ao alterar status: ' + error.message);
    }
  };

  // Remove permanentemente o bloco do banco
  const handleExcluirBloco = async (id) => {
    if (!window.confirm('🗑️ Tem certeza de que deseja excluir permanentemente este aviso do mural?')) return;

    try {
      const { error } = await supabase
        .from('MURAL_HOME')
        .delete()
        .eq('ID', id);

      if (error) throw error;
      buscarBlocos();
    } catch (error) {
      alert('Erro ao excluir bloco: ' + error.message);
    }
  };

  const handleLimparFormulario = () => {
    setIdEditando(null);
    setTitulo('');
    setConteudo('');
    setStatusAtivo(true);
  };

  return (
    <div className="gerenciar-mural-container">
      <Link to="/dashboard" className="btn-voltar-painel">
        ← Voltar ao Painel
      </Link>

      <h1 className="gerenciar-mural-titulo-tela">
        {idEditando ? '✏️ Editar Bloco do Mural' : '⚙️ Gerenciar Mural da Home'}
      </h1>

      {/* FORMULÁRIO DE CADASTRO / EDIÇÃO */}
      <form onSubmit={handleSalvarBloco} className="form-mural-admin">
        <div className="form-group-mural">
          <label>Título do Bloco Informativo:</label>
          <input 
            type="text" 
            required 
            placeholder="Ex: 🍱 Almoço do Dia ou 📅 Evento" 
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)} 
          />
        </div>

        <div className="form-group-mural">
          <label>Conteúdo do Recado:</label>
          <textarea 
            required 
            rows="3" 
            placeholder="Digite as informações do bloco..." 
            value={conteudo} 
            onChange={(e) => setConteudo(e.target.value)} 
          />
        </div>

        <div className="form-group-mural checkbox-inline">
          <input 
            type="checkbox" 
            id="status-checkbox"
            checked={statusAtivo} 
            onChange={(e) => setStatusAtivo(e.target.checked)} 
          />
          <label htmlFor="status-checkbox">Exibir este bloco ativo na página inicial (Home)</label>
        </div>

        <div className="botoes-form-mural">
          <button type="submit" disabled={salvando} className="btn-salvar-mural">
            {salvando ? '⏳ Gravando...' : idEditando ? '💾 Atualizar Recado' : '➕ Inserir no Mural'}
          </button>
          
          {idEditando && (
            <button type="button" onClick={handleLimparFormulario} className="btn-cancelar-mural">
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      {/* TABELA / LISTAGEM DE GERENCIAMENTO */}
      <section className="secao-tabela-mural">
        <h3>Lista de Blocos Cadastrados ({listaBlocos.length})</h3>
        
        {carregando && <p className="status-mural-msg">Buscando recados na nuvem...</p>}
        
        <div className="lista-blocos-mural-admin">
          {listaBlocos.map((bloco) => (
            <div key={bloco.ID} className={`card-bloco-admin ${!bloco.STATUS ? 'bloco-desativado' : ''}`}>
              <div className="info-bloco-admin">
                <strong>{bloco.TITULO} {!bloco.STATUS && <span className="tag-inativo">🚫 Inativo</span>}</strong>
                <p>{bloco.CONTEUDO}</p>
              </div>

              <div className="botoes-acoes-mural">
                <button 
                  type="button"
                  onClick={() => handleAlternarStatus(bloco.ID, bloco.STATUS)}
                  className={`btn-mural-toggle ${bloco.STATUS ? 'btn-status-ativo' : 'btn-status-inativo'}`}
                >
                  {bloco.STATUS ? '🟢 Ativo' : '🔴 Inativo'}
                </button>
                <button 
                  type="button"
                  onClick={() => iniciarEdicao(bloco)} 
                  className="btn-mural-editar"
                >
                  ✏️ Editar
                </button>
                <button 
                  type="button"
                  onClick={() => handleExcluirBloco(bloco.ID)} 
                  className="btn-mural-excluir"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}

          {!carregando && listaBlocos.length === 0 && (
            <p className="status-mural-msg">Nenhum recado cadastrado no banco de dados.</p>
          )}
        </div>
      </section>
    </div>
  );
}
