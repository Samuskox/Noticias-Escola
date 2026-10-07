import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseclient';


export default function Admin() {

  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [autores, setAutores] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imagens, setImagens] = useState([]);
  const [carregando, setCarregando] = useState(false);


  const [listaAutores, setListaAutores] = useState([]);
  const [autoresSelecionados, setAutoresSelecionados] = useState([]); // Array de IDs selecionados
  const [novosAutoresTexto, setNovosAutoresTexto] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const adminLogado = localStorage.getItem('adminLogado');

    if(!adminLogado){
      navigate('/login');
    } else {
      buscarAutores();
    }
  }, [navigate]);

    const buscarAutores = async () => {
    const { data } = await supabase.from('AUTORES').select('*').order('NOME', { ascending: true });
    if (data) setListaAutores(data);
    };

    const handleSubmeter = async (e) => {
    e.preventDefault();
    setCarregando(true);
    
    try {
      const admin = JSON.parse(localStorage.getItem('adminLogado'));
      const idAdmin = admin?.ID_ADMIN || 1;
      let idsAutoresFinais = [...autoresSelecionados].map(Number);
      // 1. SE DIGITOU NOVOS AUTORES (SEPARADOS POR VÍRGULA), CADASTRA ELES PRIMEIRO
      if (novosAutoresTexto.trim() !== '') {
        const nomesNovos = novosAutoresTexto.split(',').map(n => n.trim()).filter(Boolean);
        
        for (const nome of nomesNovos) {
          // Insere ou ignora se já existir (devido ao UNIQUE no banco)
          const { data: criado } = await supabase
            .from('AUTORES')
            .insert([{ NOME: nome }])
            .select('ID_AUTOR');

          if (criado && criado.length > 0) {
            idsAutoresFinais.push(criado[0].ID_AUTOR);
          } else {
            // Se já existia, busca o ID dele
            const { data: existente } = await supabase.from('AUTORES').select('ID_AUTOR').eq('NOME', nome).single();
            if (existente) idsAutoresFinais.push(existente.ID_AUTOR);
          }
        }
      }

      // Se nenhum autor foi selecionado ou criado, assume o ID 1 padrão
      if (idsAutoresFinais.length === 0 && listaAutores.length > 0) {
        idsAutoresFinais.push(listaAutores[0].ID_AUTOR);
      }

      // 2. UPLOAD DAS IMAGENS (Igual ao seu fluxo atual)
      const listaUrlsImagens = [];
      if (imagens && imagens.length > 0) {
        for (let i = 0; i < imagens.length; i++) {
          const arquivo = imagens[i];
          const nomeUnico = `${Date.now()}-${arquivo.name}`;
          const { error: uploadError } = await supabase.storage.from('noticias-imagens').upload(nomeUnico, arquivo);
          if (uploadError) throw uploadError;
          const { data: urlData } = supabase.storage.from('noticias-imagens').getPublicUrl(nomeUnico);
          listaUrlsImagens.push(urlData.publicUrl);
        }
      }

      // 3. SALVAR A NOTÍCIA
      const { data: novaNoticiaData, error: insertError } = await supabase
        .from('NOTICIAS')
        .insert([
          {
            TITULO: titulo,
            RESUMO: resumo,
            CONTEUDO: conteudo,
            URL_VIDEO: videoUrl || null,
            FK_ADMINISTRADOR_ID_ADMIN: idAdmin,
            IMAGENS: listaUrlsImagens
          }
        ])
        .select('ID_NOTICIAS')
        .single();

      if (insertError) throw insertError;
      const idDaNoticiaCriada = novaNoticiaData.ID_NOTICIAS;

      // 4. VINCULAR MÚLTIPLOS AUTORES NA TABELA PIVÔ (NOTICIA_AUTOR_TEM)
      const vinculos = idsAutoresFinais.map(idAutor => ({
        FK_NOTICIAS_ID: idDaNoticiaCriada,
        FK_AUTORES_ID: idAutor
      }));

      const { error: erroVinculo } = await supabase.from('NOTICIA_AUTOR_TEM').insert(vinculos);
      if (erroVinculo) throw erroVinculo;

      alert('Notícia e fotos publicadas com sucesso!');
      setTitulo('');
      setResumo('');
      setConteudo('');
      setVideoUrl('');
      setImagens([]);
      e.target.reset();
      
    } catch (error) {
      console.error("Erro ao publicar a notícia: ", error);
      alert('Erro ao salvar no banco de dados');
      
    } finally{
      setCarregando(false);
    }
  };

    const handleSelectChange = (e) => {
    const valores = Array.from(e.target.selectedOptions, option => option.value);
    setAutoresSelecionados(valores);
  };


  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        Escrever Notícia
      </h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>Preencha os campos abaixo para publicar uma nova notícia.</p>

      <form onSubmit={handleSubmeter} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Campo: Título */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold' }}>Título da Notícia:</label>
          <input
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Grande vitória no campeonato de xadrez"
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Campo: Resumo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold' }}>Resumo (Aparece no Card):</label>
          <input
            type="text"
            required
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            placeholder="Ex: Alunos do 9º ano conquistam o primeiro lugar..."
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Campo: Conteúdo Completo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold' }}>Conteúdo da Matéria:</label>
          <textarea
            required
            rows="6"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Escreva a notícia completa aqui..."
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold' }}>Selecionar Autores (Segure Ctrl para escolher mais de 1):</label>
          <select multiple value={autoresSelecionados} onChange={handleSelectChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', height: '100px' }}>
            {listaAutores.map((aut) => (
              <option key={aut.ID_AUTOR} value={aut.ID_AUTOR}>{aut.NOME}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', color: '#007bff' }}>Ou cadastrar novos autores na hora (separe por vírgula):</label>
          <input type="text" placeholder="Ex: Aluno Lucas, Aluna Mariana, Aluno Pedro" value={novosAutoresTexto} onChange={(e) => setNovosAutoresTexto(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #007bff', boxSizing: 'border-box' }} />
        </div>

        {/* Campo: Imagens (Múltiplas) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold' }}>Imagens da Notícia (Selecione 1 ou mais):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImagens(e.target.files)}
            style={{ padding: '6px 0' }}
          />
        </div>

        {/* Campo: URL do Vídeo (Apenas 1) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold' }}>URL do Vídeo (YouTube, Drive, etc.):</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Ex: https://youtube.com..."
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          style={{
            background: '#007bff',
            color: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          {carregando ? 'Postando Noticia....' : 'Postar Noticia'}
        </button>

      </form>
    </div>
  );
}
