import { TodoStore } from './store';
import { guid, ID, Order } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { mapTo, take } from 'rxjs/operators';
import { Todo } from './model';
import { FILTER } from '../todo-filter/model';
import { TodoQuery } from './query';

const booksMock: Todo[] = [
  { id: guid(), title: 'Wash my car', completed: false },
  { id: guid(), title: 'Give flowers', completed: false },
  { id: guid(), title: 'Clean up at home', completed: true },
  { id: guid(), title: 'Eat pancakes', completed: false },
  { id: guid(), title: 'Sing a song', completed: true },
];

@Injectable()
export class TodoService {
  constructor(private store: TodoStore, private todoQuery: TodoQuery) {
  }

  add(title: string) {
    this.store.createTodo({ id: guid(), title });
  }

  delete(id: ID) {
    this.store.remove(id);
  }

  complete(id: ID, completed: boolean) {
    this.store.update(id, { completed });
  }

  updateCurrentFilter(filter: FILTER) {
    this.store.update({ filter });
  }

  getTasks() {
    timer(600)
      .pipe(mapTo(booksMock))
      .subscribe(tasks => {
        this.store.set(tasks);
      });
  }

  toggle() {
    this.store.update(null, todo => ({
      completed: !todo.completed
    }));
  }

  updateOrder(order: Order) {
    this.store.update({ order });
  }

  toggleOrder() {
    this.todoQuery.selectCurrentOrder$
      .pipe(take(1))
      .subscribe(order => this.updateOrder(order === Order.ASC ? Order.DESC : Order.ASC));
  }
}
