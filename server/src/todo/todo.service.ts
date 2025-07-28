import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Repository } from 'typeorm';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
  ) {}

  create(createTodoDto: CreateTodoDto) {
    return this.todoRepository.save(createTodoDto);
  }

  findAll(completed?: boolean) {
    if (!completed) return this.todoRepository.find();
    else return this.todoRepository.findBy({ completed });
  }

  findOne(id: number) {
    return this.todoRepository.findOneBy({ id });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) throw new NotFoundException('todo not found');

    if (updateTodoDto.name !== undefined) {
      todo.name = updateTodoDto.name;
    }

    if (updateTodoDto.completed !== undefined) {
      if (typeof updateTodoDto.completed === 'string') {
        todo.completed = updateTodoDto.completed === 'true';
      } else {
        todo.completed = updateTodoDto.completed;
      }
    }

    return this.todoRepository.save(todo);
  }

  remove(id: number) {
    return this.todoRepository.delete(id);
  }
}
