// Sistema de Admin
const ADMIN_PASSWORD = "graca123"; // Senha simples para o vendedor
const WHATSAPP_VENDEDOR = "5519987790800"; // Configuração centralizada do WhatsApp

// URL da nossa API - AGORA NO RENDER
// Ajuste automático: detecta se está no Render ou no computador local
const API_URL =
  window.location.hostname.includes("localhost") ||
  window.location.hostname.includes("127.0.0.1")
    ? "http://localhost:3000"
    : "https://loja2-dzd1.onrender.com";
let isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

// Produtos virão do nosso back-end
let produtos = [];

// Carrinho de compras
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Função para carregar produtos do back-end
async function carregarProdutos() {
  try {
    const response = await fetch(`${API_URL}/api/produtos`);
    if (response.ok) {
      let produtosDoBanco = await response.json();
      // ✅ CORREÇÃO: Garantir que as URLs das imagens sejam absolutas
      produtos = produtosDoBanco.map((p) => ({
        ...p,
        id: p._id,
        // Se a imagem for um caminho relativo, converter para URL absoluta
        imagem:
          p.imagem && !p.imagem.startsWith("http")
            ? `${API_URL}${p.imagem.startsWith("/") ? "" : "/"}${p.imagem}`
            : p.imagem,
      }));
      exibirProdutos();
    } else {
      const errorText = await response.text();
      console.error("Erro ao carregar produtos:", response.status, errorText);
      throw new Error(
        `Falha ao carregar produtos do servidor: ${response.status}`,
      );
    }
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    // Em caso de erro, podemos exibir uma mensagem na tela
    exibirProdutos();
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  carregarProdutos(); // Carrega os produtos (agora do JSON)
  atualizarCarrinho();

  // Verifica se é admin e atualiza a UI
  if (isAdminLoggedIn) {
    atualizarUIAdmin();
  }
});

