# 🛍️ E-commerce Fullstack - Graça Presentes

![Status do Projeto](https://img.shields.io/badge/Status-Ativo_%26_Em_Melhorias-brightgreen)
![NodeJS](https://img.shields.io/badge/Node.js-v18%2B-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

Uma aplicação web completa de comércio eletrônico desenvolvida para gerenciar vendas de produtos de beleza e presentes. O projeto conta com uma interface responsiva para clientes e um painel administrativo seguro para gerenciamento de estoque, utilizando uma arquitetura **REST API**.

---

## 🌐 Link do Projeto

Acesse a aplicação online: **[Graça Presentes - App Web](https://loja2-dzd1.onrender.com)**

## 🚀 Funcionalidades

### 👤 Para o Cliente

- **Catálogo Visual:** Exibição de produtos em grid responsivo com imagens e preços.
- **Carrinho de Compras:**
  - Adicionar/Remover itens.
  - Ajuste de quantidade em tempo real.
  - Persistência de dados (o carrinho não some ao atualizar a página) usando `localStorage`.
- **Checkout com Revisão:** Modal de resumo para conferência de itens e dados antes do envio via WhatsApp.
- **Categorias:** Filtragem visual por emojis e tipos de produto (Perfumes, Skincare, etc.).

### 🛡️ Painel Administrativo (Vendedor)

- **Autenticação Simples:** Sistema de login para acesso restrito.
- **Gestão de Produtos:**
  - Adicionar novos produtos com Upload de Imagem (Integrado com **Cloudinary**).
  - **Dashboard de Vendas:** Visualização de faturamento total, contagem de pedidos e histórico detalhado dos últimos pedidos.
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
- **Multer & Cloudinary:** Middleware para upload e armazenamento de imagens na nuvem.
- **CORS:** Configuração de segurança para requisições cruzadas.
- **Render:** Plataforma de nuvem para hospedagem do back-end e front-end.
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

## 🔐 Acesso ao Painel Admin (Demo)

Para testar as funcionalidades de vendedor localmente:

1. Clique no botão "Vendedor" (ou acesse via console/login).

---

## 🔮 Melhorias Futuras

- [ ] Implementar autenticação JWT para o login de admin.
- [x] Armazenamento de imagens em nuvem (**Cloudinary**) para persistência em produção.
- [x] Histórico de pedidos no painel administrativo.
- [ ] Adicionar status ao pedido (Pendente, Enviado, Entregue).

---

Desenvolvido com 💜 por [RenatoSantos]
