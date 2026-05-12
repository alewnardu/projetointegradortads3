# Projeto Integrador TADS 3

Aplicação web desenvolvida para gerenciamento de brinquedotecas, permitindo cadastro, consulta e gerenciamento de informações por diferentes perfis de usuários.

---

## Tecnologias utilizadas

- Python 3.11
- Flask
- Flask SQLAlchemy
- Flask Migrate
- SQLAlchemy
- MySQL
- JWT Authentication
- Alembic

---

## Pré-requisitos

Antes de executar o projeto, é necessário possuir instalado em sua máquina:

- Python 3.11 ou superior
- MySQL
- Git

---

## Clonando o repositório

Clone o repositório utilizando o comando abaixo:

```bash
git clone https://github.com/alewnardu/projetointegradortads3.git
```

Acesse a pasta do projeto:

```bash
cd projetointegradortads3
```

---

## Criando o ambiente virtual

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux/macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## Instalando as dependências

Com o ambiente virtual ativado, execute:

```bash
pip install -r requirements.txt
```

---

## Configurando as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto utilizando o arquivo `.env-exemplo` como base.

Exemplo:

```env
FLASK_APP=run.py
FLASK_ENV=development

DATABASE_URL=mysql+pymysql://usuario:senha@localhost/brinquedoteca

JWT_SECRET_KEY=sua_chave_secreta
```

---

## Configurando o banco de dados

Em sua instância do MySQL, execute o comando abaixo para criar o banco de dados:

```sql
CREATE DATABASE brinquedoteca;
```

---

## Executando as migrações

As migrações do banco de dados já estão versionadas no repositório.

Execute o comando abaixo para aplicar as migrations existentes:

```bash
flask db upgrade
```

---

## Executando a aplicação

Para iniciar o servidor localmente, execute:

```bash
flask run
```

A aplicação estará disponível em:

```txt
http://localhost:5000/
```

---

## Estrutura do projeto

```txt
app/
├── models/
├── repositories/
├── routes/
├── schemas/
├── services/
├── blueprints.py
├── config.py
├── extensions.py
└── __init__.py

migrations/
run.py
requirements.txt
README.md
```

---

## Arquitetura utilizada

O projeto utiliza arquitetura em camadas, separando responsabilidades entre:

- Routes → definição das rotas da API
- Services → regras de negócio
- Repositories → acesso ao banco de dados
- Models → entidades do sistema
- Schemas → serialização e validação de dados

---

## Problemas comuns

### Erro de conexão com o banco

Verifique:

- se o MySQL está iniciado
- se as credenciais do `.env` estão corretas
- se o banco `brinquedoteca` foi criado

---

### Erro ao executar migrations

Execute novamente:

```bash
flask db upgrade
```

---

## Licença

Este projeto está licenciado sob os termos da licença disponível no arquivo `LICENSE`.