// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import loc from './locators'

Cypress.Commands.add('clickAlert', (locator, message) => {
        cy.get(locator).click()
        cy.on('windows:alert', msg => {
            expect(msg).to.be.equal(message)
        })
})

Cypress.Commands.add('login', (user, password) => {
    cy.visit('https://barrigareact.wcaquino.me/')
    cy.get(loc.Login.User).type(user)
    cy.get(loc.Login.Password).type(password)
    cy.get(loc.Login.Botao_Login).click()
    cy.get(loc.Login.Menssagem_Bemvindo).should('contain', 'Bem vindo')
})

Cypress.Commands.add('resetApp', () => {
    cy.get(loc.Menu.Settings).click()
    cy.get(loc.Menu.Reset).click()
})

Cypress.Commands.add('getToken', (user, password) => {
    cy.request({
        method: 'POST',
        url: '/signin',
        body: {
            email: user,
            redirecionar: false,
            senha: password
        }
    }).its('body.token').should('not.be.empty')
        .then(token => {
            return token
        })
})

Cypress.Commands.add('resetRest', () => {
    cy.getToken('lucas.carvalho@gmail.com', '123').then(token => {
        cy.request({
            method: 'GET',
            url: '/reset',
            headers: { Authorization: `JWT ${token}`}
        }).its('status').should('be.equal', 200)
    })
})