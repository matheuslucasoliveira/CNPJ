const express = require('express');
const app = express();
const port = 3001;

// Configuração do Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Função para formatar CNPJ
const formatCNPJ = (cnpj) => {
    return cnpj.replace(/\D/g, '');
};

// Rota para consulta de CNPJ
app.post('/consultar', async (req, res) => {
    const startTime = new Date();
    const cnpj = formatCNPJ(req.body.cnpj);

    try {
        // Simular resposta da API para teste
        const mockResponse = {
            status: "OK",
            message: "Consulta realizada com sucesso",
            billing: {
                free: true,
                database: "comercial"
            },
            data: {
                cnpj: cnpj,
                razao_social: "EMPRESA TESTE LTDA",
                nome_fantasia: "TESTE COMPANY",
                tipo: "MATRIZ",
                porte: "DEMAIS",
                natureza_juridica: "206-2 - Sociedade Empresária Limitada",
                abertura: "2010-03-02",
                capital_social: 100000,
                logradouro: "RUA TESTE",
                numero: "123",
                complemento: "SALA 1",
                bairro: "CENTRO",
                municipio: "SAO PAULO",
                uf: "SP",
                cep: "01234-567",
                telefone: "(11) 1234-5678",
                email: "contato@teste.com",
                atividade_principal: {
                    code: "62.01-5-01",
                    text: "Desenvolvimento de programas de computador sob encomenda"
                },
                atividades_secundarias: [
                    {
                        code: "62.02-3-00",
                        text: "Desenvolvimento e licenciamento de programas de computador customizáveis"
                    }
                ],
                situacao: "ATIVA",
                data_situacao: "2010-03-02",
                motivo_situacao: "",
                situacao_especial: "",
                data_situacao_especial: "",
                qsa: [
                    {
                        nome: "JOAO DA SILVA",
                        qualificacao: "Sócio-Administrador",
                        pais_origem: "Brasil"
                    }
                ],
                optante_simples: true,
                data_opcao_simples: "2010-03-02",
                data_exclusao_simples: null,
                optante_mei: false
            }
        };

        const data = mockResponse;
        const endTime = new Date();

        // Formatação dos dados
        const formattedData = {
            metadata: {
                start_time: startTime.toLocaleString(),
                end_time: endTime.toLocaleString(),
                duration: (endTime - startTime) / 1000,
                status: data.status,
                message: data.message,
                billing: data.billing
            },
            company: {
                basic: {
                    cnpj: data.data.cnpj,
                    razao_social: data.data.razao_social,
                    nome_fantasia: data.data.nome_fantasia,
                    tipo: data.data.tipo,
                    porte: data.data.porte,
                    natureza_juridica: data.data.natureza_juridica,
                    abertura: data.data.abertura,
                    capital_social: data.data.capital_social
                },
                address: {
                    logradouro: data.data.logradouro,
                    numero: data.data.numero,
                    complemento: data.data.complemento,
                    bairro: data.data.bairro,
                    municipio: data.data.municipio,
                    uf: data.data.uf,
                    cep: data.data.cep
                },
                contact: {
                    telefone: data.data.telefone,
                    email: data.data.email
                },
                activities: {
                    primary: data.data.atividade_principal,
                    secondary: data.data.atividades_secundarias
                },
                situation: {
                    status: data.data.situacao,
                    data_situacao: data.data.data_situacao,
                    motivo_situacao: data.data.motivo_situacao,
                    situacao_especial: data.data.situacao_especial,
                    data_situacao_especial: data.data.data_situacao_especial
                },
                partners: data.data.qsa,
                special_regimes: {
                    simples: {
                        optante_simples: data.data.optante_simples,
                        data_opcao_simples: data.data.data_opcao_simples,
                        data_exclusao_simples: data.data.data_exclusao_simples
                    },
                    mei: {
                        optante_mei: data.data.optante_mei
                    }
                }
            }
        };

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Erro ao consultar CNPJ'
        });
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
}); 