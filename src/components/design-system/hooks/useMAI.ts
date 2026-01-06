import { useMemo } from 'react';

export type MAIAction = {
  id: string;
  label: string;
  priority: number;
  condition: (state: Record<string, any>) => boolean;
  action: () => void;
};

export type MAIContext = {
  state: Record<string, any>;
  actions: MAIAction[];
};

export const useMAI = (context: MAIContext) => {
  return useMemo(() => {
    const available = context.actions.filter((a) => {
      try {
        return a.condition(context.state);
      } catch {
        return false;
      }
    });

    available.sort((a, b) => b.priority - a.priority);
    const primary = available[0] || null;

    if (!primary) return null;

    return { label: primary.label, onClick: primary.action, disabled: false, loading: false };
  }, [context.state, context.actions]);
};

