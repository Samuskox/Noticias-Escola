import { useState } from 'react';

export default function Admin() {
  // Estados para armazenar os dados do formulário
  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imagens, setImagens] = useState([]);

  // Função disparada ao clicar em "Postar Notícia"
  const handleSubmeter = (e) => {
    e.preventDefault(); // Evita que a página recarregue

    // Gera a data e hora automaticamente no formato local (BR)
    const dataPostagem = new Date().toLocaleString('pt-BR');

    // Objeto final pronto para enviar para uma API ou salvar no LocalStorage
    const novaNoticia = {
      id: Date.now().toString(), // Gera um ID único simples baseado no tempo
      titulo,
      resumo,
      conteudo,
      videoUrl,
      imagens: Array.from(imagens), // Converte a lista de arquivos para Array
      data: dataPostagem
    };

    console.log('Notícia criada com sucesso:', novaNoticia);
    alert('Notícia postada com sucesso! Verifique o console.');

    // Limpa o formulário após o envio
    setTitulo('');
    setResumo('');
    setConteudo('');
    setVideoUrl('');
    setImagens([]);
    e.target.reset(); // Reseta o campo de upload de arquivos visualmente
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        Área do Administrador
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
