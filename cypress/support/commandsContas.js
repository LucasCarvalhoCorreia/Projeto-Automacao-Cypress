import loc from './locators'

Cypress.Commands.add('acessarMenuConta', () => {
    cy.get(loc.Menu.Settings).click()
    cy.get(loc.Menu.Contas).click()
})

Cypress.Commands.add('inserirConta', conta => {
    cy.get(loc.Contas.Nome).type('Conta de teste')
    cy.get(loc.Contas.Botao_Salvar).click()
})
        
