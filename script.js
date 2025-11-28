// Sistema de Admin
const ADMIN_PASSWORD = "graca123"; // Senha simples para o vendedor

// URL da nossa API. Para desenvolvimento local, usamos localhost.
const API_URL = 'http://localhost:3000'; // IMPORTANTE: Quando for para produção (Render.com), troque por sua URL online.

let isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

// Produtos virão do nosso back-end
let produtos = [];

// Carrinho de compras
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para carregar produtos do back-end
async function carregarProdutos() {
    try {
        const response = await fetch(`${API_URL}/api/produtos`); 
        if (response.ok) {
            let produtosDoBanco = await response.json();
            // O MongoDB já usa _id, que o script espera. Mapeamos para 'id' por segurança.
            produtos = produtosDoBanco.map(p => ({ ...p, id: p._id }));
            exibirProdutos();
        } else {
            console.error('Erro ao carregar produtos.json, usando fallback.');
            throw new Error('Falha ao carregar produtos do servidor.');
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        // Em caso de erro, podemos exibir uma mensagem na tela
        exibirProdutos();
    }
}



// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos(); // Carrega os produtos (agora do JSON)
    atualizarCarrinho();
    
    // Verifica se é admin e atualiza a UI
    if (isAdminLoggedIn) {
        atualizarUIAdmin();
    }
});

// Carregar produtos na página
function exibirProdutos() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    produtos.forEach(produto => {
        const produtoElement = document.createElement('div');
        produtoElement.className = 'product-card';
        produtoElement.innerHTML = `
            <div class="product-image">
                ${produto.imagem ? 
                    `<img src="${produto.imagem}" alt="${produto.nome}">` : 
                    getEmojiCategoria(produto.categoria)
                }
            </div>
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <div class="product-price">R$ ${produto.preco ? produto.preco.toFixed(2) : '0.00'}</div>
            <button class="add-to-cart" onclick="adicionarAoCarrinho('${produto._id}')">
                <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
            </button>
            ${isAdminLoggedIn ? `
                <div style="margin-top: 10px;">
                    <button class="remove-btn" onclick="removerProduto('${produto._id}')" style="font-size: 0.8rem; padding: 0.3rem 0.6rem;">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            ` : ''}
        `;
        grid.appendChild(produtoElement);
    });
}

// Emojis para categorias
function getEmojiCategoria(categoria) {
    const emojis = {
        'perfumes': '🌸',
        'skincare': '💆‍♀️',
        'maquiagem': '💄',
        'cabelos': '💇‍♀️',
        'corpo': '🛁',
        'presentes': '🎁',
        'promocoes': '🔥'
    };
    return emojis[categoria] || '🎁';
}

// Funções do Carrinho
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p._id === produtoId);
    if (!produto) {
        alert('Produto não encontrado!');
        return;
    }
    
    const itemExistente = carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }
    
    salvarCarrinho();
    atualizarCarrinho();
    mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
}

function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item._id !== produtoId); // Ajustado para usar _id
    salvarCarrinho();
    atualizarCarrinho();
}

