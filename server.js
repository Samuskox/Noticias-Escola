import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('fisico.db');

app.use(cors());
app.use(express.json());

db.exec(`
CREATE TABLE IF NOT EXISTS "ADMINISTRADOR" (
	"ID_ADMIN"	INTEGER PRIMARY KEY AUTOINCREMENT, -- Ajustado para a sintaxe do SQLite
	"NOME_ADMINISTRADOR"	VARCHAR(50) NOT NULL,
	"SENHA_ADMINISTRADOR"	VARCHAR(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS "IMAGENS" (
	"ID_IMG"	INTEGER PRIMARY KEY AUTOINCREMENT, -- Ajustado para a sintaxe do SQLite
	"CAMINHO_IMG"	VARCHAR(150)
);
CREATE TABLE IF NOT EXISTS "NOTICIAS" (
	"ID_NOTICIAS"	INTEGER PRIMARY KEY AUTOINCREMENT, -- Ajustado para a sintaxe do SQLite
	"TITULO"	VARCHAR(150) NOT NULL,
	"RESUMO"	VARCHAR(250) NOT NULL,
	"CONTEUDO"	TEXT NOT NULL,
	"URL_IMAGEM"	TEXT,
	"URL_VIDEO"	TEXT,
	"DATA"	DATETIME DEFAULT CURRENT_TIMESTAMP, -- Gera data automática
	"FK_ADMINISTRADOR_ID_ADMIN"	INT,
	CONSTRAINT "FK_NOTICAS_ADM" FOREIGN KEY("FK_ADMINISTRADOR_ID_ADMIN") REFERENCES "ADMINISTRADOR"("ID_ADMIN") -- Corrigida referência vazia
);
CREATE TABLE IF NOT EXISTS "NOTICIA_IMG_TEM" (
	"FK_NOTICIAS_ID_NOTICIAS"	INT,
	"FK_IMAGENS_ID_IMG"	INT,
	CONSTRAINT "FK_NOTICIA_TEM_IMG_2" FOREIGN KEY("FK_IMAGENS_ID_IMG") REFERENCES "IMAGENS"("ID_IMG"), -- Corrigida referência vazia
	CONSTRAINT "FK_NOTICIA_TEM_IMG_1" FOREIGN KEY("FK_NOTICIAS_ID_NOTICIAS") REFERENCES "NOTICIAS"("ID_NOTICIAS")
);
`);

// Insere um admin de teste se a tabela estiver vazia
const checkAdmin = db.prepare('SELECT COUNT(*) as total FROM administrador').get();
if (checkAdmin.total === 0) {
  db.prepare('INSERT INTO ADMINISTRADOR (NOME_ADMINISTRADOR, SENHA_ADMINISTRADOR) VALUES (?, ?)')
    .run('admin', '1234');
  console.log('Admin de teste criado: Usuário "admin" / Senha "1234"');
}

// 1. Rota de Login
app.post('/api/login', (req, res) => {
  const { usuario, senha } = req.body;
  const user = db.prepare('SELECT ID_ADMIN, NOME_ADMINISTRADOR FROM ADMINISTRADOR WHERE NOME_ADMINISTRADOR = ? AND SENHA_ADMINISTRADOR = ?')
    .get(usuario, senha);

  if (user) {
    res.json({ sucesso: true, admin: user });
  } else {
    res.status(401).json({ sucesso: false, mensagem: 'Usuário ou senha inválidos!' });
  }
});

