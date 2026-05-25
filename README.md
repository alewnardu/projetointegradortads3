# Projeto Integrador TADS 3

Aplicação web para gerenciamento de brinquedotecas, permitindo o cadastro, consulta e administração de informações por diferentes perfis de usuários.

---

# Estrutura do Projeto

<p align="center">
  <img src="estruturadoprojeto.png" alt="Estrutura do Projeto" width="800">
</p>

<p align="center">
  <em>Figura 1 - Estrutura geral da aplicação.</em>
</p>

# Tecnologias

## Backend (API)

- Python 3.11
- Flask
- Flask SQLAlchemy
- Flask Migrate
- SQLAlchemy
- MySQL
- JWT Authentication
- Alembic

## Infraestrutura e Ambiente

- Docker
- Docker Compose
- Nginx
- Git

---

# Pré-requisitos

Certifique-se de possuir as seguintes ferramentas instaladas:

| Ferramenta | Versão Recomendada |
|------------|-------------------|
| Python | 3.11 ou superior |
| Git | 2.54 ou superior |
| Docker | 29.4.3 ou superior |
| Docker Compose | Compatível com Docker instalado |

---

# Clonando o Repositório

Clone o projeto:

```bash
git clone https://github.com/alewnardu/projetointegradortads3.git
```

Acesse a pasta do projeto:

```bash
cd projetointegradortads3
```

---

# Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto utilizando o arquivo `.env-exemplo` como modelo.

Exemplo:

```env
DATABASE_URL=mysql+pymysql://usuario:senha@localhost/brinquedoteca

JWT_SECRET_KEY=secret_key_gerada_pelo_python

FLASK_APP=run.py
FLASK_ENV=development

LOCAL_APP_URL=http://flask_api:5000

MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_PASSWORD=****************
MAIL_DEFAULT_SENDER=Projeto TADS - TO Brincando
MAIL_USERNAME=email@gmail.com

MYSQL_USER=user
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_HOST=mysql
MYSQL_PASSWORD=password
MYSQL_DATABASE=brinquedoteca
```

---

# Executando o Projeto

## 1. Subir os containers

```bash
docker compose up -d
```

## 2. Verificar os containers em execução

```bash
docker ps
```

## 3. Executar as migrações do banco de dados

```bash
docker exec -it flask_api flask db upgrade
```

## 4. Popular o banco de dados

```bash
docker exec -it flask_api python3 brinquedoteca_seed.py
```

---

# Configuração de DNS Local (Arquivo Hosts)

Para simular a resolução de nomes DNS localmente, adicione uma das entradas abaixo ao arquivo `hosts` do sistema operacional.

## Linux

Arquivo:

```bash
/etc/hosts
```

## Windows

Arquivo:

```txt
C:\Windows\System32\drivers\etc\hosts
```

Adicione uma ou mais das linhas abaixo:

```txt
127.0.0.1    tobrincando.com.br
127.0.0.1    www.tobrincando.com.br
127.0.0.1    dev-tobrincando.com.br
```

---

# Acessando a Aplicação

## Backend (API)

```txt
http://localhost:5000
```

## Frontend

```txt
http://tobrincando.com.br
http://www.tobrincando.com.br
http://dev-tobrincando.com.br
```

---

# Estrutura do Projeto

```text
backend/
├── app/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   ├── seeds/
│   ├── services/
│   ├── __init__.py
│   ├── blueprints.py
│   ├── config.py
│   ├── exceptions.py
│   └── extension.py
├── migrations/
├── uploads/
├── brinquedoteca_seed.py
├── Dockerfile
├── requirements.txt
├── run.py
└── Tads Projeto Integrador Brinquedoteca.postman_collection.json

frontend/
├── public/
├── src/
├── Dockerfile
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js

nginx/
└── default.conf

.env-exemplo
.gitignore
docker-compose.yml
LICENSE
README.md
```

---

# Arquitetura da Aplicação

A API foi desenvolvida seguindo uma arquitetura em camadas, promovendo separação de responsabilidades e maior manutenibilidade.

| Camada | Responsabilidade |
|----------|----------------|
| Routes | Definição dos endpoints da API |
| Services | Regras de negócio |
| Repositories | Acesso e persistência de dados |
| Models | Representação das entidades |
| Schemas | Serialização e validação dos dados |

Fluxo simplificado:

```text
Request
   ↓
Routes
   ↓
Services
   ↓
Repositories
   ↓
Database
```

---

# Problemas Comuns

Antes de iniciar a depuração, verifique:

- Os containers foram iniciados corretamente (`docker ps`);
- O container MySQL está em execução;
- As credenciais configuradas no arquivo `.env` estão corretas;
- As migrações foram executadas com sucesso;
- O script de carga inicial (`brinquedoteca_seed.py`) foi executado;
- As entradas do arquivo `hosts` foram adicionadas corretamente;
- As portas necessárias não estão sendo utilizadas por outros processos.

---

# Coleção Postman

A coleção utilizada para testes da API encontra-se em:

```text
backend/Tads Projeto Integrador Brinquedoteca.postman_collection.json
```

Importe o arquivo no Postman para testar os endpoints disponíveis.

---

# Licença

Este projeto está licenciado conforme os termos definidos no arquivo:

```text
LICENSE
```