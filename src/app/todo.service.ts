import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

export interface TodoItem {
  id: number;
  title: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private url = 'http://localhost:3000/todos';

  private todos$ = new BehaviorSubject<TodoItem[]>([]);
  private todosLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  get loading() {
    return this.todosLoading$.asObservable();
  }

  get todos() {
    return (
      this.todos$
        .asObservable()
        // Every time this observable emits value, it means that loading has finished
        .pipe(tap(() => this.todosLoading$.next(false)))
    );
  }

  public init() {
    this.todosLoading$.next(true);

    this.http
      .get<TodoItem[]>(`${this.url}`)
      .pipe(
        tap((todos) => {
          this.todos$.next(todos);
        })
      )
      .subscribe();
  }

  public addItem(title: string) {
    this.todosLoading$.next(true);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const itemToAdd = {
      title: title,
      done: false,
    };

    this.http
      .post<{ id: number }>(`${this.url}`, JSON.stringify(itemToAdd), {
        headers,
      })
      .pipe(
        tap((response) => {
          const newItem = {
            id: response.id,
            ...itemToAdd,
          };
          this.todos$.next([...this.todos$.value, newItem]);
        })
      )
      .subscribe();
  }

  public deleteItem(id: number) {
    this.todosLoading$.next(true);

    this.http
      .delete<TodoItem>(`${this.url}/${id}`)
      .pipe(
        tap(() => {
          this.todos$.next(this.todos$.value.filter((item) => item.id !== id));
        })
      )
      .subscribe();
  }

  public updateItem(updatedItem: TodoItem) {
    this.todosLoading$.next(true);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .patch<TodoItem>(`${this.url}/${updatedItem.id}`, updatedItem, {
        headers,
      })
      .pipe(
        tap((updatedItem) => {
          const updatedList = this.todos$.value.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          );
          this.todos$.next(updatedList);
        })
      )
      .subscribe();
  }
}
