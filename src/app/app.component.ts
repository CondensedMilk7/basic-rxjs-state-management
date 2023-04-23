import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TodoItem, TodoService } from './todo.service';
import { Store, Select } from '@ngxs/store';
import {
  AddTodo,
  DeleteTodo,
  GetTodos,
  UpdateTodo,
} from './store/todo.actions';
import { TodoState, TodoStateModel } from './store/todo.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  newItemTitle = '';

  @Select(TodoState) vm$!: Observable<TodoStateModel>;

  constructor(private todoService: TodoService, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetTodos());
  }

  addItem() {
    // this.todoService.addItem(this.newItemTitle);
    this.store.dispatch(new AddTodo(this.newItemTitle)).subscribe(() => {
      this.newItemTitle = '';
    });
  }

  changeDone(itemToChange: TodoItem) {
    const updatedItem = {
      ...itemToChange,
      done: !itemToChange.done,
    };

    this.store.dispatch(new UpdateTodo(updatedItem));
  }

  deleteItem(id: number) {
    this.store.dispatch(new DeleteTodo(id));
  }
}
