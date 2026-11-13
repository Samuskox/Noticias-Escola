import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './GerenciarEventos.css';

export default function GerenciarEventos() {
  const [listaEventos, setListaEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Estados do formulário (usado tanto para criar quanto para editar)
  const [idEditando, setIdEditando] = useState(null);
  const [dataEvento, setDataEvento] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const adminLogado = localStorage.getItem('adminLogado');
    if (!adminLogado) {
      navigate('/login');
    } else {
      buscarEventos();
    }
  }, [navigate]);

  // Busca todos os eventos cadastrados ordenados pela data
  const buscarEventos = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('EVENTOS')
        .select('*')
        .order('DATA_EVENTO', { ascending: true });

      if (error) throw error;
      setListaEventos(data || []);
    } catch (error) {
      alert('Erro ao carregar eventos: ' + error.message);
    } finally {
      setCarregando(false);
    }
  };

  // Salva um novo evento ou atualiza um existente
  const handleSalvarEvento = async (e) => {
    e.preventDefault();
    if (!dataEvento || titulo.trim() === '') return;
    setSalvando(true);

    try {
      const dadosEvento = {
        DATA_EVENTO: dataEvento,
        TITULO: titulo.trim(),
        DESCRICAO: descricao.trim() || null
      };

      if (idEditando) {
        // Modo Edição
        const { error } = await supabase
          .from('EVENTOS')
          .update(dadosEvento)
          .eq('ID_EVENTO', idEditando);

        if (error) throw error;
        alert('📅 Evento atualizado com sucesso!');
      } else {
        // Modo Criação
        const { error } = await supabase
          .from('EVENTOS')
          .insert([dadosEvento]);

        if (error) throw error;
        alert('✅ Novo evento adicionado ao calendário!');
      }

      handleLimparFormulario();
      buscarEventos();
    } catch (error) {
      alert('Erro ao salvar evento: ' + error.message);
    } finally {
      setSalvando(false);
    }
  };

  // Preenche o formulário superior para edição
  const iniciarEdicao = (evento) => {
    setIdEditando(evento.ID_EVENTO);
    setDataEvento(evento.DATA_EVENTO);
    setTitulo(evento.TITULO);
    setDescricao(evento.DESCRICAO || '');
  };

  // Exclui o evento do banco de dados
  const handleExcluirEvento = async (id, tituloEv) => {
    if (!window.confirm(`🗑️ Tem certeza que deseja excluir o evento "${tituloEv}"?`)) return;

    try {
      const { error } = await supabase
        .from('EVENTOS')
        .delete()
        .eq('ID_EVENTO', id);

      if (error) throw error;
      buscarEventos();
    } catch (error) {
      alert('Erro ao excluir evento: ' + error.message);
    }
  };

  const handleLimparFormulario = () => {
    setIdEditando(null);
    setDataEvento('');
    setTitulo('');
    setDescricao('');
  };

  // Função auxiliar para mostrar a data no padrão brasileiro (DD/MM/AAAA) na lista
  const formatarDataBR = (dataStr) => {
    if (!dataStr) return '';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="gerenciar-eventos-container">
      <Link to="/Dashboard" className="btn-voltar-painel">
        ← Voltar ao Painel
      </Link>

      <h1 className="gerenciar-eventos-titulo">
        {idEditando ? 'Editar Evento' : 'Gerenciar Eventos do Mês'}
      </h1>

      {/* FORMULÁRIO DE INSERÇÃO / EDIÇÃO */}
      <form onSubmit={handleSalvarEvento} className="form-eventos-admin">
        <div className="form-row-eventos">
          <div className="form-group-evento data-field">
            <label>Data do Evento:</label>
            <input 
              type="date" 
              required 
              value={dataEvento} 
              onChange={(e) => setDataEvento(e.target.value)} 
            />
          </div>

          <div className="form-group-evento titulo-field">
            <label>Título do Evento:</label>
            <input 
              type="text" 
              required 
              placeholder="Ex: Feira de Ciências" 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
            />
          </div>
        </div>

        <div className="form-group-evento">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Descrição / Detalhes (Opcional):</label>
            <span style={{ fontSize: '0.8rem', color: descricao.length >= 90 ? '#dc3545' : '#64748b', fontWeight: '600' }}>
              {descricao.length}/50 caracteres
            </span>
          </div>
          <input 
            type="text" 
            maxLength={50} /* Trava nativa do navegador no limite exato de 100 letras */
            placeholder="Ex: No pátio central, a partir das 14h" 
            value={descricao} 
            onChange={(e) => setDescricao(e.target.value)} 
          />
        </div>

        <div className="botoes-form-eventos">
          <button type="submit" disabled={salvando} className="btn-salvar-evento">
            {salvando ? 'Salvando...' : idEditando ? 'Atualizar Evento' : 'Cadastrar Evento'}
          </button>

          {idEditando && (
            <button type="button" onClick={handleLimparFormulario} className="btn-cancelar-evento">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* LISTA DE EVENTOS CADASTRADOS */}
      <section className="secao-lista-eventos">
        <h3>Calendário Cadastrado ({listaEventos.length})</h3>

        {carregando && <p className="msg-status-eventos">Carregando eventos...</p>}

        <div className="lista-eventos-cards">
          {listaEventos.map((ev) => (
            <div key={ev.ID_EVENTO} className="card-evento-admin">
              <div className="info-evento-admin">
                <span className="badge-data-admin">🗓️ {formatarDataBR(ev.DATA_EVENTO)}</span>
                <div>
                  <strong>{ev.TITULO}</strong>
                  {ev.DESCRICAO && <p>{ev.DESCRICAO}</p>}
                </div>
              </div>

              <div className="acoes-evento-admin">
                <button type="button" onClick={() => iniciarEdicao(ev)} className="btn-ev-editar">
                  Editar
                </button>
                <button type="button" onClick={() => handleExcluirEvento(ev.ID_EVENTO, ev.TITULO)} className="btn-ev-excluir">
                  Excluir
                </button>
              </div>
            </div>
          ))}

          {!carregando && listaEventos.length === 0 && (
            <p className="msg-status-eventos">Nenhum evento cadastrado ainda.</p>
          )}
        </div>
      </section>
    </div>
  );
}
