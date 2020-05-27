import { Category, Priority, Task, TaskResult, BaseTask, toTaskItemData } from '@checkup/core';

import EmberTypesTaskResult from '../results/ember-types-task-result';

const micromatch = require('micromatch');

const SEARCH_PATTERNS = [
  { patternName: 'components', pattern: ['**/components/**/*.js'] },
  { patternName: 'controllers', pattern: ['**/controllers/**/*.js'] },
  { patternName: 'helpers', pattern: ['**/helpers/**/*.js'] },
  { patternName: 'initializers', pattern: ['**/initializers/**/*.js'] },
  { patternName: 'instance-initializers', pattern: ['**/instance-initializers/**/*.js'] },
  { patternName: 'mixins', pattern: ['**/mixins/**/*.js'] },
  { patternName: 'models', pattern: ['**/models/**/*.js'] },
  { patternName: 'routes', pattern: ['**/routes/**/*.js'] },
  { patternName: 'services', pattern: ['**/services/**/*.js'] },
  { patternName: 'templates', pattern: ['**/templates/**/*.hbs'] },
];

export default class EmberTypesTask extends BaseTask implements Task {
  meta = {
    taskName: 'ember-types',
    friendlyTaskName: 'Ember Types',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.High,
    },
  };

  async run(): Promise<TaskResult> {
    let result = new EmberTypesTaskResult(this.meta);
    result.types = SEARCH_PATTERNS.map((pattern) => {
      return toTaskItemData(pattern.patternName, micromatch(this.context.paths, pattern.pattern));
    });

    return result;
  }
}
