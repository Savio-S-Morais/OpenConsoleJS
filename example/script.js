// Sem erro
debug.run(() => {
    let numero1 = 10;
    let numero2 = 5;

    function somar(a, b) {
        return a + b;
    };

    let resultado = somar(numero1, numero2);
    console.log("Resultado:", resultado);
});

console.log('==============');

// Erros de execução
debug.run(() => {
    let numero1 = 10;
    let numero2 = 5;

    function somar(a, b) {
        return a + b;
    }

    let resultado = somar(numero1, numero2);
    console.log("Resultado:", usuario.nome);
});

console.log('==============');

// Erros de tipo
debug.run(() => {
    let numero1 = 10;
    let numero2 = 5;

    function somar(a, b) {
        return a + b;
    }

    let resultado = somar(numero1, numero2);
    console.log("Resultado:",  resultado.toUpperCase());
});

console.log('==============');

// Erros de sintaxe
debug.run(`
    let numero1 = 10;
    let numero2 = 5;

    function somar(a, b) {
        return a + b;
    }

    let resultado = somar(numero1, numero2
    console.log("Resultado:", resultado);
`);