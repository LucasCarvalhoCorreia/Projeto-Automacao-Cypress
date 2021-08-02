/// <reference types="cypress" />

import loc from '../../support/locators'

describe('Shoul test at a functional level', () => {
    before(() => {
        cy.login('lucas.carvalho@gmail.com', '123')
        cy.resetApp()
    })

    it('Should create an account', () => {
        cy.get(loc.Menu.Settings).click()
        cy.get(loc.Menu.Contas).click()
        cy.get(loc.Contas.Nome).type('Conta de teste')
        cy.get(loc.Contas.Botao_Salvar).click()
        cy.get(loc.Menssagem_Sucesso).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an account', () => {
        cy.get(loc.Menu.Settings).click()
        cy.get(loc.Menu.Contas).click()
        cy.xpath(loc.Contas.Botao_Alterar).click()
        cy.get(loc.Contas.Nome).clear().type('Conta alterada')
        cy.get(loc.Contas.Botao_Salvar).click()
        cy.get(loc.Menssagem_Sucesso).should('contain', 'Conta atualizada com sucesso')
    })
})