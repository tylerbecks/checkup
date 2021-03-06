import { Log } from 'sarif';
import { writeJsonSync, existsSync, mkdirpSync } from 'fs-extra';
import { isAbsolute, dirname, resolve } from 'path';
import { ui } from '@checkup/core';
import { yellow } from 'chalk';

const date = require('date-and-time');

export const TODAY = date.format(new Date(), 'YYYY-MM-DD-HH_mm_ss');
export const DEFAULT_OUTPUT_FILENAME = `checkup-report-${TODAY}.sarif`;

export function writeOutputFile(outputFile: string, cwd: string, result: Log) {
  let outputPath = getOutputPath(outputFile, cwd);

  writeJsonSync(outputPath, result);

  ui.log(yellow(outputPath));
}

export function getOutputPath(outputFile: string, cwd: string = '') {
  if (/{default}/.test(outputFile)) {
    outputFile = outputFile.replace('{default}', DEFAULT_OUTPUT_FILENAME);
  }

  let outputPath = isAbsolute(outputFile)
    ? outputFile
    : resolve(cwd, outputFile || `${DEFAULT_OUTPUT_FILENAME}.sarif`);

  let dir = dirname(outputPath);

  if (!existsSync(dir)) {
    mkdirpSync(dir);
  }

  return outputPath;
}
