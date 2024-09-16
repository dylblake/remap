// src/hooks/useUndoRedo.ts
import { useState, useCallback } from "react";

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useUndoRedo<T>(initialState: T) {
  const [state, setState] = useState<UndoRedoState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    setState((currentState) => {
      const { past, present, future } = currentState;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setState((currentState) => {
      const { past, present, future } = currentState;
      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);

  const setPresent = useCallback(
    (newPresent: T) => {
      setState((currentState) => {
        const { past, present } = currentState;
        if (newPresent === present) {
          return currentState;
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        };
      });
    },
    [setState]
  );

  const saveChanges = useCallback(() => {
    // This function would handle saving the present state to the server
    console.log("Saving current state to server:", state.present);
    // You would replace this with an actual API call or save logics
  }, [state.present]);

  return {
    state: state.present,
    setPresent,
    undo,
    redo,
    canUndo,
    canRedo,
    saveChanges,
    isSaving: false, // You can add state handling for saving if needed
  };
}

export default useUndoRedo;
