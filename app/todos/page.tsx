"use client";

import { useMutation, useQuery } from "react-query";
import { createTodo, getTodos } from "../actions/todo-actions";
import { useState } from "react";
import { queryClient } from "../config/ReactQueryProvider";

export default function TodosPage() {
  const [todoInput, setTodoInput] = useState("");

  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: () => getTodos(),
  });

  const createTodoMutation = useMutation({
    mutationFn: async () => {
      if (todoInput === "") throw new Error("TODO를 입력해주세요");
      return createTodo(todoInput);
    },
    onSuccess: (TODOS) => {
      //   todosQuery.refetch();
      queryClient.invalidateQueries(["todos"]);
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  return (
    <div>
      <h1>TODOS</h1>

      {/* TODO를 생성하는 부분 */}

      <input
        type="text"
        placeholder="Enter TODO"
        value={todoInput}
        onChange={(e) => setTodoInput(e.target.value)}
      />
      <button onClick={() => createTodoMutation.mutate()}>
        {createTodoMutation.isLoading ? "생성중..." : "투두 생성"}
      </button>

      {/* TODOS를 보여주는 부분 */}
      {todosQuery.isLoading && <p>Loading...</p>}
      {todosQuery.data &&
        todosQuery.data.map((todo, index) => <p key={index}>{todo}</p>)}
    </div>
  );
}
