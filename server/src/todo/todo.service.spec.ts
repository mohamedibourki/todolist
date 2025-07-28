import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let mockTodo: Todo = new Todo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            save: jest.fn().mockResolvedValue(mockTodo),
            find: jest.fn().mockResolvedValue([mockTodo]),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of todos', async () => {
      const todos = await service.findAll();
      expect(todos).toStrictEqual([mockTodo]);
    });
  });
});
