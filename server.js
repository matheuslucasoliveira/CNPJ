const express = require('express');
const cors = require('cors');
const axios = require('axios');
const moment = require('moment');
const path = require('path');

const app = express();
const port = 3001;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));


function validarCNPJ(cnpj) {
    
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    
    if (cnpj.length !== 14) {
        console.log('CNPJ inválido: não tem 14 dígitos');
        return false;
    }

    
    if (/^(\d)\1+$/.test(cnpj)) {
        console.log('CNPJ inválido: todos os dígitos iguais');
        return false;
    }

    
    let soma = 0;
    let peso = 5;
    for (let i = 0; i < 12; i++) {
        soma += parseInt(cnpj.charAt(i)) * peso;
        peso = peso === 2 ? 9 : peso - 1;
    }
    let digito = 11 - (soma % 11);
    if (digito > 9) digito = 0;
    if (parseInt(cnpj.charAt(12)) !== digito) {
        console.log('CNPJ inválido: primeiro dígito verificador incorreto');
        return false;
    }

    
    soma = 0;
    peso = 6;
    for (let i = 0; i < 13; i++) {
        soma += parseInt(cnpj.charAt(i)) * peso;
        peso = peso === 2 ? 9 : peso - 1;
    }
    digito = 11 - (soma % 11);
    if (digito > 9) digito = 0;
    if (parseInt(cnpj.charAt(13)) !== digito) {
        console.log('CNPJ inválido: segundo dígito verificador incorreto');
        return false;
    }

    return true;
}


const validarCNPJMiddleware = (req, res, next) => {
    console.log('Body recebido:', req.body);
    const { cnpj } = req.body;
    
    if (!cnpj) {
        console.log('CNPJ não fornecido');
        return res.status(400).json({
            error: 'CNPJ não fornecido',
            code: 'MISSING_CNPJ'
        });
    }

    console.log('CNPJ recebido:', cnpj);
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    console.log('CNPJ limpo:', cnpjLimpo);

    if (!validarCNPJ(cnpjLimpo)) {
        return res.status(400).json({
            error: 'CNPJ inválido',
            code: 'INVALID_CNPJ',
            details: 'O CNPJ informado não é válido. Verifique se foi digitado corretamente.'
        });
    }

    
    req.cnpjLimpo = cnpjLimpo;
    next();
};


const errorHandler = (err, req, res, next) => {
    console.error('Erro:', err);

    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Dados inválidos',
            details: err.message,
            code: 'VALIDATION_ERROR'
        });
    }

    
    if (err.code === 'ECONNREFUSED') {
        return res.status(503).json({
            error: 'Serviço temporariamente indisponível',
            code: 'SERVICE_UNAVAILABLE'
        });
    }

    
    res.status(500).json({
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR'
    });
};


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/consultar', validarCNPJMiddleware, async (req, res) => {
    const cnpj = req.cnpjLimpo;
    const startTime = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        
        const random = Math.random();
        
        
        if (random < 0.1) {
            return res.status(404).json({
                error: 'CNPJ não encontrado',
                code: 'CNPJ_NOT_FOUND'
            });
        }

        
        if (random < 0.2) {
            throw new Error('SERVICE_UNAVAILABLE');
        }

        
        if (random < 0.3) {
            return res.status(429).json({
                error: 'Muitas requisições. Tente novamente em alguns segundos.',
                code: 'RATE_LIMIT_EXCEEDED',
                retryAfter: 5
            });
        }

        
        const mockResponse = {
            status: "OK",
            ultima_atualizacao: "2024-03-13",
            cnpj: cnpj,
            tipo: "MATRIZ",
            porte: "MEDIO",
            nome: "Empresa Teste",
            fantasia: "Teste",
            abertura: "2020-01-01",
            atividade_principal: [
                {
                    text: "Desenvolvimento de software",
                    code: "62.01-5-00"
                }
            ],
            atividades_secundarias: [
                {
                    text: "Consultoria em TI",
                    code: "62.03-1-00"
                }
            ],
            natureza_juridica: "213-5 - Empresário Individual",
            logradouro: "Rua Teste",
            numero: "123",
            complemento: "Sala 1",
            bairro: "Centro",
            municipio: "São Paulo",
            uf: "SP",
            cep: "01001-000",
            email: "contato@empresa.com",
            telefone: "(11) 1234-5678",
            situacao: "ATIVA",
            data_situacao: "2024-01-01",
            capital_social: "100000.00",
            quadro_socios: [
                {
                    nome: "João Silva",
                    qual: "Sócio-Administrador",
                    pais_origem: "Brasil",
                    nome_rep_legal: "",
                    qual_rep_legal: ""
                }
            ],
            qsa: [],
            extra: {
                data_consulta: moment().format('YYYY-MM-DD HH:mm:ss'),
                tempo_resposta: "0.5s"
            }
        };

        const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const duration = moment.duration(moment(endTime).diff(moment(startTime))).asSeconds();

        // Adicionar metadados da consulta
        const response = {
            ...mockResponse,
            metadata: {
                start_time: startTime,
                end_time: endTime,
                duration: `${duration.toFixed(2)}s`,
                billing: {
                    credits: 1,
                    cost: 0.05
                }
            }
        };

        res.status(200).json(response);
    } catch (error) {
       
        if (error.message === 'SERVICE_UNAVAILABLE') {
            res.status(503).json({
                error: 'Serviço temporariamente indisponível',
                code: 'SERVICE_UNAVAILABLE'
            });
        } else {
            throw error;
        }
    }
});


app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    });
});


app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        code: 'ROUTE_NOT_FOUND'
    });
});

app.use(errorHandler);


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
}); 