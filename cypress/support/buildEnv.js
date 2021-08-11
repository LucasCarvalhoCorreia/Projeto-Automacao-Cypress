const buildEnv = () => {
    cy.server()
        cy.route({
            method: 'POST',
            url: '/signin',
            response: {
                id: 1000,
                nome: 'Usuario falso',
                token: 'string do token'
            }
        }).as('signin')

        cy.route({
            method: 'GET',
            url: '/saldo',
            response: [{
                "conta_id":999,
                "conta":"Carteira",
                "saldo":"100.00"
            },
            {
                "conta_id":9909,
                "conta":"Banco",
                "saldo":"10000000.00"
            }
            ]
        }).as('saldo')

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                { id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
                { id: 2, nome: 'Banco', visivel: true, usuario_id: 1},
            ]
        }).as('contas')

        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: [
                {"conta":"Conta com movimentacao","id":679542,"descricao":"Movimentacao de conta","envolvido":"BBB","observacao":null,"tipo":"DESP","data_transacao":"2021-08-09T03:00:00.000Z","data_pagamento":"2021-08-09T03:00:00.000Z","valor":"-1500.00","status":true,"conta_id":732478,"usuario_id":23977,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para saldo","id":679543,"descricao":"Movimentacao 1, calculo saldo","envolvido":"CCC","observacao":null,"tipo":"REC","data_transacao":"2021-08-09T03:00:00.000Z","data_pagamento":"2021-08-09T03:00:00.000Z","valor":"3500.00","status":false,"conta_id":732479,"usuario_id":23977,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para saldo","id":679544,"descricao":"Movimentacao 2, calculo saldo","envolvido":"DDD","observacao":null,"tipo":"DESP","data_transacao":"2021-08-09T03:00:00.000Z","data_pagamento":"2021-08-09T03:00:00.000Z","valor":"-1000.00","status":true,"conta_id":732479,"usuario_id":23977,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para saldo","id":679545,"descricao":"Movimentacao 3, calculo saldo","envolvido":"EEE","observacao":null,"tipo":"REC","data_transacao":"2021-08-09T03:00:00.000Z","data_pagamento":"2021-08-09T03:00:00.000Z","valor":"1534.00","status":true,"conta_id":732479,"usuario_id":23977,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para extrato","id":679546,"descricao":"Movimentacao para extrato","envolvido":"FFF","observacao":null,"tipo":"DESP","data_transacao":"2021-08-09T03:00:00.000Z","data_pagamento":"2021-08-09T03:00:00.000Z","valor":"-220.00","status":true,"conta_id":732480,"usuario_id":23977,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para extrato","id":31439,"descricao":"Movimentacao para exclusao","envolvido":"FFF","observacao":null,"tipo":"DESP","data_transacao":"2019-11-13T03:00:00.000Z","valor":"-1500.00","status":true,"conta_id":42077,"usuario_id":1,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para extrato","id":31433,"descricao":"Desc","envolvido":"FFF","observacao":null,"tipo":"DESP","data_transacao":"2019-11-13T03:00:00.000Z","valor":"123.00","status":true,"conta_id":42077,"usuario_id":1,"transferencia_id":null,"parcelamento_id":null}
        ]
        })
}

export default buildEnv