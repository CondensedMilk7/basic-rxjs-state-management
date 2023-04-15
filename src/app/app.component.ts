import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TodoItem, TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  newItemTitle = '';
  todos$ = this.todoService.todos;
  loading$ = this.todoService.loading;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.init();
  }

  addItem() {
    this.todoService.addItem(this.newItemTitle);
    this.newItemTitle = '';
  }

  changeDone(itemToChange: TodoItem) {
    const updatedItem = {
      ...itemToChange,
      done: !itemToChange.done,
    };

    this.todoService.updateItem(updatedItem);
  }

  deleteItem(id: number) {
    this.todoService.deleteItem(id);
  }
}
