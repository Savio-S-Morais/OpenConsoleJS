// EN: No error.
// PT-BR: Sem erro.
OpenConsole.evaluate(() => {
    let number1 = 10;
    let number2 = 5;

    function sum(a, b) {
        return a + b;
    };

    let result = sum(number1, number2);
    console.log("Result:", result);
});

console.log('==============');

// EN: Runtime errors.
// PT-BR: Erros de execução.
OpenConsole.evaluate(() => {
    let number1 = 10;
    let number2 = 5;

    function sum(a, b) {
        return a + b;
    }

    let result = sum(number1, number2);
    console.log("Result:", user.name);
});

console.log('==============');

// EN: Type errors.
// PT-BR: Erros de tipo.
OpenConsole.evaluate(() => {
    let number1 = 10;
    let number2 = 5;

    function sum(a, b) {
        return a + b;
    }

    let result = sum(number1, number2);
    console.log("Result:",  result.toUpperCase());
});

console.log('==============');

// EN: Syntax errors.
// PT-BR: Erros de sintaxe.
OpenConsole.evaluate(`
    let number1 = 10;
    let number2 = 5;

    function sum(a, b) {
        return a + b;
    }

    let result = sum(number1, number2
    console.log("Result:", result);
`);