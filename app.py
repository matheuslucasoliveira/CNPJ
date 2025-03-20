from flask import Flask, render_template, request, jsonify
import requests
import re
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/consultar', methods=['POST'])
def consultar_cnpj():
    cnpj = request.form.get('cnpj', '').strip()
    
    # Remove caracteres não numéricos para a consulta
    cnpj_limpo = re.sub(r'[^0-9]', '', cnpj)
    
    try:
        # Faz a consulta na API com parâmetros adicionais
        url = f'https://receitaws.com.br/v1/cnpj/{cnpj_limpo}'
        headers = {
            'Accept': 'application/json'
        }
        params = {
            'days': '0',  # Dados mais recentes
            'fallback': 'cacheOnError'  # Usa cache em caso de erro
        }
        
        # Registra o horário de início da consulta
        start_time = datetime.now().isoformat()
        
        response = requests.get(url, headers=headers, params=params)
        
        # Registra o horário de fim da consulta
        end_time = datetime.now().isoformat()
        
        if response.status_code == 429:
            return jsonify({
                'error': True,
                'message': 'Limite de consultas excedido. Por favor, aguarde um momento e tente novamente.'
            })
        
        if response.status_code == 504:
            return jsonify({
                'error': True,
                'message': 'O servidor demorou muito para responder. Por favor, tente novamente.'
            })
        
        if response.status_code == 402:
            return jsonify({
                'error': True,
                'message': 'Limite de consultas da API excedido.'
            })
        
        data = response.json()
        
        if 'error' in data:
            return jsonify({
                'error': True,
                'message': data.get('message', 'Erro ao consultar CNPJ')
            })
        
        # Formata os dados para melhor apresentação
        formatted_data = {
            'informacoes_basicas': {
                'cnpj': data.get('cnpj', ''),
                'tipo': data.get('tipo', ''),
                'porte': data.get('porte', ''),
                'nome': data.get('nome', ''),
                'fantasia': data.get('fantasia', ''),
                'abertura': data.get('abertura', ''),
                'natureza_juridica': data.get('natureza_juridica', ''),
                'ultima_atualizacao': data.get('ultima_atualizacao', '')
            },
            'atividades': {
                'principal': data.get('atividade_principal', []),
                'secundarias': data.get('atividades_secundarias', [])
            },
            'endereco': {
                'logradouro': data.get('logradouro', ''),
                'numero': data.get('numero', ''),
                'complemento': data.get('complemento', ''),
                'cep': data.get('cep', ''),
                'bairro': data.get('bairro', ''),
                'municipio': data.get('municipio', ''),
                'uf': data.get('uf', '')
            },
            'contato': {
                'email': data.get('email', ''),
                'telefone': data.get('telefone', '')
            },
            'situacao': {
                'atual': data.get('situacao', ''),
                'data': data.get('data_situacao', ''),
                'motivo': data.get('motivo_situacao', ''),
                'especial': data.get('situacao_especial', ''),
                'data_especial': data.get('data_situacao_especial', '')
            },
            'financeiro': {
                'capital_social': data.get('capital_social', '')
            },
            'socios': data.get('qsa', []),
            'regimes_especiais': {
                'simples': data.get('simples', {}),
                'mei': data.get('simei', {})
            }
        }
        
        # Adiciona metadados da consulta
        metadata = {
            'status': 'OK',
            'consulta': {
                'inicio': start_time,
                'fim': end_time,
                'cnpj': cnpj_limpo
            },
            'billing': data.get('billing', {})
        }
        
        return jsonify({
            'error': False,
            'data': formatted_data,
            'metadata': metadata
        })
        
    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': True,
            'message': 'Erro ao conectar com o serviço. Por favor, tente novamente.'
        })

if __name__ == '__main__':
    app.run(debug=True) 