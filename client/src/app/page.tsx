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
import { Trash2, Edit, GripVertical } from "lucide-react";
import { ApiService } from "@/lib/api";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

export interface Todo {
  id: number;
  name: string;
  completed: boolean;
  order: number; // Add order field
}

// Sortable Todo Row Component
const SortableTodoRow = ({
  todo,
  toggleTodoCompletion,
  setEditingTodo,
  deleteTodo,
}: {
  todo: Todo;
  toggleTodoCompletion: (id: number) => void;
  setEditingTodo: (todo: Todo | null) => void;
  deleteTodo: (id: number) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      <TableCell>
        <div className="flex items-center">
          <div {...listeners} className="mr-2 cursor-grab">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => toggleTodoCompletion(todo.id)}
          />
        </div>
      </TableCell>
      <TableCell
        className={todo.completed ? "line-through text-muted-foreground" : ""}
      >
        {todo.name}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Dialog
            open={false}
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
                value={todo.name}
                onChange={(e) =>
                  setEditingTodo(
                    todo ? { ...todo, name: e.target.value } : null
                  )
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && toggleTodoCompletion(todo.id)
                }
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingTodo(null)}>
                  Cancel
                </Button>
                <Button onClick={() => toggleTodoCompletion(todo.id)}>
                  Save
                </Button>
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
  );
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadTodos();
  }, []);

  // Load todos and sort by order
  const loadTodos = async () => {
    const data = await ApiService.get("/todos");
    // Sort todos by order field
    const sortedTodos = data.sort((a: Todo, b: Todo) => a.order - b.order);
    setTodos(sortedTodos);
  };

  // Add a new todo
  const addTodo = async () => {
    if (!newTodoText.trim()) return;
    // Calculate the next order value
    const nextOrder =
      todos.length > 0 ? Math.max(...todos.map((t) => t.order)) + 1 : 0;
    const todo: Todo = await ApiService.post("/todos", {
      name: newTodoText,
      order: nextOrder,
    });
    setTodos([...todos, todo]);
    setNewTodoText("");
  };

  // Edit an existing todo
  const editTodo = async (todo: Todo) => {
    if (!editingTodo?.name.trim()) return;
    await ApiService.update(`/todos/${editingTodo.id}`, {
      name: editingTodo.name,
      order: editingTodo.order,
    });
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
    if (isDeleted) {
      const newTodos = todos.filter((todo) => todo.id !== id);
      // Update order values for remaining todos
      const updatedTodos = newTodos.map((todo, index) => ({
        ...todo,
        order: index,
      }));
      // Save updated order to backend
      await ApiService.postReorder("/todos/reorder", updatedTodos);
      setTodos(updatedTodos);
    }
  };

  // Toggle todo completion
  const toggleTodoCompletion = async (id: number) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;
    await ApiService.update(`/todos/${id}`, {
      completed: !todo.completed,
      order: todo.order,
    });
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Handle drag end event
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Reorder the array
        const reorderedItems = arrayMove(items, oldIndex, newIndex);

        // Update order values
        const updatedItems = reorderedItems.map((item, index) => ({
          ...item,
          order: index,
        }));

        // Save the new order to backend
        ApiService.postReorder("/todos/reorder", updatedItems);

        return updatedItems;
      });
    }
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
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
              <SortableContext
                items={todos.map((todo) => todo.id)}
                strategy={verticalListSortingStrategy}
              >
                {todos.map((todo) => (
                  <SortableTodoRow
                    key={todo.id}
                    todo={todo}
                    toggleTodoCompletion={toggleTodoCompletion}
                    setEditingTodo={setEditingTodo}
                    deleteTodo={deleteTodo}
                  />
                ))}
              </SortableContext>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}
