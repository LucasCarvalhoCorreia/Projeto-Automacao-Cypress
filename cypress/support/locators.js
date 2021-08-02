const locators = {
    Login: {
        User: '[data-test=email]',
        Password: '[data-test=passwd]',
        Botao_Login: '.btn',
        Menssagem: '.toast'
    },

    Menu: {
        Settings: '[data-test=menu-settings]',
        Contas: '[href="/contas"]',
        Reset: '[href="/reset"]'
    },

    Contas: {
        Nome: '[data-test=nome]',
        Botao_Salvar: '.btn',
        Botao_Alterar: "//table//td[contains(., 'Conta de teste')]/..//i[@class='far fa-edit']",
    },

    Menssagem_Sucesso: '.toast-success > .toast-message'
}

export default locators;