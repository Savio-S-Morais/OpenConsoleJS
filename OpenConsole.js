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
            <div id="open-console-resize-handle" aria-hidden="true"></div>
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
                position: relative;
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
        setupResize();
        exposeAPI();
        interceptConsoleLogs();
        captureRuntimeErrors();
    };

    init();
})();