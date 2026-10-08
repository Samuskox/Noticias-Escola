import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './GerenciarAutores.css';

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
    <div className="autores-container">
      <Link to="/Dashboard" className="btn-voltar-dashboard">← Voltar ao Painel</Link>
      
      <h2>Gerenciar Autores / Alunos</h2>

      {/* FORMULÁRIO PARA CADASTRAR NOVO AUTOR */}
      <form onSubmit={handleAdicionarAutor} className="form-cadastro-autor">
        <div className="campo-cadastro-grupo">
          <label>Cadastrar Novo Autor:</label>
          <input 
            type="text" 
            placeholder="Ex: Nome do Aluno Redator" 
            required 
            disabled={carregandoCriacao}
            value={novoAutor} 
            onChange={(e) => setNovoAutor(e.target.value)} 
          />
        </div>
        <button 
          type="submit" 
          disabled={carregandoCriacao}
          className="btn-adicionar-autor"
        >
          {carregandoCriacao ? '...' : 'Adicionar'}
        </button>
      </form>

      {/* LISTAGEM DOS AUTORES CADASTRADOS */}
      <h3 className="autores-lista-titulo">Autores Cadastrados ({autores.length})</h3>

      {carregando && <p className="autores-status-msg">Carregando lista de redatores...</p>}

      <div className="autores-grid-lista">
        {autores.map((autor) => (
          <div key={autor.ID_AUTOR} className="autor-item-linha">
            
            {idEditando === autor.ID_AUTOR ? (
              <input 
                type="text" 
                value={nomeEditando} 
                onChange={(e) => setNomeEditando(e.target.value)} 
                className="input-edicao-autor"
              />
            ) : (
              <span className="autor-nome-texto">
                ✍️ {autor.NOME}
              </span>
            )}

            <div className="autor-botoes-acoes">
              {idEditando === autor.ID_AUTOR ? (
                <>
                  <button onClick={() => handleSalvarEdicao(autor.ID_AUTOR)} className="btn-salvar">
                    Salvar
                  </button>
                  <button onClick={() => setIdEditando(null)} className="btn-cancelar">
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => iniciarEdicao(autor.ID_AUTOR, autor.NOME)} className="btn-editar">
                    Editar
                  </button>
                  <button onClick={() => handleExcluirAutor(autor.ID_AUTOR, autor.NOME)} className="btn-excluir-autor">
                    Excluir
                  </button>
                </>
              )}
            </div>

          </div>
        ))}

        {!carregando && autores.length === 0 && (
          <p className="autores-vazio-msg">Nenhum autor cadastrado no sistema.</p>
        )}
      </div>
    </div>
  );
}
