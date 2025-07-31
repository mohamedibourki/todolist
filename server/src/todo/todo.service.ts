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
    const todo = this.todoRepository.create({
      name: createTodoDto.name,
      completed: createTodoDto.completed || false,
      order: createTodoDto.order || 0,
    });

    return this.todoRepository.save(todo);
  }

  async reorder(todos: Todo[]) {
    await this.todoRepository.manager.transaction(
      async (transactionalEntityManager) => {
        for (const todo of todos) {
          await transactionalEntityManager.update(
            Todo,
            { id: todo.id },
            { order: todo.order },
          );
        }
      },
    );

    return this.todoRepository.find({
      order: {
        order: 'ASC',
      },
    });
  }

  findAll(completed?: boolean) {
    if (!completed) {
      return this.todoRepository.find({
        order: {
          order: 'ASC',
        },
      });
    } else {
      return this.todoRepository.find({
        where: { completed },
        order: {
          order: 'ASC',
        },
      });
    }
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

    if (updateTodoDto.order !== undefined) {
      todo.order = updateTodoDto.order;
    }

    return this.todoRepository.save(todo);
  }

  remove(id: number) {
    return this.todoRepository.delete(id);
  }
}
