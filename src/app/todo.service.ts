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

  constructor(private http: HttpClient) {}

  public getTodos() {
    return this.http.get<TodoItem[]>(this.url);
  }

  public addItem(title: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const itemToAdd = {
      title: title,
      done: false,
    };

    return this.http.post<{ id: number }>(this.url, JSON.stringify(itemToAdd), {
      headers,
    });
  }

  public deleteItem(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  public updateItem(updatedItem: TodoItem) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.patch<TodoItem>(
      `${this.url}/${updatedItem.id}`,
      updatedItem,
      {
        headers,
      }
    );
  }
}