// Carregar produtos na página
function exibirProdutos() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";

  produtos.forEach((produto) => {
    const produtoElement = document.createElement("div");
    produtoElement.className = "product-card";
    produtoElement.innerHTML = `
            <div class="product-image">
                ${
                  produto.imagem
                    ? `<img src="${produto.imagem}" alt="${
                        produto.nome
                      }" onerror="this.style.display='none'; this.parentNode.innerHTML='${getEmojiCategoria(
                        produto.categoria,
                      )}'">`
                    : getEmojiCategoria(produto.categoria)
                }
            </div>
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <div class="product-price">R$ ${
              produto.preco ? produto.preco.toFixed(2) : "0.00"
            }</div>
            <button class="add-to-cart" onclick="adicionarAoCarrinho('${
              produto._id
            }')">
                <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
            </button>
            ${
              isAdminLoggedIn
                ? `
                <div style="margin-top: 10px;">
                    <button class="remove-btn" onclick="removerProduto('${produto._id}')" style="font-size: 0.8rem; padding: 0.3rem 0.6rem;">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            `
                : ""
            }
        `;
    grid.appendChild(produtoElement);
  });
}

// Emojis para categorias
function getEmojiCategoria(categoria) {
  const emojis = {
    perfumes: "🌸",
    skincare: "💆‍♀️",
    maquiagem: "💄",
    cabelos: "💇‍♀️",
    corpo: "🛁",
    presentes: "🎁",
    promocoes: "🔥",
  };
  return emojis[categoria] || "🎁";
}

// Funções do Carrinho
function adicionarAoCarrinho(produtoId) {
  const produto = produtos.find((p) => p._id === produtoId);
  if (!produto) {
    alert("Produto não encontrado!");
    return;
  }

  const itemExistente = carrinho.find((item) => item.id === produtoId);

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({
      ...produto,
      quantidade: 1,
    });
  }

  salvarCarrinho();
  atualizarCarrinho();
  mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
}

function removerDoCarrinho(produtoId) {
  carrinho = carrinho.filter((item) => item._id !== produtoId);
  salvarCarrinho();
  atualizarCarrinho();
}

function alterarQuantidade(produtoId, novaQuantidade) {
  if (novaQuantidade <= 0) {
    removerDoCarrinho(produtoId);
    return;
  }

  const item = carrinho.find((item) => item._id === produtoId);
  if (item) {
    item.quantidade = novaQuantidade;
    salvarCarrinho();
    atualizarCarrinho();
  }
}

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function atualizarCarrinho() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  // Atualizar contador
  const totalItens = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0,
  );
  cartCount.textContent = totalItens;

  // Atualizar itens do carrinho
  cartItems.innerHTML = "";

  if (carrinho.length === 0) {
    cartItems.innerHTML =
      '<p style="text-align: center; color: #666;">Seu carrinho está vazio</p>';
  } else {
    carrinho.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <p>R$ ${item.preco.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="alterarQuantidade('${
                      item._id
                    }', ${item.quantidade - 1})">-</button>
                    <span>${item.quantidade}</span>
                    <button class="quantity-btn" onclick="alterarQuantidade('${
                      item._id
                    }', ${item.quantidade + 1})">+</button>
                    <button class="remove-btn" onclick="removerDoCarrinho('${
                      item._id
                    }')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
      cartItems.appendChild(itemElement);
    });
  }

  // Atualizar total
  const total = carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0,
  );
  cartTotal.textContent = total.toFixed(2);
}

// Funções da UI
function toggleCart() {
  const overlay = document.getElementById("cart-overlay");
  overlay.style.display = overlay.style.display === "block" ? "none" : "block";
}

function mostrarNotificacao(mensagem) {
  // Criar notificação
  const notificacao = document.createElement("div");
  notificacao.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
  notificacao.textContent = mensagem;

  document.body.appendChild(notificacao);

  setTimeout(() => {
    notificacao.remove();
  }, 3000);
}

// Finalizar pedido
function finalizarPedido() {
  if (carrinho.length === 0) {
    mostrarNotificacao("Seu carrinho está vazio!");
    return;
  }
  abrirModalCheckout();
}

// Novo fluxo de Checkout com Modal (Melhor UX)
function abrirModalCheckout(nome = "", telefone = "", endereco = "") {
  const modal = document.createElement("div");
  modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center;
        z-index: 4000;
    `;

  modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 15px; width: 90%; max-width: 400px;">
            <h2 style="color: #8b5cf6; margin-bottom: 1.5rem; text-align: center;">Finalizar Compra</h2>
            <form id="form-checkout" style="display: flex; flex-direction: column; gap: 1rem;">
                <input type="text" id="checkout-nome" placeholder="Seu Nome Completo" value="${nome}" required 
                    style="padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
                
                <input type="tel" id="checkout-telefone" placeholder="Seu WhatsApp (com DDD)" value="${telefone}" required minlength="10"
                    style="padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
                
                <textarea id="checkout-endereco" placeholder="Endereço Completo para Entrega" required 
                    style="padding: 1rem; border: 1px solid #ddd; border-radius: 8px; height: 80px; resize: none;">${endereco}</textarea>
                
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <button type="button" onclick="fecharModal(this)" style="flex: 1; background: #6b7280; color: white; border: none; padding: 1rem; border-radius: 8px; cursor: pointer;">Cancelar</button>
                    <button type="submit" style="flex: 1; background: #10b981; color: white; border: none; padding: 1rem; border-radius: 8px; cursor: pointer; font-weight: bold;">
                        Revisar Pedido
                    </button>
                </div>
            </form>
        </div>
    `;

  document.body.appendChild(modal);

  // Adicionar evento de submit ao formulário
  document
    .getElementById("form-checkout")
    .addEventListener("submit", exibirResumoPedido);
}

function exibirResumoPedido(e) {
  e.preventDefault(); // Impede o recarregamento da página

  // Captura os dados do formulário
  const cliente = document.getElementById("checkout-nome").value;
  const telefone = document.getElementById("checkout-telefone").value;
  const endereco = document.getElementById("checkout-endereco").value;

  // Fecha o modal de formulário atual
  const modalFormulario = e.target.closest('div[style*="position: fixed"]');
  if (modalFormulario) {
    modalFormulario.remove();
  }

  // Abre o Modal de Resumo
  mostrarModalResumo(cliente, telefone, endereco);
}

function mostrarModalResumo(cliente, telefone, endereco) {
  const total = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0,
  );

  const modal = document.createElement("div");
  modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center;
        z-index: 4000;
    `;

  // Gera a lista de itens em HTML
  const itensHtml = carrinho
    .map(
      (item) => `
    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
        <span>${item.quantidade}x ${item.nome}</span>
        <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
    </div>
  `,
    )
    .join("");

  modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 15px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto;">
            <h2 style="color: #8b5cf6; margin-bottom: 1rem; text-align: center;">📝 Resumo do Pedido</h2>
            
            <div style="background: #f9fafb; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: #333; margin-bottom: 0.5rem;">Itens do Carrinho:</h4>
                <div style="max-height: 150px; overflow-y: auto; margin-bottom: 0.5rem;">
                    ${itensHtml}
                </div>
                <div style="text-align: right; font-weight: bold; font-size: 1.1rem; color: #8b5cf6; margin-top: 0.5rem; border-top: 2px solid #eee; padding-top: 0.5rem;">
                    Total: R$ ${total.toFixed(2)}
                </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: #333; margin-bottom: 0.5rem;">Dados de Entrega:</h4>
                <p style="margin: 0.2rem 0; color: #666;"><strong>Nome:</strong> ${cliente}</p>
                <p style="margin: 0.2rem 0; color: #666;"><strong>Telefone:</strong> ${telefone}</p>
                <p style="margin: 0.2rem 0; color: #666;"><strong>Endereço:</strong> ${endereco}</p>
            </div>

            <div style="display: flex; gap: 1rem;">
                <button id="btn-voltar-resumo" style="flex: 1; background: #6b7280; color: white; border: none; padding: 1rem; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-arrow-left"></i> Voltar
                </button>
                <button id="btn-finalizar-real" style="flex: 1; background: #10b981; color: white; border: none; padding: 1rem; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    Confirmar Tudo <i class="fas fa-check"></i>
                </button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // Evento Voltar (Reabre o formulário com os dados preenchidos)
  document.getElementById("btn-voltar-resumo").onclick = function () {
    fecharModal(this);
    abrirModalCheckout(cliente, telefone, endereco);
  };

  // Evento Confirmar (Envia para API)
  document.getElementById("btn-finalizar-real").onclick = function () {
    confirmarEnvioPedido(cliente, telefone, endereco, this);
  };
}

