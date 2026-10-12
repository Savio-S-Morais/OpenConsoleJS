/**
 * EN:
 * OpenConsole is a lightweight browser console interface
 * designed for environments where DevTools are unavailable.
 *
 * PT-BR:
 * OpenConsole é uma interface leve de console para navegadores,
 * desenvolvida para ambientes onde as DevTools não estão disponíveis.
 *
 * Implementation:
 * This project uses an IIFE to avoid polluting the global scope.
 *
 * Implementação:
 * Este projeto utiliza uma IIFE para evitar poluir o escopo global.
 */
(() => {
    let openConsolePanel;
    let toggleButton;
    let logContainer;
    let commandForm;
    let commandInput;

    function createPanel() {
        // EN: Prevents duplicate panel creation.
        // PT-BR: Evita a criação duplicada do painel.
        if(document.getElementById('open-console-panel')) return;

        openConsolePanel = document.createElement('div');
        openConsolePanel.id = 'open-console-panel';
        openConsolePanel.classList.add('closed');

        openConsolePanel.innerHTML = `
            <div id="open-console-resize-handle" aria-hidden="true"></div>
            <button id="toggle-open-console">▼ Console</button>
            <div class="log-container"></div>

            <form id="console-command-form">
                <span class="command-prompt">&gt;</span>
                <input
                    type="text"
                    id="console-command-input"
                    placeholder="Digite o comando"
                    autocomplete="off"
                    spellcheck="false"
                    arial-label="Comando JavaScript"
                >
            </form>
        `;
        document.body.appendChild(openConsolePanel);
        toggleButton = openConsolePanel.querySelector('#toggle-open-console');
        logContainer = openConsolePanel.querySelector('.log-container');
        commandForm = openConsolePanel.querySelector('#console-command-form');
        commandInput = openConsolePanel.querySelector('#console-command-input');
    }

    function injectStyles() {
        // EN: Prevents injecting the same CSS multiple times.
        // PT-BR: Evita inserir o mesmo CSS várias vezes.
        if(document.getElementById('console-style')) return;
        const styleElement = document.createElement('style');
        styleElement.id = 'console-style';
        styleElement.textContent = `
            #open-console-panel {
                position: fixed;
                display: flex;
                flex-direction: column;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 220px;
                padding-bottom: 10px;
                background: #1e1e1e;
                color: #fff;
                border-top: 2px solid #444;
                box-sizing: border-box;
                transition: transform .25s ease;
                font-family: monospace;
                font-size: 14px;
                z-index: 9999;
            }

            #open-console-panel.closed {
                transform: translateY(calc(100% - 40px));
            }

            #toggle-open-console {
                width: 100%;
                height: 40px;
                background: #333;
                color: white;
                border: none;
                position: relative;
                cursor: pointer;
                text-align: left;
                padding-left: 15px;
                font-weight: bold;
            }

            .log-container {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                padding: 10px;
                box-sizing: border-box;
            }

            .log-container p {
                margin: 4px 0;
            }

            #open-console-resize-handle {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 6px;
                cursor: ns-resize;
                touch-action: none;
                user-select: none;
                z-index: 2;    
            }

            #console-command-form {
                display: flex;
                align-items: center;
                gap: 8px;
                min-height: 38px;
                padding: 6px 10px;
                background: #252526;
                border-top: 1px solid #444;
            }

            .command-prompt {
                color: #7ec699;
                font-weight: bold;
            }

            #console-command-input {
                flex: 1;
                min-width: 0;
                padding: 6px 0;
                background: transparent;
                color: #fff;
                border: none;
                outline: none;
                font-family: inherit;
                font-size: inherit;
            }

            #console-command-input::placeholder {
                color: #888;
            }

            .log-error {
                color: #ff5555;
            }

            .info::before {
                content: "i";

                display: inline-flex;
                align-items: center;
                justify-content: center;
                background-color: transparent;
                width: 12px;
                height: 12px;
                border: 1px solid white;
                border-radius: 50%;

                font-family: 'Segoe UI', Tahoma, sans-sefif;
                font-size: 10px;
                font-weight: bold;

                margin-right: 5px;
                margin-top: 2px;
                flex-shrink: 0;
            }

            .warn {
                padding-left: 10px;
                color: #e3b505;
                background-color: #332b00;
                border-left: 3px solid #e3b505;
            }

            .error {
                padding-left: 10px;
                color; #ff8080;
                background-color: #290000;
                border-left: 3px solid #ff4d4f;
            }
        `;
        document.head.appendChild(styleElement);
    };

    function bindPanelEvents() {
        // EN: Connects user interactions with the console panel.
        // PT-BR: Conecta as interações do usuário ao painel do console.
        toggleButton.addEventListener('click', () => {
            openConsolePanel.classList.toggle('closed');
            toggleButton.textContent = openConsolePanel.classList.contains('closed')
                ? "▼ Console"
                : "▲ Console";
        });
    };

    /**
     * EN:
     * Binds the command form submission event to execute JavaScript
     * commands and display their results or errors in the console.
     *
     * PT-BR:
     * Vincula o evento de envio do formulário de comandos à execução
     * de comandos JavaScript e à exibição de seus resultados ou erros
     * no console.
     */
    function bindCommandEvents() {
        commandForm.addEventListener('submit', (event) => {
            // EN: Prevents the form submission from reloading the page.
            // PT-BR: Impede que o envio do formulário recarregue a página.
            event.preventDefault();

            const command = commandInput.value.trim();

            // EN: Ignores empty commands.
            // PT-BR: Ignora comandos vazios.
            if(!command) {
                return;
            }

            // EN: Clears the console when a supported clear command is entered.
            // PT-BR: Limpa o console quando um dos comandos de limpeza reconhecidos é informado.
            if(command === 'clear' || command === 'clearLogs()' || command === 'clearLogs') {
                clearLogs();
                commandInput.value = '';
                commandInput.focus();
                return
            }

            appendCommand(command);

            const execution = evaluate(command);

            if(execution.success) {
                appendResult(execution.result);
            } else {
                const error = execution.error;

                appendLog(
                    `Uncaught ${error.name}: ${error.message}`,
                    'log-error'
                );

                if (error.stack) {
                    appendLog(error.stack, 'log-error');
                }
            }

            // EN: Clears the input and restores focus for the next command.
            // PT-BR: Limpa o campo de entrada e restaura o foco para o próximo comando.
            commandInput.value = '';
            commandInput.focus();
        });
    }

    /**
     * EN:
     * Configures the resize functionality for the OpenConsole panel,
     * allowing users to adjust its height through pointer interactions.
     *
     * PT-BR:
     * Configura a funcionalidade de redimensionamento do painel OpenConsole,
     * permitindo que os usuários ajustem sua altura por meio de interações
     * com o ponteiro.
     */
    function setupResize() {
        const resizeHandle = document.getElementById('open-console-resize-handle');
        let isResizing = false;
        let startY = 0;
        let startHeight = 0;
        const minHeight = 120;

        resizeHandle.addEventListener('pointerdown', (event) => {
            // EN: Prevents resizing while the panel is closed.
            // PT-BR: Impede o redimensionamento enquanto o painel estiver fechado.
            if(openConsolePanel.classList.contains('closed')) {
                return;
            }

            // EN: Ignores mouse interactions initiated with buttons other than the primary button.
            // PT-BR: Ignora interações do mouse iniciadas com botões diferentes do botão principal.
            if(event.pointerType == 'mouse' && event.button !== 0) {
                return;
            }

            isResizing = true;

            // EN: Stores the initial pointer position and panel height to calculate subsequent height changes.
            // PT-BR: Armazena a posição inicial do ponteiro e a altura do painel para calcular as alterações subsequentes.
            startY = event.clientY;
            startHeight = openConsolePanel.offsetHeight;

            // EN: Keeps pointer events associated with the resize handle throughout the interaction.
            // PT-BR: Mantém os eventos do ponteiro associados ao elemento de redimensionamento durante toda a interação.
            resizeHandle.setPointerCapture(event.pointerId);

            event.preventDefault();
        });

        resizeHandle.addEventListener('pointermove', (event) => {
            // EN: Ignores pointer movements when resizing is inactive.
            // PT-BR: Ignora os movimentos do ponteiro quando o redimensionamento não está ativo.
            if(!isResizing) {
                return;
            }
            
            const deltaY = event.clientY - startY;
            const newHeight = startHeight - deltaY;
            const maxHeight = window.innerHeight;
            // EN: Restricts the panel height to the defined minimum and the available viewport height.
            // PT-BR: Limita a altura do painel ao mínimo definido e à altura disponível da área visível da página.
            const bounderHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);

            openConsolePanel.style.height = `${bounderHeight}px`;
        });

        function stopResizing() {
            // EN: Ends the resizing interaction.
            // PT-BR: Encerra a interação de redimensionamento.
            isResizing = false;
        }

        // EN: Stops resizing when the pointer is released or the interaction is canceled.
        // PT-BR: Interrompe o redimensionamento quando o ponteiro é solto ou a interação é cancelada.
        resizeHandle.addEventListener('pointerup', stopResizing);
        resizeHandle.addEventListener('pointercancel', stopResizing);
    }

    /**
     * EN:
     * Adds a new message to the console output area.
     *
     * PT-BR:
     * Adiciona uma nova mensagem na área de saída do console.
     */
    function appendLog(message, type) {
        const logEntry = document.createElement('p');
        logEntry.classList.add(type);
        logEntry.innerHTML += message;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    };

    /**
     * EN:
     * Appends an executed command to the console output,
     * displaying it with a prompt to distinguish it from other messages.
     *
     * PT-BR:
     * Adiciona um comando executado à saída do console,
     * exibindo-o com um indicador para diferenciá-lo das demais mensagens.
     */
    function appendCommand(command) {
        const commandEntry = document.createElement('p');
        const prompt = document.createElement('span');
        const commandText = document.createElement('span');

        prompt.textContent = '> ';
        prompt.style.color = '#7ec699';

        commandText.textContent = command;

        commandEntry.appendChild(prompt);
        commandEntry.appendChild(commandText);

        logContainer.appendChild(commandEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    };

    /**
     * EN:
     * Appends the result of an executed command to the console output,
     * formatting values for readability and handling serialization errors.
     *
     * PT-BR:
     * Adiciona o resultado de um comando executado à saída do console,
     * formatando os valores para facilitar a leitura e tratando erros
     * de serialização.
     */
    function appendResult(result) {
    const resultEntry = document.createElement('p');

        resultEntry.style.paddingLeft = '16px';
        resultEntry.style.whiteSpace = 'pre-wrap';

        if (result === undefined) {
            // EN: Explicitly displays undefined results.
            // PT-BR: Exibe explicitamente os resultados undefined.
            resultEntry.textContent = 'undefined';
        } else if (typeof result === 'string') {
            resultEntry.textContent = result;
        } else {
            try {
                // EN: Formats serializable values as indented JSON, falling back to string conversion when necessary.
                // PT-BR: Formata valores serializáveis como JSON indentado, recorrendo à conversão para texto quando necessário.
                resultEntry.textContent = JSON.stringify(result, null, 2)
                    ?? String(result);
            } catch {
                // EN: Handles values that cannot be serialized as JSON.
                // PT-BR: Trata valores que não podem ser serializados como JSON.
                resultEntry.textContent = String(result);
            }
        }

        logContainer.appendChild(resultEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    
    /**
     * EN:
     * Removes all messages displayed in the console.
     *
     * PT-BR:
     * Remove todas as mensagens exibidas no console.
     */
    function clearLogs() {
        logContainer.innerHTML = ""
    };

    
    /**
     * EN:
     * Overrides the native console.log method to duplicate
     * messages inside the OpenConsole panel while keeping
     * the original browser console behavior.
     *
     * PT-BR:
     * Sobrescreve o método nativo console.log para duplicar
     * mensagens no painel OpenConsole mantendo o comportamento
     * original do console do navegador.
     */
    function interceptConsoleLogs() {
        const consoleTypes = [
            "log",
            "info",
            "warn",
            "error"
        ];

        consoleTypes.forEach((type) => {
            const originalConsole = console[type];

            console[type] = (...args) => {
                // EN: Keeps the original behavior by forwarding messages to the browser console.
                // PT-BR: Mantém o comportamento original enviando as mensagens para o console do navegador.
                appendLog(args.join(" "), type);
                originalConsole(...args);
            }
        })
    };
    
    /**
     * EN:
     * Captures uncaught errors and unhandled promise rejections.
     *
     * PT-BR:
     * Captura erros não tratados e rejeições de Promise não tratadas.
     */
    function captureRuntimeErrors() {
        window.addEventListener('error', (event) => {
            appendLog(`
                <span class="log-error">
                    Uncaught ${event.error?.name || "Error"}:
                    ${event.message}
                    <br>
                    ${event.filename}:${event.lineno}:${event.colno}
                </span>
            `);
            appendLog(event.error?.stack ?? "Sem stack trace");
        });

        window.addEventListener("unhandledrejection", (event) => {
            appendLog(`
                <span class="log-error">
                    Uncaught (in promise): ${event.reason}
                </span>
            `);
        });
    };
    
    
    /**
     * EN:
     * Executes JavaScript code provided as a function or string.
     *
     * PT-BR:
     * Executa código JavaScript recebido como função ou texto.
     *
     * Note:
     * This function uses eval intentionally to simulate a browser console experience.
     * Using eval can execute arbitrary code.
     *
     * Observação:
     * Esta função utiliza eval intencionalmente para simular a experiência de um console do navegador.
     * O uso de eval pode executar códigos arbitrários.
     */
    function evaluate(input) {
        try {
            let result;

            if(typeof input === "function") {
                result = input();
            } else if(typeof input === "string") {
                result = eval(input);
            } else {
                // EN: Rejects inputs that are neither functions nor strings.
                // PT-BR: Rejeita entradas que não sejam funções nem textos.
                throw new TypeError("Entrada inválida para execução");
            }

            // EN: Returns the execution result using a consistent response structure.
            // PT-BR: Retorna o resultado da execução utilizando uma estrutura de resposta consistente.
            return {
                success: true,
                result: result
            };
        } catch (error) {
            appendLog(`
                <span class="log-error">
                    Uncaught ${error.name}: ${error.message}
                </span>
            `);

            appendLog(error.stack ?? "Sem stack trace");

            // EN: Returns the captured error so the caller can handle its display.
            // PT-BR: Retorna o erro capturado para que a função chamadora possa tratar sua exibição.
            return {
                success: false,
                error: error
            };
        }
    };

    /**
     * EN:
     * Exposes the public OpenConsole API through the window object,
     * allowing users to interact with the library externally.
     *
     * PT-BR:
     * Expõe a API pública do OpenConsole através do objeto window,
     * permitindo interação externa com a biblioteca.
     */
    function exposeAPI() {
        window.OpenConsole = {
            appendLog,
            clearLogs,
            evaluate
        };
    };

    
    /**
     * EN:
     * Initializes all OpenConsole features.
     *
     * PT-BR:
     * Inicializa todos os recursos do OpenConsole.
     */
    function init() {
        if(document.getElementById('open-console-panel')) return;

        createPanel();
        injectStyles();
        bindPanelEvents();
        setupResize();
        bindCommandEvents();
        exposeAPI();
        interceptConsoleLogs();
        captureRuntimeErrors();
    };

    init();
})();