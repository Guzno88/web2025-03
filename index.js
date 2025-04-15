const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .requiredOption('-i, --input <paths...>', 'Input JSON file(s)')
  .option('-o, --output <path>', 'Output file')
  .option('-d, --display', 'Display result in console');

program.parse(process.argv);
const options = program.opts();

let finalOutput = '';

for (const inputFile of options.input) {
  if (!fs.existsSync(inputFile)) {
    console.error(`Cannot find input file: ${inputFile}`);
    continue;
  }

  try {
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    for (const item of data) {
      if (item.exchangedate && item.rate) {
        finalOutput += `${item.exchangedate}:${item.rate}\n`;
      }
    }
  } catch (err) {
    console.error(`Error reading file ${inputFile}: ${err.message}`);
  }
}

if (options.output) {
  fs.writeFileSync(options.output, finalOutput);
}

if (options.display) {
  console.log(finalOutput);
}

