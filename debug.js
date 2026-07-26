// Project based on an IIFE (Immediately Invoked Function Expression)
(() => {
    let panel;
    let button;
    let content;

    function createDebugPanel() {
        // Prevent duplicate panel creation
        if(document.getElementById('debug-panel')) return;

        panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.classList.add('closed');

        panel.innerHTML = `
            <button id="toggle-debug">▼ Debug</button>
            <div class="debug-content"></div>
        `;

        document.body.appendChild(panel);
        button = panel.querySelector('#toggle-debug');
        content = panel.querySelector('.debug-content');
    }

    function injectDebugStyles() {
        // Prevent duplicate style injection
        if(document.getElementById('debug-style')) return;
        const style = document.createElement('style');
        style.id = 'debug-style';
        style.textContent = `
            #debug-panel {
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

            #debug-panel.closed {
                transform: translateY(calc(100% - 40px));
            }

            #toggle-debug {
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

            .debug-content {
                height: calc(100% - 40px);
                overflow-y: auto;
                padding: 10px;
            }

            .debug-content p {
                margin: 4px 0;
            }
        `;
        document.head.appendChild(style);
    };

    function openDebugPanel() {
        button.addEventListener('click', () => {
            panel.classList.toggle('closed');
            button.textContent = panel.classList.contains('closed')
                ? "▼ Debug"
                : "▲ Debug";
        });
    };

    function appendLogEntry(msg) {
        const p = document.createElement('p');
        p.innerHTML += msg;
        content.appendChild(p);
        content.scrollTop = content.scrollHeight;
    };

    function clearLogs() {
        content.innerHTML = ""
    };

    function captureConsoleLogs() {
        const originalLog = console.log;
        console.log = (...args) => {
            debug.appendLogEntry(args.join(" "));
            originalLog(...args);
        };
    };

    function captureRuntimeErrors() {
        window.addEventListener('error', (event) => {
            debug.appendLogEntry(`
                <span style="color:red">
                    Uncaught ${event.error?.name || "Error"}:
                    ${event.message}
                    <br>
                    ${event.filename}:${event.lineno}:${event.colno}
                </span>
            `);
            appendLogEntry(event.error?.stack ?? "Sem stack trace");
        });

        window.addEventListener("unhandledrejection", (event) => {
            debug.appendLogEntry(`
                <span style="color:red">
                    Uncaught (in promise): ${event.reason}
                </span>
            `);
        });
    };
    
    function run(source) {
        try {
            if (typeof source === "function") {
                return source();
            }

            if (typeof source === "string") {
                return eval(source);
            }
        } catch (error) {
            debug.appendLogEntry(`
                <span style="color:red">
                    Uncaught ${error.name}: ${error.message}
                </span>
            `);

            appendLogEntry(error.stack ?? "Sem stack trace");
        }
    };

    function createAPI() {
        window.debug = {
            appendLogEntry,
            clearLogs,
            run
        };
    };

    function init() {
        if(document.getElementById('debug-panel')) return;

        createDebugPanel();
        injectDebugStyles();
        openDebugPanel();
        createAPI();
        captureConsoleLogs();
        captureRuntimeErrors();
    };

    init();
})();