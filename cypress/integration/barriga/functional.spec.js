/// <reference types="cypress" />

import loc from '../../support/locators'
import '../../support/commandsContas'

describe('Shoul test at a functional level', () => {
    before(() => {
        cy.login('lucas.carvalho@gmail.com', '123')
        cy.resetApp()
    })

    beforeEach(() => {
        cy.get(loc.Menu.Home).click()
        cy.resetApp()
    })

    it('Should create an account', () => {
        cy.acessarMenuConta()
        cy.inserirConta()
        cy.get(loc.Menssagem_Sucesso).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an account', () => {
        cy.acessarMenuConta()

        cy.xpath(loc.Contas.Funcao_Botao_Alterar('Conta para alterar')).click()
        cy.get(loc.Contas.Nome).clear().type('Conta alterada')
        cy.get(loc.Contas.Botao_Salvar).click()
        cy.get(loc.Menssagem_Sucesso).should('contain', 'Conta atualizada com sucesso')
    })

    it('Should not create an account with same name', () => {
        cy.acessarMenuConta()

        cy.get(loc.Contas.Nome).clear().type('Conta mesmo nome')
        cy.get(loc.Contas.Botao_Salvar).click()
        cy.get(loc.Mensagem_Popup).should('contain', 'code 400')
    })

    it('Should create a transaction', () => {
        cy.get(loc.Menu.Movimentacao).click()
        cy.get(loc.Movimentacao.Descricao).type('Desc')
        cy.get(loc.Movimentacao.Valor).type('123')
        cy.get(loc.Movimentacao.Interessado).type('Inter')
        cy.get(loc.Movimentacao.Conta).select('Conta para movimentacoes')
        cy.get(loc.Movimentacao.Status).click()
        cy.get(loc.Movimentacao.Botao_Salvar).click()
        cy.get(loc.Mensagem_Popup).should('contain', 'sucesso')

        cy.get(loc.Extrato.Linhas).should('have.length', 7)
        cy.xpath(loc.Extrato.Funcao_Expath_BuscaElemento('Desc', '123')).should('exist')
    })

    it('Should get balance', () => {
        cy.get(loc.Menu.Home).click()
        cy.xpath(loc.Saldo.Funcao_Expath_SaldoConta('Conta para saldo')).should('contain', '534,00')
        
        cy.get(loc.Menu.Extrato).click()
        cy.xpath(loc.Extrato.Funcao_Expath_AlterarElemento('Movimentacao 1, calculo saldo')).click()
       
        cy.get(loc.Movimentacao.Descricao).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(loc.Movimentacao.Status).click()
        cy.get(loc.Movimentacao.Botao_Salvar).click()
        cy.get(loc.Mensagem_Popup).should('contain', 'sucesso')

        cy.get(loc.Menu.Home).click()
        cy.xpath(loc.Saldo.Funcao_Expath_SaldoConta('Conta para saldo')).should('contain', '534,00')
    })

    it('Should remove a transaction', () => {
        cy.get(loc.Menu.Extrato).click()
        cy.xpath(loc.Extrato.Funcao_Expath_RemoverElemento('Movimentacao para exclusao')).click()
        cy.get(loc.Mensagem_Popup).should('contain', 'sucesso')
    })
})