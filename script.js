document.addEventListener("DOMContentLoaded", function () {
    const terminalOutput = document.getElementById("output");
    const commandInput = document.getElementById("commandInput");
    const body = document.body;

    function appendOutput(content, isHTML = false) {
        if (isHTML) {
            terminalOutput.innerHTML += content + "<br>";
        } else {
            terminalOutput.innerHTML += content + "\n";
        }
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Efek beep
    function beep() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.05);
    }

    // Efek teks glitch
    function glitchText(text, callback) {
        let chars = "!@#$%^&*()_+{}|:<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let progress = 0;

        let interval = setInterval(() => {
            let randomText = "";
            for (let i = 0; i < text.length; i++) {
                if (i < progress) {
                    randomText += text[i];
                } else {
                    randomText += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            terminalOutput.innerHTML = terminalOutput.innerHTML.replace(/<br>$/, "");
            appendOutput(randomText);
            progress++;
            if (progress > text.length) {
                clearInterval(interval);
                callback && callback();
            }
        }, 50);
    }

    // Efek shake
    function shakeScreen() {
        body.style.transition = "transform 0.1s";
        let i = 0;
        let interval = setInterval(() => {
            let x = (Math.random() - 0.5) * 10;
            let y = (Math.random() - 0.5) * 10;
            body.style.transform = `translate(${x}px, ${y}px)`;
            i++;
            if (i > 10) {
                clearInterval(interval);
                body.style.transform = "translate(0, 0)";
            }
        }, 100);
    }

    // Progress bar
    function showProgressBar(callback) {
        let progress = 0;
        let interval = setInterval(() => {
            let bar = "[" + "#".repeat(progress / 5) + " ".repeat(20 - progress / 5) + `] ${progress}%`;
            terminalOutput.innerHTML = terminalOutput.innerHTML.replace(/\[.*\] \d+%/, bar);
            progress += 5;
            beep(); // bunyi beep tiap update
            shakeScreen(); // goyang layar tiap update
            if (progress > 100) {
                clearInterval(interval);
                callback();
            }
        }, 100);
        appendOutput("[                    ] 0%");
    }

    // Handler command
    function handleCommand(cmd) {
        const command = cmd.trim().toLowerCase();
        appendOutput("> " + cmd);

        switch (command) {
            case "help":
                appendOutput("Available commands:\n- help : Show commands\n- ethos : Show EthereumOS Logo");
                break;

            case "ethos":
                glitchText("EthereumOS Terminal Booting...", () => {
                    appendOutput("  _____ _   _  ____   ___  ____   ____  _____ _ ");
                    appendOutput(" | ____| \\ | |/ ___| / _ \\|  _ \\ / ___|| ____| |");
                    appendOutput(" |  _| |  \\| | |  _ | | | | | | | |  _ |  _| | |");
                    appendOutput(" | |___| |\\  | |_| || |_| | |_| | |_| || |___|_|");
                    appendOutput(" |_____|_| \\_|\\____(_)___/|____/ \\____||_____|(_)");
                    appendOutput("");
                    appendOutput("Loading EthereumOS Assets...");

                    showProgressBar(() => {
                        let img1 = document.createElement("img");
                        img1.src = "assets/ethos.jpg";
                        img1.style.maxWidth = "200px";
                        img1.style.display = "block";
                        img1.style.opacity = 0;
                        img1.style.transition = "opacity 1s";

                        let img2 = document.createElement("img");
                        img2.src = "assets/panjangethos.jpg";
                        img2.style.maxWidth = "300px";
                        img2.style.display = "block";
                        img2.style.marginTop = "10px";
                        img2.style.opacity = 0;
                        img2.style.transition = "opacity 1s";

                        terminalOutput.appendChild(img1);
                        terminalOutput.appendChild(img2);

                        setTimeout(() => {
                            img1.style.opacity = 1;
                            img2.style.opacity = 1;
                        }, 100);
                    });
                });
                break;

            default:
                appendOutput("Command not found. Type 'help' for commands.");
        }
    }

    // Event listener input
    commandInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            handleCommand(commandInput.value);
            commandInput.value = "";
        }
    });
});
