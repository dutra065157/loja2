const express = require('express');
const router = express.Router();
const Pedido = require('../models/pedidoModel'); // Importa o modelo do pedido

// Rota para criar um novo pedido (POST /api/pedidos)
router.post('/', async (req, res) => {
    try {
        // Os dados do pedido vêm do corpo da requisição (req.body)
        const novoPedido = new Pedido(req.body);

        // Salva o pedido no banco de dados
        const pedidoSalvo = await novoPedido.save();

        // Retorna o pedido salvo com o status 201 (Criado)
        res.status(201).json(pedidoSalvo);
    } catch (error) {
        res.status(400).json({ detail: 'Erro ao criar o pedido: ' + error.message });
    }
});

module.exports = router;