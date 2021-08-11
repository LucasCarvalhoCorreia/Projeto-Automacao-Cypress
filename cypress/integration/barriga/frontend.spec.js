/// <reference types="cypress" />

import loc from '../../support/locators'
import '../../support/commandsContas'
import buildEnv from '../../support/buildEnv'

describe('Should test at a functional level', () => {
    after(() => {
        cy.clearLocalStorage()
    })

    beforeEach(() => {
        buildEnv()
        cy.login('lucas.carvalho@gmail.com', '1')
        cy.get(loc.Menu.Home).click()
        cy.resetApp()
    })

    it('Should create an account', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response: [
                { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1},
            ]
        }).as('SaveConta')

        cy.acessarMenuConta()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                { id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
                { id: 2, nome: 'Banco', visivel: true, usuario_id: 1},
                { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1},
            ]
        }).as('contasSave')

        cy.inserirConta('Conta de teste')
        cy.get(loc.Menssagem_Sucesso).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an account', () => {
        cy.route({
            method: 'PUT',
            url: '/contas/**',
            response: { id: 1, nome: 'Conta alterada', visivel: true, usuario_id: 1},
        })

        cy.acessarMenuConta()

        cy.xpath(loc.Contas.Funcao_Botao_Alterar('Banco')).click()
        cy.get(loc.Contas.Nome).clear().type('Conta alterada')
        cy.get(loc.Contas.Botao_Salvar).click()
        cy.get(loc.Menssagem_Sucesso).should('contain', 'Conta atualizada com sucesso')
    })

    it('Should not create an account with same name', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { "error": "Já existe uma conta com esse nome!"},
            status: 400
        }).as('SaveContaMesmoNome')
        
        cy.acessarMenuConta()

        cy.get(loc.Contas.Nome).clear().type('Conta mesmo nome')
        cy.get(loc.Contas.Botao_Salvar).click()
        cy.get(loc.Mensagem_Popup).should('contain', 'code 400')
    })

    it('Should create a transaction', () => {
        cy.route({
            method: 'POST',
            url: '/transacoes',
            response: { "id":31433,"descricao":"asdfg","envolvido":"FFF","observacao":null,"tipo":"DESP","data_transacao":"2019-11-13T03:00:00.000Z","valor":"123.00","status":true,"conta_id":42077,"usuario_id":1,"transferencia_id":null,"parcelamento_id":null},
        })

        cy.get(loc.Menu.Movimentacao).click()

        cy.get(loc.Movimentacao.Descricao).type('Desc')
        cy.get(loc.Movimentacao.Valor).type('123')
        cy.get(loc.Movimentacao.Interessado).type('Inter')
        cy.get(loc.Movimentacao.Conta).select('Banco')
        cy.get(loc.Movimentacao.Status).click()
        cy.get(loc.Movimentacao.Botao_Salvar).click()
        cy.get(loc.Mensagem_Popup).should('contain', 'sucesso')

        cy.get(loc.Extrato.Linhas).should('have.length', 7)
        cy.xpath(loc.Extrato.Funcao_Expath_BuscaElemento('Desc', '123')).should('exist')
    })

    it('Should get balance', () => {
        cy.route({
            method: 'GET',
            url: '/transacoes/**',
            response: {
                "conta":"Conta para saldo",
                "id":31436,
                "descricao":"Movimentacao 1, calculo saldo",
                "envolvido":"CCC",
                "observacao":null,
                "tipo":"REC",
                "data_transacao":"2019-11-13T03:00:00.000Z",
                "valor":"3500.00",
                "status":false,
                "conta_id":42079,
                "usuario_id":1,
                "transferencia_id":null,
                "parcelamento_id":null},
        })

        cy.route({
            method: 'PUT',
            url: '/transacoes/**',
            response: {
                "conta":"Conta para saldo",
                "id":31436,
                "descricao":"Movimentacao 1, calculo saldo",
                "envolvido":"CCC",
                "observacao":null,
                "tipo":"REC",
                "data_transacao":"2019-11-13T03:00:00.000Z",
                "valor":"3500.00",
                "status":false,
                "conta_id":42079,
                "usuario_id":1,
                "transferencia_id":null,
                "parcelamento_id":null},
        })

        cy.get(loc.Menu.Home).click()
        cy.xpath(loc.Saldo.Funcao_Expath_SaldoConta('Carteira')).should('contain', '100,00')
        
        cy.get(loc.Menu.Extrato).click()
        cy.xpath(loc.Extrato.Funcao_Expath_AlterarElemento('Movimentacao 1, calculo saldo')).click()
       
        cy.get(loc.Movimentacao.Descricao).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(loc.Movimentacao.Status).click()
        cy.get(loc.Movimentacao.Botao_Salvar).click()
        cy.get(loc.Mensagem_Popup).should('contain', 'sucesso')

        cy.route({
            method: 'GET',
            url: '/saldo',
            response: [{
                "conta_id":999,
                "conta":"Carteira",
                "saldo":"4034.00"
            },
            {
                "conta_id":9909,
                "conta":"Banco",
                "saldo":"10000000.00"
            }
            ]
        }).as('saldoFinal')

        cy.get(loc.Menu.Home).click()
        cy.xpath(loc.Saldo.Funcao_Expath_SaldoConta('Carteira')).should('contain', '4.034,00')
    })

    it('Should remove a transaction', () => {
        cy.route({
            method: 'DELETE',
            url: '/transacoes/**',
            response: {},
            status: 204 
        }).as('del')

        cy.get(loc.Menu.Extrato).click()
        cy.xpath(loc.Extrato.Funcao_Expath_RemoverElemento('Movimentacao para exclusao')).click()
        cy.get(loc.Mensagem_Popup).should('contain', 'sucesso')
    })

    it('Should validate data send to create an account', () => {
        const reqStub = cy.stub()
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1},
            // onRequest: req => {
            //     console.log(req)
            //     expect(req.onRequest.body.nome).to.be.not.null
            //     expect(req.request.headers).to.have.property('Authorization')
            // }
            onRequest: reqStub
        }).as('SaveConta')

        cy.acessarMenuConta()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                { id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
                { id: 2, nome: 'Banco', visivel: true, usuario_id: 1},
                { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1},
            ]
        }).as('contasSave')

        cy.inserirConta('{CONTROL}')
        // cy.wait('@SaveConta').its('request.body.nome').should('not.be.empty')
        cy.wait('@SaveConta').then(() => {
            console.log(reqStub.args[0][0])
            expect(reqStub.args[0][0].request.body.nome).to.be.not.null
                expect(reqStub.args[0][0].request.headers).to.have.property('Authorization')
        })
        cy.get(loc.Menssagem_Sucesso).should('contain', 'Conta inserida com sucesso')
    })

    it('Should test colors', () => {
        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: [
                {"conta":"Conta para saldo","id":679542,"descricao":"Receita paga","envolvido":"BBB","observacao":null,"tipo":"REC","data_transacao":"2021-08-09T03:00:00.000Z","data_pagamento":"2021-08-09T03:00:00.000Z","valor":"-1500.00","status":true,"conta_id":732478,"usuario_id":23977,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para saldo","id":679543,"descricao":"Receita pendente","envolvido":"CCC","observacao":null,"tipo":"REC","data_transacao":"2021-08-09T03:00:00.000Z","data_pagamento":"2021-08-09T03:00:00.000Z","valor":"-1500.00","status":false,"conta_id":732479,"usuario_id":23977,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para extrato","id":679544,"descricao":"Despesa paga","envolvido":"DDD","observacao":null,"tipo":"DESP","data_transacao":"2021-08-09T03:00:00.000Z","data_pagamento":"2021-08-09T03:00:00.000Z","valor":"3500.00","status":true,"conta_id":732479,"usuario_id":23977,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para movimentacoes","id":679545,"descricao":"Despesa pendente","envolvido":"EEE","observacao":null,"tipo":"DESP","data_transacao":"2021-08-09T03:00:00.000Z","data_pagamento":"2021-08-09T03:00:00.000Z","valor":"-1000.00","status":false,"conta_id":732479,"usuario_id":23977,"transferencia_id":null,"parcelamento_id":null},
            ]
        })

        cy.get(loc.Menu.Extrato).click()
        cy.xpath(loc.Extrato.Funcao_Expath_Linha('receitaPaga')).should('have.class', 'receitaPaga')
        cy.xpath(loc.Extrato.Funcao_Expath_Linha('receitaPendente')).should('have.class', 'receitaPendente')
        cy.xpath(loc.Extrato.Funcao_Expath_Linha('despesaPaga')).should('have.class', 'despesaPaga')
        cy.xpath(loc.Extrato.Funcao_Expath_Linha('despesaPendente')).should('have.class', 'despesaPendente')
    })

    it('Shoul test the responsiveness', () => {
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')
        cy.viewport(500, 700)
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.not.visible')
        cy.viewport('iphone-5')
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.not.visible')
        cy.viewport('ipad-2')
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')
    })
})