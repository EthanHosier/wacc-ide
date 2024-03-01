import { create } from "zustand";

export const ideStore = create((set) => ({
  output: "",
  error: "",
  exitCode: null,
  setOutput: (output: string) => set({ output }),
  setError: (error: string) => set({ error }),
  setExitCode: (exitCode: number) => set({ exitCode }),
  reset: () => set({ output: "", error: "", exitCode: null }),
}));
