"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit } from "lucide-react";
import { ApiService } from "@/lib/api";

interface Todo {
  id: number;
  name: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    ApiService.get("/todos").then((data) => {
      setTodos(data);
    });
  }, []);

  // Add a new todo
  const addTodo = async () => {
    if (!newTodoText.trim()) return;

    const todo: Todo = await ApiService.post("/todos", newTodoText);

    setTodos([...todos, todo]);
    setNewTodoText("");
  };

  // Edit an existing todo
  const editTodo = async (todo: Todo) => {
    if (!editingTodo?.name.trim()) return;

    await ApiService.update(`/todos/${editingTodo.id}`, editingTodo.name);

    setTodos(
      todos.map((t) =>
        t.id === todo.id ? { ...t, name: editingTodo?.name || t.name } : t
      )
    );

    setEditingTodo(null);
  };

  // Delete a todo
  const deleteTodo = async (id: number) => {
    const isDeleted = await ApiService.delete(`/todos/${id}`);
    isDeleted && setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Toggle todo completion
  const toggleTodoCompletion = async (id: number) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;

    await ApiService.update(`/todos/${id}`, undefined, !todo.completed);

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      {/* Add Todo Input */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add a new todo"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <Button onClick={addTodo}>Add Todo</Button>
      </div>

      {/* Todos Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Todo</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No todos yet. Add one above!
              </TableCell>
            </TableRow>
          ) : (
            todos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell>
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodoCompletion(todo.id)}
                  />
                </TableCell>
                <TableCell
                  className={
                    todo.completed ? "line-through text-muted-foreground" : ""
                  }
                >
                  {todo.name}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog
                      open={editingTodo?.id === todo.id}
                      onOpenChange={(open) => !open && setEditingTodo(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingTodo(todo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Todo</DialogTitle>
                          <DialogDescription>
                            Update the todo details below.
                          </DialogDescription>
                        </DialogHeader>
                        <Input
                          value={editingTodo?.name || ""}
                          onChange={(e) =>
                            setEditingTodo(
                              editingTodo
                                ? { ...editingTodo, name: e.target.value }
                                : null
                            )
                          }
                          onKeyDown={(e) => e.key === "Enter" && editTodo(todo)}
                        />
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setEditingTodo(null)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={() => editTodo(todo)}>Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
