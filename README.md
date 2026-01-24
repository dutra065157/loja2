# 🛍️ E-commerce Fullstack - Graça Presentes

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![NodeJS](https://img.shields.io/badge/Node.js-v18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

Uma aplicação web completa de comércio eletrônico desenvolvida para gerenciar vendas de produtos de beleza e presentes. O projeto conta com uma interface responsiva para clientes e um painel administrativo seguro para gerenciamento de estoque, utilizando uma arquitetura **REST API**.

---

## 🚀 Funcionalidades

### 👤 Para o Cliente

- **Catálogo Visual:** Exibição de produtos em grid responsivo com imagens e preços.
- **Carrinho de Compras:**
  - Adicionar/Remover itens.
  - Ajuste de quantidade em tempo real.
  - Persistência de dados (o carrinho não some ao atualizar a página) usando `localStorage`.
- **Checkout via WhatsApp:** Integração que gera uma mensagem formatada com o pedido e envia diretamente para o vendedor.
- **Categorias:** Filtragem visual por emojis e tipos de produto (Perfumes, Skincare, etc.).

### 🛡️ Painel Administrativo (Vendedor)

- **Autenticação Simples:** Sistema de login para acesso restrito.
- **Gestão de Produtos:**
  - Adicionar novos produtos com Upload de Imagem (Multer).
  - Visualizar lista de produtos cadastrados.
  - Excluir produtos do catálogo.
- **Preview de Imagem:** Visualização da imagem antes de fazer o upload.

---

## 🛠️ Tecnologias Utilizadas

### Front-end

- **HTML5 & CSS3:** Layout moderno, responsivo e com animações (CSS Grid/Flexbox).
- **JavaScript (Vanilla):** Manipulação do DOM, Fetch API para consumo do backend e lógica de estado do carrinho.

### Back-end

- **Node.js & Express:** Servidor robusto e criação da API RESTful.
- **Multer:** Middleware para gerenciamento de upload de arquivos (imagens).
- **CORS:** Configuração de segurança para requisições cruzadas.
- **Dotenv:** Gerenciamento de variáveis de ambiente.

### Banco de Dados

- **MongoDB (Atlas):** Banco de dados NoSQL para armazenamento flexível de produtos e pedidos.
- **Mongoose:** ODM para modelagem de dados e validação de schemas.

---

## 📂 Estrutura do Projeto

```
loja2/
├── images/             # Armazenamento local de uploads
├── models/             # Schemas do Mongoose (Produto, Pedido)
├── node_modules/       # Dependências
├── routes/             # Rotas da API (Endpoints)
├── .env                # Variáveis de ambiente (não versionado)
├── index.html          # Página principal
├── script.js           # Lógica do Frontend
├── server.js           # Ponto de entrada do Backend
└── style.css           # Estilos globais
```

---
 ** 🔧 Acesse a Aplicação**
   Abra seu navegador em: https://dutra065157.github.io/loja2/

---

## 🔐 Acesso ao Painel Admin (Demo)

Para testar as funcionalidades de vendedor localmente:

1. Clique no botão "Vendedor" (ou acesse via console/login).


---

## 🔮 Melhorias Futuras

- [ ] Implementar autenticação JWT para o login de admin.
- [ ] Armazenamento de imagens em nuvem (Cloudinary/AWS S3) para persistência em produção.
- [ ] Histórico de pedidos no painel administrativo.

---

Desenvolvido com 💜 por [RenatoSantos]
