# 🛍️ Graça Presentes - E-commerce Full Stack



> Projeto Full Stack de uma loja virtual completa, desenvolvida com Node.js no back-end e JavaScript puro (Vanilla JS) no front-end. A aplicação permite que clientes visualizem produtos, montem um carrinho de compras e finalizem pedidos, que são salvos no banco de dados e notificados ao vendedor via WhatsApp. Inclui também um painel de controle para o vendedor gerenciar o catálogo de produtos.

**Acesse a demonstração ao vivo:** [https://loja2-dzd1.onrender.com/index.html](https://loja2-dzd1.onrender.com/index.html)

---

## ✨ Funcionalidades Principais

O projeto é dividido em duas experiências principais: a do Cliente e a do Vendedor.

### 🛒 Para o Cliente:
- **Vitrine de Produtos Dinâmica:** Os produtos são carregados diretamente do banco de dados.
- **Carrinho de Compras Interativo:** Adicione, remova e altere a quantidade de itens. O estado do carrinho é salvo no navegador (`localStorage`).
- **Checkout Simplificado:** O cliente preenche seus dados (nome, telefone, endereço) para finalizar a compra.
- **Integração com WhatsApp:** Após a confirmação, um modal de sucesso gera uma mensagem formatada para o cliente enviar o pedido diretamente para o WhatsApp do vendedor.
- **Design Responsivo:** A loja se adapta a diferentes tamanhos de tela, de desktops a celulares.

### 🔐 Para o Vendedor (Painel Administrativo):
- **Acesso Restrito:** Painel protegido por senha.
- **Gerenciamento de Produtos (CRUD):**
  - **Adicionar:** Crie novos produtos com nome, descrição, preço e categoria.
  - **Upload de Imagens:** Envie imagens do computador para associar aos produtos, com preview instantâneo.
  - **Listar:** Visualize todos os produtos cadastrados no painel.
  - **Remover:** Exclua produtos do catálogo com um clique.
- **Persistência de Dados:** Todas as alterações são salvas em tempo real no banco de dados MongoDB.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando um stack moderno e robusto, demonstrando habilidades tanto no back-end quanto no front-end.

| Tecnologia | Descrição |
| :--- | :--- |
| **Node.js** | Ambiente de execução do servidor. |
| **Express.js** | Framework para criar a API RESTful e gerenciar as rotas (`/produtos`, `/pedidos`). |
| **MongoDB** | Banco de dados NoSQL para armazenar os produtos e os pedidos dos clientes. |
| **Mongoose** | ODM para modelar os dados da aplicação e interagir com o MongoDB de forma estruturada. |
| **Multer** | Middleware para lidar com o upload de arquivos (imagens dos produtos). |
| **JavaScript (Vanilla JS)** | Linguagem utilizada para toda a lógica do front-end, incluindo manipulação do DOM, requisições à API (`fetch`) e interatividade. |
| **HTML5 & CSS3** | Estrutura e estilização da loja, com foco em semântica e design moderno (Flexbox, Grid). |
| **Render** | Plataforma de nuvem utilizada para o deploy contínuo (CI/CD) tanto do back-end quanto do front-end. |
| **Git & GitHub** | Sistema de controle de versão e plataforma para hospedagem do código-fonte. |

---

## 🛠️ Como Executar o Projeto Localmente

Siga os passos abaixo para rodar a aplicação na sua máquina.

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git

# 2. Navegue até a pasta do projeto
cd loja2

# 3. Instale as dependências do back-end
npm install

# 4. Crie um arquivo .env na raiz do projeto e adicione sua string de conexão do MongoDB
# Exemplo de conteúdo para o arquivo .env:
MONGODB_URI="mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/sua_database"

# 5. Inicie o servidor back-end
node server.js

# 6. Abra o arquivo `index.html` em seu navegador para acessar a loja.
# A aplicação estará rodando e se comunicando com o servidor local na porta 3000.



👨‍💻 Autor
Renato Santos

Desenvolvedor em busca de oportunidades para criar soluções web inovadoras e eficientes.

LinkedIn GitHub


Este `README` vai mostrar aos recrutadores que você não apenas sabe codificar, mas também entende a arquitetura de um projeto, sabe documentá-lo e se preocupa com a apresentação profissional do seu trabalho. Boa sorte na sua busca por uma vaga!

<!--
[PROMPT_SUGGESTION]Como posso adicionar testes automatizados a este projeto para torná-lo ainda mais profissional?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Me ajude a refatorar o código JavaScript do front-end para usar classes e ser mais organizado.[/PROMPT_SUGGESTION]
-->
