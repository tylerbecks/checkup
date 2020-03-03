import { Priority, Task, TaskName } from '@checkup/core';

export default class PriorityMap {
  maps: Map<any, Map<TaskName, Task>>;

  constructor() {
    this.maps = new Map<Priority, Map<TaskName, Task>>([
      [Priority.High, new Map<TaskName, Task>()],
      [Priority.Medium, new Map<TaskName, Task>()],
      [Priority.Low, new Map<TaskName, Task>()],
    ]);
  }

  getTask(taskName: TaskName): Task | undefined {
    let task: Task | undefined;

    this.maps.forEach((tasks: Map<TaskName, Task>) => {
      if (tasks.has(taskName)) {
        task = tasks.get(taskName);
      }
    });

    return task;
  }

  getTaskByPriority(priority: Priority, taskName: TaskName): Task | undefined {
    let map = this.maps.get(priority);

    return map!.get(taskName);
  }

  setTaskByPriority(priority: Priority, taskName: TaskName, task: Task): void {
    let map = this.maps.get(priority);

    map!.set(taskName, task);
  }

  getTasks(priority: Priority): Map<TaskName, Task> {
    return this.maps.get(priority)!;
  }

  *[Symbol.iterator]() {
    for (let [, map] of this.maps) {
      for (let [taskName, task] of map) {
        yield [taskName, task];
      }
    }
  }

  entries() {
    return this.entriesIterator();
  }

  values() {
    return this.valuesIterator();
  }

  get size() {
    return [...this.maps.values()].reduce((total, currentMap) => (total += currentMap.size), 0);
  }

  *entriesIterator() {
    for (let [, map] of this.maps) {
      for (let [priority, tasks] of map) {
        yield [priority, tasks];
      }
    }
  }

  *valuesIterator() {
    for (let [, map] of this.maps) {
      for (let [, task] of map) {
        yield task;
      }
    }
  }
}
