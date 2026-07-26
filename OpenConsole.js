// Project based on an IIFE (Immediately Invoked Function Expression)
(() => {
    let openConsolePanel;
    let toggleButton;
    let logContainer;

    function createPanel() {
        // Prevent duplicate panel creation
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
        // Prevent duplicate style injection
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
        `;
        document.head.appendChild(styleElement);
    };

    function bindPanelEvents() {
        toggleButton.addEventListener('click', () => {
            openConsolePanel.classList.toggle('closed');
            toggleButton.textContent = openConsolePanel.classList.contains('closed')
                ? "▼ Console"
                : "▲ Console";
        });
    };

    function appendLog(message) {
        const logEntry = document.createElement('p');
        logEntry.innerHTML += message;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    };

    function clearLogs() {
        logContainer.innerHTML = ""
    };

    function interceptConsoleLogs() {
        const originalLog = console.log;
        console.log = (...args) => {
            appendLog(args.join(" "));
            originalLog(...args);
        };
    };

    function captureRuntimeErrors() {
        window.addEventListener('error', (event) => {
            appendLog(`
                <span style="color:red">
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
                <span style="color:red">
                    Uncaught (in promise): ${event.reason}
                </span>
            `);
        });
    };
    
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
                <span style="color:red">
                    Uncaught ${error.name}: ${error.message}
                </span>
            `);

            appendLog(error.stack ?? "Sem stack trace");
        }
    };

    function exposeAPI() {
        window.OpenConsole = {
            appendLog,
            clearLogs,
            evaluate
        };
    };

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