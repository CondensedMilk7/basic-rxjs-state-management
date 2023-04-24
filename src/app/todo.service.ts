import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';

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
  private error$ = new BehaviorSubject<HttpErrorResponse | null>(null);

  constructor(private http: HttpClient) {}

  get error() {
    return (
      this.error$
        .asObservable()
        // If error has emitted a value, loading has finished
        .pipe(tap(() => this.todosLoading$.next(false)))
    );
  }

  get loading() {
    return (
      this.todosLoading$
        .asObservable()
        // If loading state is retriggered, reset the error stream
        .pipe(tap((loading) => loading && this.error$.next(null)))
    );
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
      .get<TodoItem[]>(this.url)
      .pipe(
        tap((todos) => {
          this.todos$.next(todos);
        }),
        catchError((error: HttpErrorResponse) => {
          this.error$.next(error);
          return of(null);
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
      .post<{ id: number }>(this.url, JSON.stringify(itemToAdd), {
        headers,
      })
      .pipe(
        tap((response) => {
          const newItem = {
            id: response.id,
            ...itemToAdd,
          };
          this.todos$.next([...this.todos$.value, newItem]);
        }),
        catchError((error: HttpErrorResponse) => {
          this.error$.next(error);
          return of(null);
        })
      )
      .subscribe();
  }

  public deleteItem(id: number) {
    this.todosLoading$.next(true);

    this.http
      .delete<void>(`${this.url}/${id}`)
      .pipe(
        tap(() => {
          this.todos$.next(this.todos$.value.filter((item) => item.id !== id));
        }),
        catchError((error: HttpErrorResponse) => {
          this.error$.next(error);
          return of(null);
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
        }),
        catchError((error: HttpErrorResponse) => {
          this.error$.next(error);
          return of(null);
        })
      )
      .subscribe();
  }
}