function alterarQuantidade(produtoId, novaQuantidade) {
    if (novaQuantidade <= 0) {
        removerDoCarrinho(produtoId);
        return;
    }
    
    const item = carrinho.find(item => item._id === produtoId); // Ajustado para usar _id
    if (item) {
        item.quantidade = novaQuantidade;
        salvarCarrinho();
        atualizarCarrinho();
    }
}

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarCarrinho() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Atualizar contador
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    cartCount.textContent = totalItens;
    
    // Atualizar itens do carrinho
    cartItems.innerHTML = '';
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Seu carrinho está vazio</p>';
    } else {
        carrinho.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <p>R$ ${item.preco.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="alterarQuantidade('${item._id}', ${item.quantidade - 1})">-</button>
                    <span>${item.quantidade}</span>
                    <button class="quantity-btn" onclick="alterarQuantidade('${item._id}', ${item.quantidade + 1})">+</button>
                    <button class="remove-btn" onclick="removerDoCarrinho('${item._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });
    }
    
    // Atualizar total
    const total = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Funções da UI
function toggleCart() {
    const overlay = document.getElementById('cart-overlay');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
}

function mostrarNotificacao(mensagem) {
    // Criar notificação
    const notificacao = document.createElement('div');
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
async function finalizarPedido() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    // Coletar dados do cliente
    const cliente = prompt('Digite seu nome:');
    const telefone = prompt('Digite seu WhatsApp:');
    const endereco = prompt('Digite seu endereço para entrega:');

    if (!cliente || !telefone || !endereco) {
        alert('Todos os dados são obrigatórios!');
        return;
    }

    try {
        const pedidoData = {
            itens: carrinho,
            total: carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0),
            cliente: cliente,
            telefone: telefone,
            endereco: endereco
        };

        // Enviar para API
        const response = await fetch(`${API_URL}/api/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedidoData)
        });

        if (response.ok) {
            const pedido = await response.json();
            const mensagem = criarMensagemWhatsApp(pedido);
            
            // Limpar carrinho
            carrinho = [];
            salvarCarrinho();
            atualizarCarrinho();
            toggleCart();
            
            mostrarSucessoPedido(pedido, mensagem);
        } else {
            throw new Error('Erro ao enviar pedido');
        }
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar pedido. Tente novamente.');
    }
}

function criarMensagemWhatsApp(pedido) {
    let mensagem = `🛍️ *NOVO PEDIDO - Graça Presentes* 🛍️\n\n`;
    mensagem += `*Pedido:* ${pedido.numero_pedido}\n`;
    mensagem += `*Cliente:* ${pedido.cliente}\n`;
    mensagem += `*Telefone:* ${pedido.telefone}\n`;
    mensagem += `*Endereço:* ${pedido.endereco}\n`;
    mensagem += `*Data:* ${new Date(pedido.timestamp).toLocaleDateString('pt-BR')}\n\n`;
    mensagem += `*ITENS DO PEDIDO:*\n`;
    
    pedido.itens.forEach(item => {
        mensagem += `• ${item.nome} - ${item.quantidade}x R$ ${item.preco.toFixed(2)}\n`;
    });
    
    mensagem += `\n*TOTAL: R$ ${pedido.total.toFixed(2)}*\n\n`;
    mensagem += `💝 Obrigada pela preferência!`;
    
    return encodeURIComponent(mensagem);
}

function mostrarSucessoPedido(pedido, mensagemWhatsApp) {
    const numeroWhatsApp = '5511999999999'; // Substitua pelo número do vendedor
    
    const modal = document.createElement('div');
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
                Seu pedido <strong>${pedido.numero_pedido}</strong> foi enviado com sucesso!
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
                <button onclick="enviarWhatsApp('${numeroWhatsApp}', '${mensagemWhatsApp}')" style="
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
    window.open(url, '_blank');
}

// Fechar carrinho ao clicar fora
document.getElementById('cart-overlay').addEventListener('click', function(e) {
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
        localStorage.setItem('adminLoggedIn', 'true');
        alert("Acesso do vendedor ativado!");
        location.reload();
    } else if (senha) {
        alert("Senha incorreta!");
    }
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    localStorage.setItem('adminLoggedIn', 'false');
    alert("Acesso do vendedor desativado!");
    location.reload();
}

// Painel do Vendedor COM UPLOAD DE IMAGEM
function mostrarPainelAdmin() {
    const modal = document.createElement('div');
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
            width: 500px;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2 style="color: #8b5cf6;">🛍️ Painel do Vendedor</h2>
                <button onclick="fecharModal(this)" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            
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
                    
                    <!-- NOVO: Upload de imagem do computador -->
                    <div style="border: 2px dashed #ddd; padding: 1.5rem; text-align: center; border-radius: 8px; background: #fafafa;">
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
                <h3 style="color: #333; margin-bottom: 1rem;">Produtos Cadastrados (${produtos.length})</h3>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${produtos.map(produto => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; border-bottom: 1px solid #eee;">
                            <div style="display: flex; align-items: center; gap: 0.8rem;">
                                ${produto.imagem ? 
                                    `<img src="${produto.imagem}" alt="${produto.nome}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">` : 
                                    `<div style="width: 40px; height: 40px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">${getEmojiCategoria(produto.categoria)}</div>`
                                }
                                <div>
                                    <strong>${produto.nome}</strong>
                                    <div style="font-size: 0.9rem; color: #666;">R$ ${produto.preco.toFixed(2)} - ${produto.categoria}</div>
                                </div>
                            </div>
                            <button onclick="removerProduto('${produto.id}')" style="background: #ef4444; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                                Remover
                            </button>
                        </div>
                    `).join('')}
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
    document.getElementById('produto-imagem').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Verificar tamanho (máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Arquivo muito grande! Escolha uma imagem menor que 5MB.');
                this.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('imagem-preview');
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 150px; border-radius: 8px; border: 2px solid #8b5cf6;">
                    <div style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">
                        ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)
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
    document.getElementById('produto-imagem').value = '';
    document.getElementById('imagem-preview').innerHTML = '';
}

