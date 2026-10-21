import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './EditarNoticia.css';

export default function EditarNoticia() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados dos campos
  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setCarvando] = useState(false);

  // Estados para controle dos múltiplos autores
  const [listaAutores, setListaAutores] = useState([]);
  const [autoresSelecionados, setAutoresSelecionados] = useState([]);
  const [novosAutoresTexto, setNovosAutoresTexto] = useState('');

  useEffect(() => {
    const adminLogado = localStorage.getItem('adminLogado');
    if (!adminLogado) {
      navigate('/login');
    } else {
      carregarDadosIniciais();
    }
  }, [id, navigate]);

  const carregarDadosIniciais = async () => {
    try {
      setCarregando(true);

      // 1. Busca todos os autores cadastrados para o <select>
      const { data: autoresData } = await supabase.from('AUTORES').select('*').order('NOME');
      if (autoresData) setListaAutores(autoresData);

      // 2. Busca a notícia específica e seus autores vinculados atualmente
      const { data: noticiaData, error } = await supabase
        .from('NOTICIAS')
        .select(`
          TITULO, RESUMO, CONTEUDO, URL_VIDEO,
          NOTICIA_AUTOR_TEM ( FK_AUTORES_ID )
        `)
        .eq('ID_NOTICIAS', id)
        .single();

      if (error) throw error;

      if (noticiaData) {
        setTitulo(noticiaData.TITULO);
        setResumo(noticiaData.RESUMO);
        setConteudo(noticiaData.CONTEUDO);
        setVideoUrl(noticiaData.URL_VIDEO || '');
        
        // Preenche os autores que já estavam marcados nessa notícia
        const idsMarcados = noticiaData.NOTICIA_AUTOR_TEM?.map(p => p.FK_AUTORES_ID) || [];
        setAutoresSelecionados(idsMarcados);
      }
    } catch (error) {
      alert('Erro ao carregar dados da notícia: ' + error.message);
      navigate('/gerenciar-noticias');
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvarAlteracoes = async (e) => {
    e.preventDefault();
    setCarvando(true);

    try {
      let idsAutoresFinais = [...autoresSelecionados].map(Number);

      // 1. Se digitou novos autores, cadastra eles primeiro
      if (novosAutoresTexto.trim() !== '') {
        const nomesNovos = novosAutoresTexto.split(',').map(n => n.trim()).filter(Boolean);
        for (const nome of nomesNovos) {
          const { data: criado } = await supabase.from('AUTORES').insert([{ NOME: nome }]).select('ID_AUTOR');
          if (criado && criado.length > 0) {
            idsAutoresFinais.push(criado[0].ID_AUTOR);
          } else {
            const { data: existente } = await supabase.from('AUTORES').select('ID_AUTOR').eq('NOME', nome).single();
            if (existente) idsAutoresFinais.push(existente.ID_AUTOR);
          }
        }
      }

      // 2. Atualiza os dados de texto na tabela NOTICIAS
      const { error: updateError } = await supabase
        .from('NOTICIAS')
        .update({
          TITULO: titulo,
          RESUMO: resumo,
          CONTEUDO: conteudo,
          URL_VIDEO: videoUrl || null
        })
        .eq('ID_NOTICIAS', id);

      if (updateError) throw updateError;

      // 3. Atualiza os vínculos Muchos para Muitos (N:N) dos autores
      // Primeiro apaga os vínculos antigos dessa notícia específica na tabela pivô
      await supabase.from('NOTICIA_AUTOR_TEM').delete().eq('FK_NOTICIAS_ID', id);

      // Agora insere a nova lista de autores atualizada
      if (idsAutoresFinais.length > 0) {
        const novosVinculos = idsAutoresFinais.map(idAutor => ({
          FK_NOTICIAS_ID: Number(id),
          FK_AUTORES_ID: idAutor
        }));
        const { error: erroVinculo } = await supabase.from('NOTICIA_AUTOR_TEM').insert(novosVinculos);
        if (erroVinculo) throw erroVinculo;
      }

      alert('✨ Matéria atualizada com sucesso para todos os leitores!');
      navigate('/gerenciar-noticias');
    } catch (error) {
      alert('Erro ao atualizar notícia: ' + error.message);
    } finally {
      setCarvando(false);
    }
  };

  const handleSelectChange = (e) => {
    const valores = Array.from(e.target.selectedOptions, option => option.value);
    setAutoresSelecionados(valores);
  };

  if (carregando) return <p style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>Carregando dados da matéria...</p>;

  return (
    <div className="editar-noticia-container">
      <Link to="/gerenciarNoticias" className="btn-voltar-gerenciar">
        ← Cancelar e Voltar
      </Link>

      <h1 className="editar-noticia-titulo-tela">✏️ Alterar Matéria</h1>

      <form onSubmit={handleSalvarAlteracoes} className="form-editar-noticia">
        <div className="form-group-editar">
          <label>Título da Notícia:</label>
          <input type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>

        <div className="form-group-editar">
          <label>Autores Vinculados (Segure Ctrl para selecionar vários):</label>
          <select multiple value={autoresSelecionados} onChange={handleSelectChange}>
            {listaAutores.map((aut) => (
              <option key={aut.ID_AUTOR} value={aut.ID_AUTOR}>{aut.NOME}</option>
            ))}
          </select>
        </div>

        <div className="form-group-editar">
          <label className="label-azul-novo">Adicionar mais autores novos (separe por vírgula):</label>
          <input type="text" placeholder="Ex: Aluno Novo A, Aluna Nova B" value={novosAutoresTexto} onChange={(e) => setNovosAutoresTexto(e.target.value)} />
        </div>

        <div className="form-group-editar">
          <label>Resumo (Texto do Card):</label>
          <input type="text" required value={resumo} onChange={(e) => setResumo(e.target.value)} />
        </div>

        <div className="form-group-editar">
          <label>Conteúdo Completo:</label>
          <textarea required rows="8" value={conteudo} onChange={(e) => setConteudo(e.target.value)} />
        </div>

        <div className="form-group-editar">
          <label>URL do Vídeo do YouTube:</label>
          <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com..." />
        </div>

        <button type="submit" disabled={salvando} className="btn-salvar-edicao-final">
          {salvando ? '⏳ Gravando alterações...' : '💾 Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}
