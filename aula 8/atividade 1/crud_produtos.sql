create database crud_prdutos;
use crud_prdutos;
create table produtos (
    id int primary key auto_increment,
    nome varchar(100) not null,
    quantidade int not null,
    preco decimal(10,2) not null
);
select * from produtos;

DESCRIBE produtos;