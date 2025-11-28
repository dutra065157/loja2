const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Produto = require('../models/produtoModel'); // Importa o modelo

// --- Configuração do Multer para Upload de Imagens ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '..', 'images'); // Aponta para a pasta 'images' na raiz
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- Rotas da API ---

// Rota para buscar todos os produtos
// GET /api/produtos
router.get('/', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.status(200).json(produtos);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ detail: 'Erro interno no servidor ao buscar produtos.' });
    }
});

// Rota para adicionar um novo produto
// POST /api/produtos
router.post('/', upload.single('imagem'), async (req, res) => {
    try {
        const dadosProduto = {
            nome: req.body.nome,
            descricao: req.body.descricao,
            preco: parseFloat(req.body.preco),
            categoria: req.body.categoria,
            imagem: req.file ? `/images/${req.file.filename}` : ''
        };

        const novoProduto = new Produto(dadosProduto);
        await novoProduto.save();

        console.log('Produto adicionado com sucesso:', novoProduto);
        res.status(201).json(novoProduto);

    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).json({ detail: 'Erro interno no servidor ao adicionar produto.' });
    }
});

// Rota para remover um produto
// DELETE /api/produtos/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const produtoRemovido = await Produto.findByIdAndDelete(id);

        if (!produtoRemovido) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.status(200).json({ message: 'Produto removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover produto:', error);
        res.status(500).json({ detail: 'Erro interno no servidor ao remover produto.' });
    }
});

module.exports = router;