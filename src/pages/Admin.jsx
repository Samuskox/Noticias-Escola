import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseclient';


export default function Admin() {

  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imagens, setImagens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const adminLogado = localStorage.getItem('adminLogado');

    if(!adminLogado){
      navigate('/login');
    }
  }, [navigate]);

    const handleSubmeter = async (e) => {
    e.preventDefault();
    setCarregando(true);
    
    try {
      const admin = JSON.parse(localStorage.getItem('adminLogado'));
      const idAdmin = admin?.ID_ADMIN || 1;

      const listaUrlsImagens = [];
       console.log("Ta entrando aqui:::");

      if(imagens && imagens.length > 0){
        for(let i = 0; i < imagens.length; i++){
          const arquivo = imagens[i];

          const nomeArquivo = `${Date.now()}-${arquivo.name}`;
          
          const  {data: uploadData, error: uploadError } = await supabase.storage.from('noticias-imagens').upload(nomeArquivo, arquivo);

          if(uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('noticias-imagens')
            .getPublicUrl(nomeArquivo);
         
          listaUrlsImagens.push(urlData.publicUrl);
        }
      }


      const { error: insertError } = await supabase
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
        ]);

      if (insertError) throw insertError;

      alert('Notícia e fotos publicadas com sucesso na nuvem do Firebase!');
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
