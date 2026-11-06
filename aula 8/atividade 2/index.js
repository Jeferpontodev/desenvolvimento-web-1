const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 8083;

// Se a senha do MySQL for diferente de "root", altere abaixo.
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'crud_alunos'
});

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'cadAlunos.html'));
});

app.post('/adicionar', (req, res) => {
  const codigo = (req.body.codigo || '').trim();
  const nome = (req.body.nome || '').trim();
  const turma = (req.body.turma || '').trim();
  const idade = Number(req.body.idade);
  const email = (req.body.email || '').trim();

  if (!codigo || !nome || !turma || !Number.isInteger(idade) || idade < 1 || !email) {
    return res.status(400).send('<h1>Dados inválidos</h1><p>Informe todos os campos e uma idade válida.</p><p><a href="/">Voltar ao cadastro</a></p>');
  }

  const sql = 'INSERT INTO alunos (codigo, nome, turma, idade, email) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [codigo, nome, turma, idade, email], (err) => {
    if (err) {
      console.error('Erro ao cadastrar aluno:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).send('<h1>Código já cadastrado</h1><p>Use outro código para o aluno.</p><p><a href="/">Voltar ao cadastro</a></p>');
      }
      return res.status(500).send('<h1>Erro ao cadastrar aluno</h1><p>Confira a tabela e a senha do MySQL. Veja o erro no terminal do VS Code.</p><p><a href="/">Voltar ao cadastro</a></p>');
    }
    res.redirect('/listar');
  });
});

app.get('/listar', (req, res) => {
  connection.query('SELECT codigo, nome, turma, idade, email FROM alunos ORDER BY nome', (err, rows) => {
    if (err) {
      console.error('Erro ao listar alunos:', err);
      return res.status(500).send('<h1>Erro ao listar alunos</h1><p>Verifique a conexão com o banco.</p><p><a href="/">Voltar ao cadastro</a></p>');
    }

    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    const linhas = rows.map((aluno) => `
      <tr>
        <td>${escapeHtml(aluno.codigo)}</td>
        <td>${escapeHtml(aluno.nome)}</td>
        <td>${escapeHtml(aluno.turma)}</td>
        <td>${escapeHtml(aluno.idade)}</td>
        <td>${escapeHtml(aluno.email)}</td>
      </tr>`).join('');

    res.send(`<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Alunos</title>
</head>
<body>
    <h1>Lista de Alunos</h1>
    ${rows.length ? `<table border="1">
        <thead>
            <tr><th>Código</th><th>Nome</th><th>Turma</th><th>Idade</th><th>E-mail</th></tr>
        </thead>
        <tbody>${linhas}</tbody>
    </table>` : '<p>Nenhum aluno cadastrado.</p>'}
    <p><a href="/">Cadastrar novo aluno</a></p>
</body>
</html>`);
  });
});

connection.connect((err) => {
  if (err) {
    console.error('Não foi possível conectar ao MySQL:', err.message);
    console.error('Confira se o MySQL está iniciado e se usuário/senha estão corretos.');
    process.exit(1);
    return;
  }
  console.log('Conectado ao MySQL no banco crud_alunos.');
  app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
});
