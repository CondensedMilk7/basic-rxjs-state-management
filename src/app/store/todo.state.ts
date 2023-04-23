import { State, Action, StateContext } from '@ngxs/store';
import { TodoItem, TodoService } from '../todo.service';
import { AddTodo, DeleteTodo, GetTodos, UpdateTodo } from './todo.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';

export interface TodoStateModel {
  todos: TodoItem[];
  loading: boolean;
  error: HttpErrorResponse | null;
}

@State<TodoStateModel>({
  name: 'todos',
  defaults: {
    todos: [],
    loading: false,
    error: null,
  },
})
@Injectable()
export class TodoState {
  constructor(private todoService: TodoService) {}

  @Action(GetTodos)
  getTodos(ctx: StateContext<TodoStateModel>) {
    this.setLoadingState(ctx);

    return this.todoService.getTodos().pipe(
      tap((todos) => {
        ctx.patchState({
          loading: false,
          error: null,
          todos,
        });
      }),

      catchError((error: HttpErrorResponse) => {
        this.errorReceived(ctx, error);
        return of(null);
      })
    );
  }

  @Action(AddTodo)
  addTodo(ctx: StateContext<TodoStateModel>, action: AddTodo) {
    this.setLoadingState(ctx);
    const state = ctx.getState();

    return this.todoService.addItem(action.title).pipe(
      tap((response) => {
        const newItem = {
          id: response.id,
          title: action.title,
          done: false,
        };
        ctx.patchState({
          loading: false,
          error: null,
          todos: [...state.todos, newItem],
        });
      }),

      catchError((error: HttpErrorResponse) => {
        this.errorReceived(ctx, error);
        return of(null);
      })
    );
  }

  @Action(DeleteTodo)
  deleteTodo(ctx: StateContext<TodoStateModel>, action: DeleteTodo) {
    this.setLoadingState(ctx);
    const state = ctx.getState();

    return this.todoService.deleteItem(action.id).pipe(
      tap(() => {
        ctx.patchState({
          loading: false,
          error: null,
          todos: state.todos.filter((item) => item.id !== action.id),
        });
      }),

      catchError((error: HttpErrorResponse) => {
        this.errorReceived(ctx, error);
        return of(null);
      })
    );
  }

  @Action(UpdateTodo)
  updateTodo(ctx: StateContext<TodoStateModel>, action: UpdateTodo) {
    this.setLoadingState(ctx);
    const state = ctx.getState();

    return this.todoService.updateItem(action.item).pipe(
      tap((updatedItem) => {
        ctx.patchState({
          loading: false,
          error: null,
          todos: state.todos.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
        });
      }),

      catchError((error: HttpErrorResponse) => {
        this.errorReceived(ctx, error);
        return of(null);
      })
    );
  }

  private setLoadingState(ctx: StateContext<TodoStateModel>) {
    ctx.patchState({
      loading: true,
      error: null,
    });
  }

  private errorReceived(
    ctx: StateContext<TodoStateModel>,
    error: HttpErrorResponse
  ) {
    ctx.patchState({
      loading: false,
      error: error,
    });
  }
}
