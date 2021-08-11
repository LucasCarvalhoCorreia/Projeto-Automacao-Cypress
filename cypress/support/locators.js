const locators = {
    Login: {
        User: '[data-test=email]',
        Password: '[data-test=passwd]',
        Botao_Login: '.btn',
        Menssagem_Bemvindo: '.toast'
    },

    Menu: {
        Settings: '[data-test=menu-settings]',
        Contas: '[href="/contas"]',
        Reset: '[href="/reset"]',
        Movimentacao: '[data-test=menu-movimentacao]',
        Home: '[data-test=menu-home]',
        Extrato: '[data-test=menu-extrato]'
    },

    Contas: {
        Nome: '[data-test=nome]',
        Botao_Salvar: '.btn',
        Funcao_Botao_Alterar: nome => `//table//td[contains(., '${nome}')]/..//i[@class='far fa-edit']`,
    },
    
    Movimentacao: {
        Descricao: '[data-test=descricao]',
        Valor: '[data-test=valor]',
        Interessado: '[data-test=envolvido]',
        Status: '[data-test=status]',
        Botao_Salvar: '.btn-primary',
        Conta: '[data-test=conta]'
    },

    Extrato: {
        Linhas: '.list-group > li',
        Funcao_Expath_BuscaElemento: (desc, value) => `//span[contains(., '${desc}')]/following-sibling::small[contains(., '${value}')]`,
        Funcao_Expath_RemoverElemento: conta => `//span[contains(., '${conta}')]/../../..//i[@class='far fa-trash-alt']`,
        Funcao_Expath_AlterarElemento: conta => `//span[contains(., '${conta}')]/../../..//i[@class='fas fa-edit']`,
        Funcao_Expath_Linha: desc => `//*[@class='list-group-item list-group-item-action flex-column align-items-start ${desc}']`
    },

    Saldo: {
        Funcao_Expath_SaldoConta: nome => `//td[contains(., '${nome}')]/../td[2]`
    },

    Menssagem_Sucesso: '.toast-success > .toast-message',
    Menssagem_Falha: '.toast-error > .toast-message',
    Mensagem_Popup: '.toast-message'
}

export default locators;