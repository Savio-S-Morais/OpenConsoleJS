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

    function createPanel() {
        // EN: Prevents duplicate panel creation.
        // PT-BR: Evita a criação duplicada do painel.
        if(document.getElementById('open-console-panel')) return;

        openConsolePanel = document.createElement('div');
        openConsolePanel.id = 'open-console-panel';
        openConsolePanel.classList.add('closed');

        openConsolePanel.innerHTML = `
            <button id="toggle-open-console">▼ Console</button>
            <div class="log-container"></div>
        `;
        document.body.appendChild(openConsolePanel);
        toggleButton = openConsolePanel.querySelector('#toggle-open-console');
        logContainer = openConsolePanel.querySelector('.log-container');
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
                cursor: pointer;
                text-align: left;
                padding-left: 15px;
                font-weight: bold;
            }

            .log-container {
                height: calc(100% - 40px);
                overflow-y: auto;
                padding: 10px;
            }

            .log-container p {
                margin: 4px 0;
            }

            .log-error {
                color: #ff5555;
            }

            .info {
                color: #60a5fa;
                background-color: #072541;
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
        const originalLog = console.log;
        const originalLogInfo = console.info;
        const originalLogWarn = console.warn;
        const originalLogError = console.error;

        console.log = (...args) => {
            // EN: Keeps the original behavior by forwarding messages to the browser console.
            // PT-BR: Mantém o comportamento original enviando as mensagens para o console do navegador.
            appendLog(args.join(" "), "log");
            originalLog(...args);
        };
        console.info = (...args) => {
            appendLog(args.join(""),"info");
            originalLogInfo(...args);
        };
        console.warn = (...args) => {
            appendLog(args.join(""),"warn");
            originalLogWarn(...args);
        };
        console.error = (...args) => {
            appendLog(args.join(""), "error");
            originalLogError(...args);
        };
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
            if (typeof input === "function") {
                return input();
            }

            if (typeof input === "string") {
                return eval(input);
            }
        } catch (error) {
            appendLog(`
                <span class="log-error">
                    Uncaught ${error.name}: ${error.message}
                </span>
            `);

            appendLog(error.stack ?? "Sem stack trace");
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
        exposeAPI();
        interceptConsoleLogs();
        captureRuntimeErrors();
    };

    init();
})();