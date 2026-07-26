# OpenConsoleJS

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Version](https://img.shields.io/badge/version-v0.1.0-blue.svg)
![Status](https://img.shields.io/badge/status-Em%20Desenvolvimento-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)

> Um console de depuração em JavaScript para ambientes onde as DevTools do navegador não estão disponíveis.

O **OpenConsoleJS** é uma biblioteca escrita em **JavaScript puro (Vanilla JS)** que adiciona um painel de console diretamente à página, permitindo visualizar mensagens, erros de execução e testar pequenos trechos de código sem depender das DevTools do navegador.

O projeto nasceu com foco educacional, mas pode ser utilizado em qualquer ambiente onde o acesso às ferramentas nativas de desenvolvimento seja limitado.
## ⭐ Destaques

- Sem dependências externas
- JavaScript puro (Vanilla JS)
- Funciona em arquivos `file://`
- API simples
- Console embutido na página
- Foco educacional


## 📑 Índice

- [📖 Contexto](#-contexto)
- [💡 Motivação](#-motivação)
- [💙 Por que este projeto existe?](#-por-que-este-projeto-existe)
- [🎯 Objetivo](#-objetivo)
- [✨ Funcionalidades atuais](#-funcionalidades-atuais)
- [⚠️ Limitações atuais](#️-limitações-atuais)
- [🚀 Instalação](#-instalação)
- [▶️ Como utilizar](#️-como-utilizar)
- [📚 API pública](#-api-pública)
- [📁 Estrutura do projeto](#-estrutura-do-projeto)
- [🧩 Arquitetura](#-arquitetura)
- [🗺️ Roadmap](#️-roadmap)
- [🚧 Estado do projeto](#-estado-do-projeto)
- [🤝 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)

---

## 📖 Contexto

Em muitas escolas públicas brasileiras, os alunos utilizam Chromebooks gerenciados pela **SEDUC**, onde diversas funcionalidades do navegador são bloqueadas por políticas administrativas.

Entre essas restrições estão:

- acesso às DevTools (Inspecionar Elemento);
- Console JavaScript;
- painel de erros;
- breakpoints;
- instalação de ferramentas como Node.js, Git e editores locais.

Como alternativa, os alunos desenvolvem seus projetos utilizando o **VS Code Web (`vscode.dev`)**, abrindo arquivos locais através do protocolo `file://`.

Embora essa abordagem permita escrever código normalmente, ela elimina uma das ferramentas mais importantes durante o aprendizado de programação: **o Console do navegador**.

O OpenConsoleJS surgiu para minimizar esse problema.

---

## 💡 Motivação

O objetivo deste projeto **não é substituir completamente as DevTools do navegador**, mas fornecer uma alternativa simples e acessível para atividades de ensino e aprendizado.

Ao permitir visualizar mensagens, erros e executar pequenos trechos de código, o OpenConsoleJS oferece uma experiência de depuração muito mais próxima daquela encontrada em navegadores desktop.

---
## 💙 Por que este projeto existe?

O OpenConsoleJS nasceu como uma iniciativa educacional para auxiliar estudantes durante o aprendizado de HTML, CSS e JavaScript em ambientes com restrições impostas ao navegador.

O projeto **não tem como objetivo contornar políticas de segurança ou desbloquear funcionalidades do sistema operacional**. Em vez disso, busca oferecer uma alternativa simples e legítima para atividades de depuração utilizando apenas recursos disponíveis na própria página web.

Em muitas escolas, os alunos desenvolvem seus projetos utilizando o VS Code Web (`vscode.dev`) e executam os arquivos localmente através do protocolo `file://`. Embora esse fluxo permita escrever e executar código normalmente, ele elimina uma das ferramentas mais importantes para o aprendizado: o Console das DevTools.

O OpenConsoleJS procura reduzir esse impacto ao disponibilizar um painel de depuração embutido na página, permitindo acompanhar mensagens, visualizar erros e experimentar pequenos trechos de código durante o desenvolvimento.

Além de atender esse cenário educacional, o projeto também serve como um laboratório para estudar arquitetura de software, manipulação do DOM, APIs JavaScript e boas práticas de desenvolvimento, evoluindo gradualmente como uma biblioteca open source.

---

## 🎯 Objetivo

Criar uma biblioteca JavaScript leve, modular e extensível que simule parte das funcionalidades do Console das DevTools diretamente na página.

A longo prazo, o projeto pretende evoluir para uma ferramenta de depuração completa, incluindo recursos como inspeção do DOM, monitoramento de eventos, medição de performance, plugins e temas.

---

## ✨ Funcionalidades atuais

A versão atual implementa os seguintes recursos:

- Painel de console embutido na página
- Interface recolhível
- Captura de chamadas para `console.log()`
- Captura de erros não tratados (`window.onerror`)
- Captura de Promises rejeitadas (`unhandledrejection`)
- Execução de código através da API `OpenConsole.evaluate()`
- Limpeza do histórico de mensagens
- API pública simples

---

## ⚠️ Limitações atuais

O projeto ainda está em estágio inicial.

Atualmente **não possui**:

- `console.warn()`
- `console.error()`
- `console.info()`
- inspeção de objetos
- filtros
- pesquisa
- histórico persistente
- exportação de logs
- inspetor do DOM
- painel de eventos
- medição de performance
- sistema de plugins
- temas
- console interativo

Esses recursos fazem parte do roadmap do projeto.

---

## 🎥 Demonstração
![Gif execução OpenConsoleJS](/assets/gif/OpenConsoleJS-gif.gif)

Após incluir o script, um painel será exibido na parte inferior da página.

Toda chamada para:

```javascript
console.log("Olá mundo");
```

passará a aparecer tanto no Console do navegador (quando disponível) quanto no painel do OpenConsoleJS.

---

## 🚀 Instalação

Atualmente basta incluir o arquivo JavaScript na página.

```html
<script src="OpenConsole.js"></script>
```

Nenhuma dependência externa é necessária.

---

## ▶️ Como utilizar

### Exibindo mensagens

```javascript
console.log("Olá mundo!");
```

Resultado:

```
Olá mundo!
```

---

### Executando código

Também é possível executar código através da API pública.

### Utilizando uma função

```javascript
OpenConsole.evaluate(() => {
    const a = 10;
    const b = 5;

    console.log(a + b);
});
```

---

### Utilizando uma string

```javascript
OpenConsole.evaluate(`
    const nome = "OpenConsoleJS";
    console.log(nome);
`);
```

---

### Limpando o console

```javascript
OpenConsole.clearLogs();
```

---

### Adicionando mensagens manualmente

```javascript
OpenConsole.appendLog("Mensagem personalizada");
```

---

## 📚 API pública

Atualmente a biblioteca disponibiliza os seguintes métodos:

| Método | Descrição |
|---------|-----------|
| `OpenConsole.evaluate()` | Executa código JavaScript |
| `OpenConsole.appendLog()` | Adiciona uma mensagem manualmente |
| `OpenConsole.clearLogs()` | Remove todas as mensagens |

---

## 📁 Estrutura do projeto

```
OpenConsoleJS/
│
├── OpenConsole.js
│
├── example/
│   ├── index.html
│   └── script.js
│
├── LICENSE
└── README.md
```

## Organização

### `OpenConsole.js`

Contém toda a implementação da biblioteca.

### `example/`

Projeto simples demonstrando o funcionamento da API.

---

## 🧪 Exemplo

O projeto inclui um exemplo completo em:

```
example/
```

O exemplo demonstra:

- execução de código válido;
- captura de `ReferenceError`;
- captura de `TypeError`;
- captura de erros de sintaxe;
- interceptação de `console.log()`.

---

## 🧩 Arquitetura

A implementação atual utiliza uma **IIFE (Immediately Invoked Function Expression)** para evitar a poluição do escopo global.

A única variável exposta é:

```javascript
window.OpenConsole
```

que representa a API pública da biblioteca.

---

## 🗺️ Roadmap

Entre as próximas funcionalidades previstas estão:

- [ ] `console.info()`
- [ ] `console.warn()`
- [ ] `console.error()`
- [ ] Timestamp nos logs
- [ ] Categorias
- [ ] Filtros
- [ ] Pesquisa
- [ ] Histórico com `localStorage`
- [ ] Exportação de logs
- [ ] Inspetor de Objetos
- [ ] Inspetor do DOM
- [ ] Highlight de elementos
- [ ] Visualização de estilos CSS
- [ ] Monitoramento de eventos
- [ ] Temporizadores (`time/timeEnd`)
- [ ] Contadores (`count`)
- [ ] Console interativo
- [ ] Sistema de plugins
- [ ] Temas
- [ ] Responsividade aprimorada

---

## 🚧 Estado do projeto

**Em desenvolvimento**

Esta biblioteca encontra-se em fase inicial e ainda está passando por evolução de arquitetura e funcionalidades.

Mudanças na API pública podem ocorrer até a versão 1.0.

---

## 🤝 Contribuindo

Contribuições são bem-vindas.

Caso encontre algum problema ou tenha sugestões de melhoria:

1. Abra uma Issue.
2. Descreva o problema ou a proposta.
3. Caso deseje implementar a solução, envie um Pull Request.

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**.

Consulte o arquivo [LICENSE](LICENSE) para mais informações.

---

## 👨‍💻 Autor

**Sávio Morais**

- 🐙 GitHub: [Savio-S-Morais](https://github.com/Savio-S-Morais)
- 💼 LinkedIn: [Sávio Morais](https://www.linkedin.com/in/savio-santana-de-morais/)