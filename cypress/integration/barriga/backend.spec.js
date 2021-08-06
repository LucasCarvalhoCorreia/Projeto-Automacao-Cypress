/// <reference types="cypress" />

describe('Shoul test at a functional level', () => {
    let token

    before(() => {
        cy.getToken('lucas.carvalho@gmail.com', '123')
            .then(tkn => {
                token = tkn
            })
    })

    beforeEach(() => {
        cy.resetRest()
    })

    it('Should create an account', () => {
        cy.request({
            url: '/contas',
            method: 'POST',
            headers: { Authorization: `JWT ${token}`},
            body: {
                nome: 'Conta via rest'
            }
        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'Conta via rest')
        })
    })

    it('Should update an account', () => {
        
    })

    it('Should not create an account with same name', () => {
        
    })

    it('Should create a transaction', () => {
        
    })

    it('Should get balance', () => {
       
    })

    it('Should remove a transaction', () => {
        
    })
})