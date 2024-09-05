//

import { asFunction, asValue } from "awilix";
import { expect, test } from "bun:test";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { set_injector, set_scope } from "./set_injector";

//

test("should empty todo list", async () => {
  const response = await test_app([]).request("/todos");
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual([]);
});

test("should get todo list", async () => {
  const response = await test_app([
    {
      id: "42",
      title: "foo",
      is_done: false,
    },
  ]).request("/todos");
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual([
    {
      id: "42",
      title: "foo",
      is_done: false,
    },
  ]);
});

test("should create todo", async () => {
  const body = new FormData();
  body.append("title", "foo");
  const response = await test_app([]).request("/todos", {
    method: "POST",
    body,
  });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    id: "0",
    title: "foo",
    is_done: false,
  });
});

test("should get todo 42", async () => {
  const response = await test_app([
    {
      id: "42",
      title: "foo",
      is_done: false,
    },
  ]).request("/todos/42");
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    id: "42",
    title: "foo",
    is_done: false,
  });
});

//

function test_app(initial_todos: Todo[]) {
  const todos = new Hono()
    .get(
      "/",
      set_scope<GetTodosCommand>((injector) => {
        injector.register({
          get_todos: asFunction(in_memory_get_todos_handler),
        });
      }),
      async ({ json, var: { injector } }) => {
        const { get_todos } = injector.cradle;
        const todos = await get_todos();
        return json(todos);
      },
    )
    .post(
      "/",
      validator("form", (value, c) => {
        const title = value["title"];
        if (!title || typeof title !== "string") {
          return c.text("Invalid!", 400);
        }
        return value as Pick<Todo, "title">;
      }),
      set_scope<CreateTodoCommand>((injector) => {
        injector.register({
          create_todo: asFunction(in_memory_create_todo_handler),
        });
      }),
      async ({ json, req, var: { injector } }) => {
        const form = req.valid("form");
        const { create_todo } = injector.cradle;
        const todo = await create_todo(form.title);
        return json(todo);
      },
    )
    .get(
      "/:id",
      set_scope<GetTodoByIdCommand>((injector) => {
        injector.register({
          get_todo_by_id: asFunction(in_memory_get_todo_by_id_handler),
        });
      }),
      async ({ json, notFound, req, var: { injector } }) => {
        const { get_todo_by_id } = injector.cradle;
        const id = req.param("id");
        const todo = await get_todo_by_id(id);
        if (!todo) return notFound();
        return json(todo);
      },
    );

  return new Hono()
    .use(
      set_injector<InMemoryDatabase>(function root_injector(injector) {
        injector.register({
          database: asValue({ todos: initial_todos }),
        });
      }),
    )
    .route("/todos", todos);
}

//#region CORE
interface Todo {
  id: string;
  title: string;
  is_done: boolean;
}

type CreateTodo = (title: string) => Promise<Todo>;

interface CreateTodoCommand {
  create_todo: CreateTodo;
}

type GetTodos = () => Promise<Todo[]>;
interface GetTodosCommand {
  get_todos: GetTodos;
}

type GetTodoById = (id: string) => Promise<Todo>;
interface GetTodoByIdCommand {
  get_todo_by_id: GetTodoById;
}
//#endregion

//#region INFRA
interface InMemoryDatabase {
  database: {
    todos: Todo[];
  };
}
//#endregion

//#region SHELL
function in_memory_get_todo_by_id_handler({
  database,
}: InMemoryDatabase): GetTodoById {
  return function get_todos(id) {
    const todo = database.todos.find((todo) => todo.id === id);
    return todo
      ? Promise.resolve(todo)
      : Promise.reject(new Error("Not found"));
  };
}
function in_memory_get_todos_handler({ database }: InMemoryDatabase): GetTodos {
  return function get_todos() {
    return Promise.resolve(database.todos);
  };
}
function in_memory_create_todo_handler({
  database,
}: InMemoryDatabase): CreateTodo {
  return function create_todo(title) {
    const todo = {
      id: String(database.todos.length),
      title,
      is_done: false,
    };
    database.todos.push(todo);
    return Promise.resolve(todo);
  };
}
//#endregion
