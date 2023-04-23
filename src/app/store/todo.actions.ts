import { TodoItem } from '../todo.service';

export class GetTodos {
  static readonly type = '[Todo Page] Get Todos';
}

export class AddTodo {
  static readonly type = '[Todo Page] Add Todo';
  constructor(public title: string) {}
}

export class DeleteTodo {
  static readonly type = '[Todo Page] Delete Todo';
  constructor(public id: number) {}
}

export class UpdateTodo {
  static readonly type = '[Todo Page] Update Todo';
  constructor(public item: TodoItem) {}
}
