CREATE DATABASE IF NOT EXISTS crud_alunos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE crud_alunos;

CREATE TABLE IF NOT EXISTS alunos (
    codigo VARCHAR(20) NOT NULL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    turma VARCHAR(50) NOT NULL,
    idade INT NOT NULL,
    email VARCHAR(150) NOT NULL
);

SELECT * FROM alunos;