// 2. Rota de Criar Notícia
app.post('/api/noticia', (req, res) => {
  const { titulo, resumo, conteudo, url_video, id_admin, imagens_multiplas } = req.body;

  const criarNoticiaCompleta = db.transaction(() => {
    const stmt = db.prepare(`
        INSERT INTO NOTICIAS (TITULO, RESUMO, CONTEUDO, URL_VIDEO, FK_ADMINISTRADOR_ID_ADMIN)
        VALUES (?, ?, ?, ?, ?)
    `);

    const infoNoticia = stmt.run(titulo, resumo, conteudo, url_video || null, id_admin);
    const idNoticia = infoNoticia.lastInsertRowid;

    if (imagens_multiplas && Array.isArray(imagens_multiplas)) {
      const stmtImg = db.prepare(`INSERT INTO IMAGENS (CAMINHO_IMG) VALUES (?)`);
      const stmtVinculo = db.prepare(`
        INSERT INTO NOTICIA_IMG_TEM (FK_NOTICIAS_ID_NOTICIAS, FK_IMAGENS_ID_IMG)
        VALUES (?, ?)
      `);

      for (const caminho of imagens_multiplas) {
        const infoImg = stmtImg.run(caminho);
        const idImagem = infoImg.lastInsertRowid;
        stmtVinculo.run(idNoticia, idImagem);
      }

    }

    return idNoticia;
  });
  try {
    const novoId = criarNoticiaCompleta();
    res.json({ sucesso: true, id_noticia: novoId, mensagem: "Notícia e imagem salvas com sucesso!" });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

app.get('/api/noticias', (req, res) => {
  try {
    // Busca todas as notícias ordenadas pela data mais recente
    const noticias = db.prepare(`
      SELECT n.*, a.NOME_ADMINISTRADOR 
      FROM NOTICIAS n
      LEFT JOIN ADMINISTRADOR a ON n.FK_ADMINISTRADOR_ID_ADMIN = a.ID_ADMIN
      ORDER BY n.DATA DESC
    `).all();

    // Para cada notícia, busca as imagens vinculadas a ela
    const noticiasComImagens = noticias.map((noticia) => {
      const imagensVinculadas = db.prepare(`
        SELECT i.CAMINHO_IMG 
        FROM NOTICIA_IMG_TEM nit
        JOIN IMAGENS i ON nit.FK_IMAGENS_ID_IMG = i.ID_IMG
        WHERE nit.FK_NOTICIAS_ID_NOTICIAS = ?
      `).all(noticia.ID_NOTICIAS);

      return {
        id: noticia.ID_NOTICIAS.toString(), // Converte para String para bater com suas chaves antigas
        titulo: noticia.TITULO,
        resumo: noticia.RESUMO,
        conteudo: noticia.CONTEUDO,
        url_video: noticia.URL_VIDEO,
        data: noticia.DATA,
        autor: noticia.NOME_ADMINISTRADOR || 'Anônimo',
        // Mapeia o resultado transformando em um array simples de caminhos/URLs: ["uploads/foto1.png", ...]
        imagens: imagensVinculadas.map(img => img.CAMINHO_IMG) 
      };
    });

    res.json(noticiasComImagens);
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

app.get('/api/noticias/:id', (req, res) => {
  const { id } = req.params;

  try {
    // Busca a notícia específica pelo ID
    const noticia = db.prepare(`
      SELECT n.*, a.NOME_ADMINISTRADOR 
      FROM NOTICIAS n
      LEFT JOIN ADMINISTRADOR a ON n.FK_ADMINISTRADOR_ID_ADMIN = a.ID_ADMIN
      WHERE n.ID_NOTICIAS = ?
    `).get(id);

    // Se não encontrar a notícia, retorna 404
    if (!noticia) {
      return res.status(404).json({ sucesso: false, mensagem: 'Notícia não encontrada!' });
    }

    // Busca todas as imagens vinculadas a essa notícia específica
    const imagensVinculadas = db.prepare(`
      SELECT i.CAMINHO_IMG 
      FROM NOTICIA_IMG_TEM nit
      JOIN IMAGENS i ON nit.FK_IMAGENS_ID_IMG = i.ID_IMG
      WHERE nit.FK_NOTICIAS_ID_NOTICIAS = ?
    `).all(id);

    // Estrutura o objeto final para enviar ao React
    res.json({
      id: noticia.ID_NOTICIAS.toString(),
      titulo: noticia.TITULO,
      resumo: noticia.RESUMO,
      conteudo: noticia.CONTEUDO,
      url_video: noticia.URL_VIDEO,
      data: noticia.DATA,
      autor: noticia.NOME_ADMINISTRADOR || 'Anônimo',
      imagens: imagensVinculadas.map(img => img.CAMINHO_IMG)
    });

  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});