// Adicionar produto com upload de imagem
async function adicionarProdutoComImagem() {
    const form = document.getElementById('form-produto');
    const formData = new FormData();
    
    // Validar campos obrigatórios
    const nome = document.getElementById('produto-nome').value;
    const descricao = document.getElementById('produto-descricao').value;
    const preco = document.getElementById('produto-preco').value;
    const categoria = document.getElementById('produto-categoria').value;
    
    if (!nome || !descricao || !preco || !categoria) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    // Adicionar dados do formulário
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', preco);
    formData.append('categoria', categoria);
    
    // Adicionar arquivo de imagem se existir
    const imagemInput = document.getElementById('produto-imagem');
    if (imagemInput.files[0]) {
        formData.append('imagem', imagemInput.files[0]);
    }
    
    try {
        const response = await fetch(`${API_URL}/api/produtos`, {
            method: 'POST',
            body: formData
            // Note: Não definir Content-Type - o browser faz automaticamente para FormData
        });
        
        if (response.ok) {
            alert('✅ Produto adicionado com sucesso!');
            form.reset();
            removerImagem(); // Limpa o preview
            fecharModal(document.getElementById('form-produto').closest('div[style*="position: fixed"]'));
            await carregarProdutos(); // Recarrega a lista
            location.reload(); // Recarrega a página para mostrar o novo produto
        } else {
            const error = await response.json();
            throw new Error(error.detail || 'Erro ao adicionar produto');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao adicionar produto: ' + error.message);
    }
}

// Remover produto
async function removerProduto(produtoId) {
    if (!confirm('Tem certeza que deseja remover este produto?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/produtos/${produtoId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✅ Produto removido com sucesso!');
            await carregarProdutos(); // Recarrega a lista
            // Recarrega a página para atualizar o painel e a lista de produtos
            location.reload(); 
        } else {
            throw new Error('Erro ao remover produto');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao remover produto. Verifique o console.');
    }
}

function atualizarUIAdmin() {
    // Adiciona botão do vendedor no header
    const headerActions = document.querySelector('.header-actions');
    if (headerActions && !document.getElementById('admin-btn')) {
        const adminBtn = document.createElement('button');
        adminBtn.id = 'admin-btn';
        adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Vendedor';
        adminBtn.style.background = '#10b981';
        adminBtn.style.color = 'white';
        adminBtn.style.border = 'none';
        adminBtn.style.padding = '0.8rem 1.5rem';
        adminBtn.style.borderRadius = '25px';
        adminBtn.style.cursor = 'pointer';
        adminBtn.style.marginLeft = '1rem';
        adminBtn.onclick = mostrarPainelAdmin;
        
        headerActions.appendChild(adminBtn);
        
        // Remove o botão de login
        const loginBtn = document.querySelector('.admin-btn');
        if (loginBtn) {
            loginBtn.remove();
        }
    }
}

// Adicione CSS para animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);