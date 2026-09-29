import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {

  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imagens, setImagens] = useState([]);
  const navigate = useNavigate();

    const handleSubmeter = async (e) => {
    e.preventDefault(); 

    const admin = JSON.parse(localStorage.getItem('adminLogado'));
    const idAdmin = admin?.ID_ADMIN || 1;

    const formData = new FormData();

    formData.append('titulo', titulo);
    formData.append('resumo', resumo);
    formData.append('conteudo', conteudo);
    formData.append('url_video', videoUrl);
    formData.append('id_admin', idAdmin);

    for(let i = 0; i< imagens.length; i++){
      formData.append('imagens_multiplas', imagens[i]);
    }

    try {
      // Faz o envio real para o seu backend Node.js
      const resposta = await fetch('http://localhost:3001/api/noticia', {
        method: 'POST',
        body: formData,
      });

      const dados = await resposta.json();

      if (resposta.ok && dados.sucesso) {
        alert('🚀 Notícia postada com sucesso no banco de dados!');
        
        // Limpa o formulário após o envio com sucesso
        setTitulo('');
        setResumo('');
        setConteudo('');
        setVideoUrl('');
        setImagens([]);
        e.target.reset(); 
      } else {
        alert('Erro ao salvar no banco: ' + (dados.erro || 'Erro desconhecido'));
      }
    } catch (error) {
      alert('Não foi possível conectar ao servidor backend. Verifique se o Node está rodando na porta 3001.');
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
          🚀 Postar Notícia
        </button>

      </form>
    </div>
  );
}
