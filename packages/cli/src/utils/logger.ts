import chalk from 'chalk';
import ora, { type Ora } from 'ora';

export const log = {
  info: (msg: string) => console.log(chalk.blue('ℹ'), msg),
  success: (msg: string) => console.log(chalk.green('✓'), msg),
  warn: (msg: string) => console.log(chalk.yellow('⚠'), msg),
  error: (msg: string) => console.log(chalk.red('✗'), msg),
  dim: (msg: string) => console.log(chalk.dim(msg)),
  title: (msg: string) => console.log('\n' + chalk.bold(msg)),
  blank: () => console.log(),
};

export function createSpinner(text: string): Ora {
  return ora({ text, color: 'cyan' });
}
