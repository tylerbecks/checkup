import {
  Task,
  TaskContext,
  ESLintReport,
  Parser,
  BaseTask,
  buildLintResultDataItem,
  buildResultsFromLintResult,
  LintResult,
} from '@checkup/core';
import { EMBER_TEST_TYPES } from '../utils/lint-configs';
import { Result } from 'sarif';

export default class EmberTestTypesTask extends BaseTask implements Task {
  taskName = 'ember-test-types';
  taskDisplayName = 'Test Types';
  category = 'testing';
  group = 'ember';

  private eslintParser: Parser<ESLintReport>;
  private testFiles: string[];

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    let createEslintParser = this.context.parsers.get('eslint')!;
    this.eslintParser = createEslintParser(EMBER_TEST_TYPES);

    this.testFiles = this.context.paths.filterByGlob('**/*test.js');
  }

  async run(): Promise<Result[]> {
    let esLintReport = await this.runEsLint();

    return this.buildResult(esLintReport, this.context.cliFlags.cwd);
  }

  private async runEsLint(): Promise<ESLintReport> {
    return this.eslintParser.execute(this.testFiles);
  }

  buildResult(report: ESLintReport, cwd: string): Result[] {
    let testTypes: { [key: string]: LintResult[] } = {};
    report.results.forEach((esLintResult) => {
      let testType: string = '';
      let method: string = '';

      if (esLintResult.messages.length === 0) {
        return;
      }

      esLintResult.messages
        .filter((message) => message.ruleId === 'test-types')
        .forEach((lintMessage) => {
          [testType, method] = lintMessage.message.split('|');
          lintMessage.message = testType;
          let lintResult = buildLintResultDataItem(lintMessage, cwd, esLintResult.filePath, {
            method,
          });
          let testCategory = `${testType}_${method}`;
          if (testTypes[testCategory] === undefined) {
            testTypes[testCategory] = [];
          }

          testTypes[testCategory].push(lintResult);
        });

      return testTypes;
    });

    return Object.keys(testTypes).flatMap((key) => {
      return buildResultsFromLintResult(this, testTypes[key], {
        method: testTypes[key][0].method,
      });
    });
  }
}
