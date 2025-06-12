class YachtAnimation {
  static hasSetupHandlers = false;

  constructor() {
    this.terminalWidth = 50;
    this.running = false;

    if (!YachtAnimation.hasSetupHandlers) {
      this.setupExitHandlers();
      YachtAnimation.hasSetupHandlers = true;
    }
  }

  hideCursor() {
    process.stdout.write("\x1b[?25l");
  }

  showCursor() {
    process.stdout.write("\x1b[?25h");
  }

  clearScreen() {
    process.stdout.write("\x1b[1;1H\x1b[2J");
  }

  moveCursor() {
    process.stdout.write("\x1b[1;1H");
  }

  setupExitHandlers() {
    const cleanup = () => {
      this.showCursor();
      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
    process.on("exit", cleanup);
  }

  reverseString(str) {
    let reversed = "";
    for (let i = str.length - 1; i >= 0; i--) {
      let char = str[i];
      switch (char) {
        case "/":
          char = "\\";
          break;
        case "\\":
          char = "/";
          break;
        case "<":
          char = ">";
          break;
        case ">":
          char = "<";
          break;
      }
      reversed += char;
    }
    return reversed;
  }

  drawYacht(pos, direction) {
    let spaces = " ".repeat(pos);
    let spaces2 = " ".repeat(pos * 2);
    let output = "";

    const yachtLines = [
      "                        ",
      "         <<<|           ",
      "           /|           ",
      "          / |           ",
      "         /  |\\          ",
      "        /   | \\         ",
      "       /____|  \\        ",
      "         ___|___\\       ",
      "  ______|_o_o_o_\\______ ",
      "  \\__________________/  ",
    ];

    const waterLines = [
      "~~~~~~~~~~~~^~~~~~^~~~~~~~~^~~~~~~~~~^~~~~~~~~~~~~~",
      `${spaces}    ^  ^^^     ^^    ^^^                  `,
      "  ~~~   ~~~   ~~~   ~~~   ~~~   ~~~   ~~~          ",
    ];

    const fishLine = "  ^^  ~-^:>   ^ ^^ ";

    for (const line of yachtLines) {
      let displayLine;
      if (direction === "right") {
        displayLine = spaces + this.reverseString(line);
      } else {
        displayLine = spaces + line;
      }

      const paddedLine = displayLine.padEnd(this.terminalWidth, " ");
      output += paddedLine + "\n";
    }

    for (const line of waterLines) {
      const paddedLine = line.padEnd(this.terminalWidth, " ");
      output += `\x1b[34m${paddedLine}\x1b[0m\n`;
    }

    output += `\x1b[34m${spaces2}${direction === "right" ? this.reverseString(fishLine) : fishLine}\x1b[0m\n`;

    process.stdout.write(output);
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async animate() {
    this.hideCursor();
    this.clearScreen();
    this.running = true;

    while (this.running) {
      for (let pos = 0; pos <= 20 && this.running; pos++) {
        this.moveCursor();
        this.drawYacht(pos, "left");
        await this.sleep(200);
      }

      for (let pos = 20; pos >= 0 && this.running; pos--) {
        this.moveCursor();
        this.drawYacht(pos, "right");
        await this.sleep(200);
      }
    }
  }

  stop() {
    this.running = false;
    this.showCursor();
  }
}

module.exports = YachtAnimation;

if (require.main === module) {
  const yacht = new YachtAnimation();
  yacht.animate();
}
