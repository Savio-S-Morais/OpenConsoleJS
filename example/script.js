// EN: No error.
// PT-BR: Sem erro.
OpenConsole.evaluate(() => {
    let numero1 = 10;
    let numero2 = 5;

    function somar(a, b) {
        return a + b;
    };

    let resultado = somar(numero1, numero2);
    console.log("Resultado:", resultado);
});

console.log('==============');

// EN: Runtime errors.
// PT-BR: Erros de execução.
OpenConsole.evaluate(() => {
    let numero1 = 10;
    let numero2 = 5;

    function somar(a, b) {
        return a + b;
    }

    let resultado = somar(numero1, numero2);
    console.log("Resultado:", usuario.nome);
});

console.log('==============');

// EN: Type errors.
// PT-BR: Erros de tipo.
OpenConsole.evaluate(() => {
    let numero1 = 10;
    let numero2 = 5;

    function somar(a, b) {
        return a + b;
    }

    let resultado = somar(numero1, numero2);
    console.log("Resultado:",  resultado.toUpperCase());
});

console.log('==============');

// EN: Syntax errors.
// PT-BR: Erros de sintaxe.
OpenConsole.evaluate(`
    let numero1 = 10;
    let numero2 = 5;

    function somar(a, b) {
        return a + b;
    }

    let resultado = somar(numero1, numero2
    console.log("Resultado:", resultado);
`);