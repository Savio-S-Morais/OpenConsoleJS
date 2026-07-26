// Projeto baseado em IIFE (Immediately Invoked Function Expression
(() => {
    function init() {
        // Evitar criar painel duas vezes
        if(document.getElementById('debug-panel')) return;

        // ======== HTML ========
            const panel = document.createElement('div');
            panel.id = 'debug-panel';
            panel.classList = 'closed';

            panel.innerHTML = `
                <button id="toggle-debug">▼ Debug</button>
                <div class="debug-content"></div>
            `;

            document.body.appendChild(panel);

        // Evitar criar CSS duas vezes
        if(!document.getElementById('debug-style')) {
            // ======== CSS ========
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

        // ======== JS ========
        const button = document.getElementById('toggle-debug');
        const content = panel.querySelector('.debug-content');

        button.addEventListener('click', () => {
            panel.classList.toggle('closed');
            button.textContent = panel.classList.contains('closed')
                ? "▼ Debug"
                : "▲ Debug";
        });

        function log(msg) {
            const p = document.createElement('p');
            p.innerHTML += msg;
            content.appendChild(p);
            content.scrollTop = content.scroolHeight;
        };

        function clear() {
            content.innerHTML = ""
        }

        window.debug = {
            log,
            clear
        };
    };

    init();
})();