async function confirmarEnvioPedido(cliente, telefone, endereco, btnElement) {
  const originalText = btnElement.innerText;

  // Feedback de Loading (UX)
  btnElement.disabled = true;
  btnElement.innerText = "Enviando...";
  btnElement.style.opacity = "0.7";

  try {
    const pedidoData = {
      itens: carrinho,
      total: carrinho.reduce(
        (total, item) => total + item.preco * item.quantidade,
        0,
      ),
      cliente: cliente,
      telefone: telefone,
      endereco: endereco,
    };

    const response = await fetch(`${API_URL}/api/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedidoData),
    });

    if (response.ok) {
      const pedido = await response.json();
      const mensagem = criarMensagemWhatsApp(pedido);

      carrinho = [];
      salvarCarrinho();
      atualizarCarrinho();
      toggleCart();

      // Fecha o modal de checkout
      fecharModal(btnElement);

      mostrarSucessoPedido(pedido, mensagem);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Erro ao enviar pedido");
    }
  } catch (error) {
    console.error("Erro:", error);
    // Mostra um alerta mais detalhado para facilitar a depuração
    alert("❌ Erro ao processar pedido: " + error.message);
    // Restaura o botão em caso de erro
    btnElement.disabled = false;
    btnElement.innerText = originalText;
    btnElement.style.opacity = "1";
  }
}

function criarMensagemWhatsApp(pedido) {
  let mensagem = `🛍️ *NOVO PEDIDO - Graça Presentes* 🛍️\n\n`;
  mensagem += `*Pedido:* ${pedido.numero_pedido}\n`;
  mensagem += `*Cliente:* ${pedido.cliente}\n`;
  mensagem += `*Telefone:* ${pedido.telefone}\n`;
  mensagem += `*Endereço:* ${pedido.endereco}\n`;
  mensagem += `*Data:* ${new Date(pedido.timestamp).toLocaleDateString(
    "pt-BR",
  )}\n\n`;
  mensagem += `*ITENS DO PEDIDO:*\n`;

  pedido.itens.forEach((item) => {
    mensagem += `• ${item.nome} - ${item.quantidade}x R$ ${item.preco.toFixed(
      2,
    )}\n`;
  });

  mensagem += `\n*TOTAL: R$ ${pedido.total.toFixed(2)}*\n\n`;
  mensagem += `💝 Obrigada pela preferência!`;

  return encodeURIComponent(mensagem);
}

function mostrarSucessoPedido(pedido, mensagemWhatsApp) {
  const modal = document.createElement("div");
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 4000;
    `;

  modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            max-width: 500px;
            margin: 1rem;
        ">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
            <h2 style="color: #8b5cf6; margin-bottom: 1rem;">Pedido Confirmado!</h2>
            <p style="margin-bottom: 1rem; color: #666;">
                Seu pedido <strong>${
                  pedido.numero_pedido
                }</strong> foi enviado com sucesso!
            </p>
            <p style="margin-bottom: 2rem; color: #666;">
                Total: <strong>R$ ${pedido.total.toFixed(2)}</strong>
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="fecharModal(this)" style="
                    background: #6b7280;
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 25px;
                    cursor: pointer;
                ">Fechar</button>
                <button onclick="enviarWhatsApp('${WHATSAPP_VENDEDOR}', '${mensagemWhatsApp}')" style="
                    background: #25d366;
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 25px;
                    cursor: pointer;
                ">
                    <i class="fab fa-whatsapp"></i> Enviar para WhatsApp
                </button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);
}

function fecharModal(button) {
  button.closest('div[style*="position: fixed"]').remove();
}

function enviarWhatsApp(numero, mensagem) {
  const url = `https://wa.me/${numero}?text=${mensagem}`;
  window.open(url, "_blank");
}

// Fechar carrinho ao clicar fora
document.getElementById("cart-overlay").addEventListener("click", function (e) {
  if (e.target === this) {
    toggleCart();
  }
});

// ================== SISTEMA DO VENDEDOR ================== //

// Sistema de Login do Vendedor
function mostrarLoginAdmin() {
  const senha = prompt("Digite a senha do vendedor:");
  if (senha === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    localStorage.setItem("adminLoggedIn", "true");
    alert("Acesso do vendedor ativado!");
    location.reload();
  } else if (senha) {
    alert("Senha incorreta!");
  }
}

function logoutAdmin() {
  isAdminLoggedIn = false;
  localStorage.setItem("adminLoggedIn", "false");
  alert("Acesso do vendedor desativado!");
  location.reload();
}

// Função para zerar todos os pedidos (Limpar Histórico)
async function zerarPedidos() {
  if (
    !confirm(
      "⚠️ PERIGO: Tem certeza que deseja APAGAR TODOS os pedidos do histórico?\n\nEssa ação não pode ser desfeita!",
    )
  ) {
    return;
  }

  const senha = prompt("Digite a senha de administrador para confirmar:");
  if (senha !== ADMIN_PASSWORD) {
    alert("Senha incorreta! Ação cancelada.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/pedidos`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("✅ Histórico de pedidos limpo com sucesso!");
      document.querySelector('div[style*="position: fixed"]').remove(); // Fecha modal
      mostrarPainelAdmin(); // Reabre atualizado
    } else {
      throw new Error("Erro ao limpar histórico");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("❌ Erro ao tentar limpar o histórico.");
  }
}

// Painel do Vendedor COM UPLOAD DE IMAGEM E RESUMO DE PEDIDOS
async function mostrarPainelAdmin() {
  // 1. Buscar os pedidos da API
  let pedidosAdmin = [];
  let faturamentoTotal = 0;
  try {
    const response = await fetch(`${API_URL}/api/pedidos`);
    if (response.ok) {
      pedidosAdmin = await response.json();
      faturamentoTotal = pedidosAdmin.reduce(
        (acc, pedido) => acc + pedido.total,
        0,
      );
    } else {
      console.error("Falha ao carregar pedidos para o painel de admin.");
    }
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
  }

  // 2. Criar o HTML para o resumo e a lista de pedidos
  const resumoPedidosHtml = `
    <div style="margin-bottom: 2rem; background: #f9fafb; padding: 1.5rem; border-radius: 8px;">
        <h3 style="color: #333; margin-bottom: 1rem; border-bottom: 2px solid #eee; padding-bottom: 0.5rem;">📊 Resumo de Vendas</h3>
        <div style="display: flex; justify-content: space-around; text-align: center;">
            <div>
                <p style="font-size: 1.5rem; font-weight: bold; color: #8b5cf6;">${
                  pedidosAdmin.length
                }</p>
                <p style="color: #666; font-size: 0.9rem;">Total de Pedidos</p>
            </div>
            <div>
                <p style="font-size: 1.5rem; font-weight: bold; color: #10b981;">R$ ${faturamentoTotal.toFixed(
                  2,
                )}</p>
                <p style="color: #666; font-size: 0.9rem;">Faturamento Total</p>
            </div>
        </div>
    </div>
  `;

  const listaPedidosHtml = `
    <div style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="color: #333; margin: 0;">Últimos Pedidos Recebidos</h3>
            ${
              pedidosAdmin.length > 0
                ? `<button onclick="zerarPedidos()" style="background: #ef4444; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem;"><i class="fas fa-trash"></i> Limpar Histórico</button>`
                : ""
            }
        </div>
        <div style="max-height: 350px; overflow-y: auto; border: 1px solid #eee; border-radius: 8px;">
            ${
              pedidosAdmin.length === 0
                ? '<p style="padding: 1rem; text-align: center; color: #666;">Nenhum pedido encontrado.</p>'
                : pedidosAdmin
                    .map(
                      (pedido) => `
                <div style="padding: 1rem; border-bottom: 1px solid #eee;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <strong style="font-size: 0.9rem;">Pedido: ${
                          pedido.numero_pedido
                        }</strong>
                        <span style="font-weight: bold; color: #10b981;">R$ ${pedido.total.toFixed(
                          2,
                        )}</span>
                    </div>
                    <p style="font-size: 0.9rem; color: #666; margin: 0.2rem 0;"><strong>Cliente:</strong> ${
                      pedido.cliente
                    }</p>
                    <p style="font-size: 0.9rem; color: #666; margin: 0.2rem 0;"><strong>Data:</strong> ${new Date(
                      pedido.timestamp,
                    ).toLocaleString("pt-BR")}</p>
                    <details style="margin-top: 0.5rem; font-size: 0.9rem;">
                        <summary style="cursor: pointer; color: #8b5cf6;">Ver Itens (${
                          pedido.itens.length
                        })</summary>
                        <ul style="list-style-type: none; padding-left: 1rem; margin-top: 0.5rem; color: #555;">
                            ${pedido.itens
                              .map(
                                (item) =>
                                  `<li>• ${item.quantidade}x ${item.nome}</li>`,
                              )
                              .join("")}
                        </ul>
                    </details>
                </div>
            `,
                    )
                    .join("")
            }
        </div>
    </div>
  `;

  // 3. Montar o modal
  const modal = document.createElement("div");
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 4000;
    `;

  modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            width: 600px; /* Largura aumentada */
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="color: #8b5cf6;">🛍️ Painel do Vendedor</h2>
                <button onclick="fecharModal(this)" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            
            ${resumoPedidosHtml}
            ${listaPedidosHtml}

            <hr style="border: none; border-top: 1px solid #ddd; margin: 2rem 0;">

            <div style="margin-bottom: 2rem;">
                <h3 style="color: #333; margin-bottom: 1rem;">Adicionar Novo Produto</h3>
                <form id="form-produto" style="display: flex; flex-direction: column; gap: 1rem;">
                    <input type="text" id="produto-nome" placeholder="Nome do Produto" required style="padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px;">
                    <textarea id="produto-descricao" placeholder="Descrição do Produto" required style="padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; height: 80px; resize: vertical;"></textarea>
                    <input type="number" id="produto-preco" placeholder="Preço (ex: 29.90)" step="0.01" min="0" required style="padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px;">
                    <select id="produto-categoria" required style="padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px;">
                        <option value="">Selecione a Categoria</option>
                        <option value="perfumes">Perfumes</option>
                        <option value="maquiagem">Maquiagem</option>
                        <option value="skincare">Skincare</option>
                        <option value="cabelos">Cabelos</option>
                        <option value="corpo">Corpo & Banho</option>
                        <option value="presentes">Kits Presente</option>
                    </select>
                    
                    <!-- Upload de imagem do computador -->
                    <div style="border: 2px dashed #ddd; padding: 1.5rem; text-align: center; border-radius: 8px; background: #fafafa; margin-top: 0.5rem;">
                        <input type="file" id="produto-imagem" accept=".jpg,.jpeg,.png,.gif,.webp" style="display: none;">
                        <div id="imagem-preview" style="margin-bottom: 1rem;"></div>
                        <button type="button" onclick="document.getElementById('produto-imagem').click()" style="
                            background: #8b5cf6;
                            color: white;
                            border: none;
                            padding: 0.8rem 1.5rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 1rem;
                        ">
                            <i class="fas fa-cloud-upload-alt"></i> Escolher Imagem do Computador
                        </button>
                        <p style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">
                            Formatos: JPG, PNG, GIF, WebP
                        </p>
                    </div>
                    
                    <button type="button" onclick="adicionarProdutoComImagem()" style="background: #8b5cf6; color: white; border: none; padding: 1rem; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                        <i class="fas fa-plus"></i> Adicionar Produto
                    </button>
                </form>
            </div>
            
            <div>
                <h3 style="color: #333; margin-bottom: 1rem;">Produtos Cadastrados (${
                  produtos.length
                })</h3>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${produtos
                      .map(
                        (produto) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; border-bottom: 1px solid #eee;">
                            <div style="display: flex; align-items: center; gap: 0.8rem;">
                                ${
                                  produto.imagem
                                    ? `<img src="${produto.imagem}" alt="${produto.nome}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">`
                                    : `<div style="width: 40px; height: 40px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">${getEmojiCategoria(
                                        produto.categoria,
                                      )}</div>`
                                }
                                <div>
                                    <strong>${produto.nome}</strong>
                                    <div style="font-size: 0.9rem; color: #666;">R$ ${produto.preco.toFixed(
                                      2,
                                    )} - ${produto.categoria}</div>
                                </div>
                            </div>
                            <button onclick="removerProduto('${
                              produto.id
                            }')" style="background: #ef4444; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                                Remover
                            </button>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
            
            <div style="margin-top: 2rem; text-align: center;">
                <button onclick="logoutAdmin()" style="background: #6b7280; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-sign-out-alt"></i> Sair do Painel
                </button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // Configurar preview de imagem
  document
    .getElementById("produto-imagem")
    .addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        // Verificar tamanho (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("Arquivo muito grande! Escolha uma imagem menor que 5MB.");
          this.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
          const preview = document.getElementById("imagem-preview");
          preview.innerHTML = `
                    <img src="${
                      e.target.result
                    }" alt="Preview" style="max-width: 200px; max-height: 150px; border-radius: 8px; border: 2px solid #8b5cf6;">
                    <div style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">
                        ${file.name} (${(file.size / 1024 / 1024).toFixed(
                          2,
                        )} MB)
                        <br><button type="button" onclick="removerImagem()" style="background: #ef4444; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; margin-top: 0.3rem;">Remover Imagem</button>
                    </div>
                `;
        };
        reader.readAsDataURL(file);
      }
    });
}

// Remover imagem selecionada
function removerImagem() {
  document.getElementById("produto-imagem").value = "";
  document.getElementById("imagem-preview").innerHTML = "";
}

// Adicionar produto com upload de imagem
async function adicionarProdutoComImagem() {
  const form = document.getElementById("form-produto");
  const formData = new FormData();

  // Validar campos obrigatórios
  const nome = document.getElementById("produto-nome").value;
  const descricao = document.getElementById("produto-descricao").value;
  const preco = document.getElementById("produto-preco").value;
  const categoria = document.getElementById("produto-categoria").value;

  if (!nome || !descricao || !preco || !categoria) {
    alert("Por favor, preencha todos os campos obrigatórios!");
    return;
  }

  // Adicionar dados do formulário
  formData.append("nome", nome);
  formData.append("descricao", descricao);
  formData.append("preco", preco);
  formData.append("categoria", categoria);

  // Adicionar arquivo de imagem se existir
  const imagemInput = document.getElementById("produto-imagem");
  if (imagemInput.files[0]) {
    formData.append("imagem", imagemInput.files[0]);
  }

  try {
    const response = await fetch(`${API_URL}/api/produtos`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("✅ Produto adicionado com sucesso!");
      form.reset();
      removerImagem(); // Limpa o preview
      fecharModal(
        document
          .getElementById("form-produto")
          .closest('div[style*="position: fixed"]'),
      );
      await carregarProdutos(); // Recarrega a lista
      location.reload(); // Recarrega a página para mostrar o novo produto
    } else {
      const error = await response.json();
      throw new Error(error.detail || "Erro ao adicionar produto");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("❌ Erro ao adicionar produto: " + error.message);
  }
}

// Remover produto
async function removerProduto(produtoId) {
  if (!confirm("Tem certeza que deseja remover este produto?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/produtos/${produtoId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("✅ Produto removido com sucesso!");
      await carregarProdutos(); // Recarrega a lista
      location.reload();
    } else {
      throw new Error("Erro ao remover produto");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("❌ Erro ao remover produto. Verifique o console.");
  }
}

function atualizarUIAdmin() {
  // Adiciona botão do vendedor no header
  const headerActions = document.querySelector(".header-actions");
  if (headerActions && !document.getElementById("admin-btn")) {
    const adminBtn = document.createElement("button");
    adminBtn.id = "admin-btn";
    adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Vendedor';
    adminBtn.style.background = "#10b981";
    adminBtn.style.color = "white";
    adminBtn.style.border = "none";
    adminBtn.style.padding = "0.8rem 1.5rem";
    adminBtn.style.borderRadius = "25px";
    adminBtn.style.cursor = "pointer";
    adminBtn.style.marginLeft = "1rem";
    adminBtn.onclick = mostrarPainelAdmin;

    headerActions.appendChild(adminBtn);

    // Remove o botão de login
    const loginBtn = document.querySelector(".admin-btn");
    if (loginBtn) {
      loginBtn.remove();
    }
  }
}

// Adicione CSS para animação
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
