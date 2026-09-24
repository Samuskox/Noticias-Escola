import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('fisico.db');

app.use(cors());
app.use(express.json());

db.exec(`
CREATE TABLE IF NOT EXISTS "ADMINISTRADOR" (
	"ID_ADMIN"	INT AUTO_INCREMENT,
	"NOME_ADMINISTRADOR"	VARCHAR(50) NOT NULL,
	"SENHA_ADMINISTRADOR"	VARCHAR(50) NOT NULL,
	PRIMARY KEY("ID_ADMIN")
);
CREATE TABLE IF NOT EXISTS "IMAGENS" (
	"ID_IMG"	INT AUTO_INCREMENT,
	"CAMINHO_IMG"	VARCHAR(150),
	PRIMARY KEY("ID_IMG")
);
CREATE TABLE IF NOT EXISTS "NOTICIAS" (
	"ID_NOTICIAS"	INT AUTO_INCREMENT,
	"TITULO"	VARCHAR(150) NOT NULL,
	"RESUMO"	VARCHAR(250) NOT NULL,
	"CONTEUDO"	TEXT NOT NULL,
	"URL_IMAGEM"	TEXT,
	"URL_VIDEO"	TEXT,
	"DATA"	DATETIME,
	"FK_ADMINISTRADOR_ID_ADMIN"	INT,
	PRIMARY KEY("ID_NOTICIAS"),
	CONSTRAINT "FK_NOTICAS_ADM" FOREIGN KEY("FK_ADMINISTRADOR_ID_ADMIN") REFERENCES ""
);
CREATE TABLE IF NOT EXISTS "NOTICIA_IMG_TEM" (
	"FK_NOTICIAS_ID_NOTICIAS"	INT,
	"FK_IMAGENS_ID_IMG"	INT,
	CONSTRAINT "FK_NOTICIA_TEM_IMG_2" FOREIGN KEY("FK_IMAGENS_ID_IMG") REFERENCES "",
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
  const { titulo, resumo, conteudo, url_video, id_admin, caminho_imagens } = req.body;

  const criarNoticiaCompleta = db.transaction(() => {
    const stmt = db.prepare(`
      INSERT INTO NOTICIAS (TITULO, RESUMO, CONTEUDO, URL_VIDEO, FK_ADMINISTRADOR_ID_ADMIN)
      VALUES (?, ?, ?, ?, ?)
    `);

    const infoNoticia = stmt.run(titulo, resumo, conteudo, url_video, id_admin, caminho_imagens);
    const idNoticia = infoNoticia.lastInsertRowid;

    if(caminho_imagens && Array.isArray(caminho_imagens)){
      const stmtImg = db.prepare(`INSERT INTO IMAGENS (CAMINHO_IMG) VALUES (?)`);
      const stmtVinculo = db.prepare(`
        INSERT INTO NOTICIA_IMG_TEM (FK_NOTICIAS_ID_NOTICIAS, FK_IMAGENS_ID_IMG)
        VALUES (?, ?)
      `);

      for(const caminho of caminho_imagens){
        const infoImg = stmtImg.run(caminho_imagens);
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

app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});