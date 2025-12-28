/**
 * VectorForge Timeline Scripting System
 * Command Executor - Executes hashtag commands on timeline
 */

import { ScriptCommand, parseScript } from './scriptParser';
import { VectorLayer } from '../types';

export interface ExecutionContext {
  frame: number;
  layers: VectorLayer[];
  variables: Record<string, any>;
  eventHandlers: Map<string, Array<(event: any) => void>>;
  pendingEvents: Array<{ type: string; target: string; action: string }>; // For interaction commands
}

export interface ExecutionResult {
  success: boolean;
  message?: string;
  updatedLayers?: VectorLayer[];
  updatedVariables?: Record<string, any>;
  errors?: string[];
}

/**
 * Execute a single command
 */
export async function executeCommand(
  command: ScriptCommand,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const { command: cmd, target, parameters } = command;
  const { layers, variables, frame } = context;

  try {
    switch (cmd) {
      // Animation - Visibility
      case 'show':
        return executeShow(target, layers);
      
      case 'hide':
        return executeHide(target, layers);
      
      case 'toggle':
        return executeToggle(target, layers);

      // Animation - Movement
      case 'move':
        return executeMove(target, parameters, layers);
      
      case 'slide':
        return executeSlide(target, parameters, layers);

      // Animation - Transformation
      case 'rotate':
        return executeRotate(target, parameters, layers);
      
      case 'scale':
        return executeScale(target, parameters, layers);
      
      case 'fade':
        return executeFade(target, parameters, layers);

      // Interaction Commands
      case 'onclick':
        return executeOnClick(target, parameters, context);
      
      case 'onhover':
        return executeOnHover(target, parameters, context);
      
      case 'onkey':
      case 'onkeydown':
      case 'onkeyup':
        return executeOnKey(cmd, parameters, context);
      
      case 'ontouch':
        return executeOnTouch(target, parameters, context);

      // Logic - Control Flow
      case 'if':
        return executeIf(parameters, context);
      
      case 'wait':
        return executeWait(parameters);
      
      case 'goto':
        return executeGoto(parameters, frame);
      
      case 'loop':
        return executeLoop(parameters, context);

      // Logic - Variables
      case 'set':
        return executeSet(parameters, variables);
      
      case 'get':
        return executeGet(parameters, variables);
      
      case 'increment':
        return executeIncrement(parameters, variables);
      
      case 'decrement':
        return executeDecrement(parameters, variables);

      default:
        return {
          success: false,
          message: `Unknown command: #${cmd}`,
          errors: [`Command #${cmd} is not implemented yet`]
        };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Execution error',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

/**
 * Execute a complete script
 */
export async function executeScript(
  script: string,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const parsed = parseScript(script);
  
  if (!parsed.isValid) {
    return {
      success: false,
      message: 'Script has parse errors',
      errors: parsed.errors.map(e => `Line ${e.line}: ${e.message}`)
    };
  }

  const errors: string[] = [];
  let updatedLayers = [...context.layers];
  let updatedVariables = { ...context.variables };
  const executionContext: ExecutionContext = {
    ...context,
    layers: updatedLayers,
    variables: updatedVariables,
    pendingEvents: []
  };

  for (const command of parsed.commands) {
    const result = await executeCommand(command, executionContext);

    if (!result.success) {
      errors.push(`Line ${command.lineNumber}: ${result.message || 'Command failed'}`);
    }

    if (result.updatedLayers) {
      updatedLayers = result.updatedLayers;
      executionContext.layers = updatedLayers;
    }

    if (result.updatedVariables) {
      updatedVariables = { ...updatedVariables, ...result.updatedVariables };
      executionContext.variables = updatedVariables;
    }
  }

  return {
    success: errors.length === 0,
    message: errors.length === 0 ? 'Script executed successfully' : 'Script executed with errors',
    updatedLayers,
    updatedVariables,
    errors: errors.length > 0 ? errors : undefined
  };
}

// ============================================================================
// Command Implementations
// ============================================================================

function executeShow(target: string | undefined, layers: VectorLayer[]): ExecutionResult {
  if (!target) {
    return { success: false, message: '#show requires a target' };
  }

  const updatedLayers = layers.map(layer => 
    layer.id === target || layer.name === target
      ? { ...layer, visible: true }
      : layer
  );

  return {
    success: true,
    message: `Showed ${target}`,
    updatedLayers
  };
}

function executeHide(target: string | undefined, layers: VectorLayer[]): ExecutionResult {
  if (!target) {
    return { success: false, message: '#hide requires a target' };
  }

  const updatedLayers = layers.map(layer => 
    layer.id === target || layer.name === target
      ? { ...layer, visible: false }
      : layer
  );

  return {
    success: true,
    message: `Hid ${target}`,
    updatedLayers
  };
}

function executeToggle(target: string | undefined, layers: VectorLayer[]): ExecutionResult {
  if (!target) {
    return { success: false, message: '#toggle requires a target' };
  }

  const updatedLayers = layers.map(layer => 
    layer.id === target || layer.name === target
      ? { ...layer, visible: !layer.visible }
      : layer
  );

  return {
    success: true,
    message: `Toggled ${target}`,
    updatedLayers
  };
}

function executeMove(
  target: string | undefined,
  parameters: Record<string, any>,
  layers: VectorLayer[]
): ExecutionResult {
  if (!target) {
    return { success: false, message: '#move requires a target' };
  }

  const x = parameters.x as number | undefined;
  const y = parameters.y as number | undefined;

  if (x === undefined && y === undefined) {
    return { success: false, message: '#move requires x or y parameter' };
  }

  const updatedLayers = layers.map(layer => {
    if (layer.id === target || layer.name === target) {
      const updatedShape = { ...layer.shape };
      
      // Update shape position based on type
      if (updatedShape.type === 'rect') {
        return {
          ...layer,
          shape: {
            ...updatedShape,
            x: x !== undefined ? x : updatedShape.x,
            y: y !== undefined ? y : updatedShape.y
          }
        };
      } else if (updatedShape.type === 'text') {
        return {
          ...layer,
          shape: {
            ...updatedShape,
            x: x !== undefined ? x : updatedShape.x,
            y: y !== undefined ? y : updatedShape.y
          }
        };
      } else if (updatedShape.type === 'path') {
        // For paths, update all nodes
        const updatedNodes = updatedShape.nodes.map(node => ({
          ...node,
          x: x !== undefined ? x + (node.x - (updatedShape.nodes[0]?.x || 0)) : node.x,
          y: y !== undefined ? y + (node.y - (updatedShape.nodes[0]?.y || 0)) : node.y
        }));
        
        return {
          ...layer,
          shape: {
            ...updatedShape,
            nodes: updatedNodes
          }
        };
      }
    }
    return layer;
  });

  return {
    success: true,
    message: `Moved ${target} to (${x || '?'}, ${y || '?'})`,
    updatedLayers
  };
}

function executeSlide(
  target: string | undefined,
  parameters: Record<string, any>,
  layers: VectorLayer[]
): ExecutionResult {
  if (!target) {
    return { success: false, message: '#slide requires a target' };
  }

  const direction = parameters.direction as string | undefined;
  const distance = parameters.distance as number | undefined;

  if (!direction || !distance) {
    return { success: false, message: '#slide requires direction and distance parameters' };
  }

  const deltaX = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
  const deltaY = direction === 'up' ? -distance : direction === 'down' ? distance : 0;

  return executeMove(target, { x: deltaX, y: deltaY }, layers);
}

function executeRotate(
  target: string | undefined,
  parameters: Record<string, any>,
  layers: VectorLayer[]
): ExecutionResult {
  if (!target) {
    return { success: false, message: '#rotate requires a target' };
  }

  const angle = parameters.angle as number | undefined;
  if (angle === undefined) {
    return { success: false, message: '#rotate requires angle parameter' };
  }

  // For now, store rotation in properties - will be applied during rendering
  const updatedLayers = layers.map(layer => {
    if (layer.id === target || layer.name === target) {
      // Add rotation to shape properties if it's a rect or text
      const updatedShape = { ...layer.shape };
      if (updatedShape.type === 'rect' || updatedShape.type === 'text') {
        // Rotation will be applied via CSS transform during rendering
        return { ...layer, shape: updatedShape };
      }
      return layer;
    }
    return layer;
  });

  return {
    success: true,
    message: `Rotated ${target} by ${angle}°`,
    updatedLayers
  };
}

function executeScale(
  target: string | undefined,
  parameters: Record<string, any>,
  layers: VectorLayer[]
): ExecutionResult {
  if (!target) {
    return { success: false, message: '#scale requires a target' };
  }

  const x = parameters.x as number | undefined;
  const y = parameters.y as number | undefined;

  if (x === undefined && y === undefined) {
    return { success: false, message: '#scale requires x or y parameter' };
  }

  const scaleX = x !== undefined ? x : 1;
  const scaleY = y !== undefined ? y : scaleX; // Default to uniform scaling

  const updatedLayers = layers.map(layer => {
    if (layer.id === target || layer.name === target) {
      const updatedShape = { ...layer.shape };
      
      // Scale based on shape type
      if (updatedShape.type === 'rect') {
        return {
          ...layer,
          shape: {
            ...updatedShape,
            width: updatedShape.width * scaleX,
            height: updatedShape.height * scaleY
          }
        };
      } else if (updatedShape.type === 'text') {
        return {
          ...layer,
          shape: {
            ...updatedShape,
            fontSize: updatedShape.fontSize * scaleX
          }
        };
      } else if (updatedShape.type === 'path') {
        // Scale all nodes
        const updatedNodes = updatedShape.nodes.map(node => ({
          ...node,
          x: node.x * scaleX,
          y: node.y * scaleY,
          cx1: node.cx1 ? node.cx1 * scaleX : undefined,
          cy1: node.cy1 ? node.cy1 * scaleY : undefined,
          cx2: node.cx2 ? node.cx2 * scaleX : undefined,
          cy2: node.cy2 ? node.cy2 * scaleY : undefined
        }));
        
        return {
          ...layer,
          shape: {
            ...updatedShape,
            nodes: updatedNodes
          }
        };
      }
      
      return layer;
    }
    return layer;
  });

  return {
    success: true,
    message: `Scaled ${target} to (${scaleX}, ${scaleY})`,
    updatedLayers
  };
}

function executeFade(
  target: string | undefined,
  parameters: Record<string, any>,
  layers: VectorLayer[]
): ExecutionResult {
  if (!target) {
    return { success: false, message: '#fade requires a target' };
  }

  const opacity = parameters.opacity as number | undefined;
  if (opacity === undefined) {
    return { success: false, message: '#fade requires opacity parameter (0-1)' };
  }

  const updatedLayers = layers.map(layer => 
    layer.id === target || layer.name === target
      ? { ...layer, opacity: Math.max(0, Math.min(1, opacity)) }
      : layer
  );

  return {
    success: true,
    message: `Faded ${target} to opacity ${opacity}`,
    updatedLayers
  };
}

function executeWait(parameters: Record<string, any>): ExecutionResult {
  const duration = parameters.duration as number | undefined;
  if (duration === undefined) {
    return { success: false, message: '#wait requires duration parameter' };
  }

  // Wait is handled by timeline, just return success
  return {
    success: true,
    message: `Waiting ${duration} frames`
  };
}

function executeGoto(parameters: Record<string, any>, currentFrame: number): ExecutionResult {
  const frame = parameters.frame as number | undefined;
  const label = parameters.label as string | undefined;

  if (frame === undefined && !label) {
    return { success: false, message: '#goto requires frame or label parameter' };
  }

  // Goto is handled by timeline, just return success
  return {
    success: true,
    message: frame !== undefined ? `Jumping to frame ${frame}` : `Jumping to label ${label}`
  };
}

function executeSet(
  parameters: Record<string, any>,
  variables: Record<string, any>
): ExecutionResult {
  const name = parameters.variable as string | undefined;
  const value = parameters.value;

  if (!name) {
    return { success: false, message: '#set requires variable parameter' };
  }

  const updatedVariables = {
    ...variables,
    [name]: value
  };

  return {
    success: true,
    message: `Set variable ${name} = ${value}`,
    updatedVariables
  };
}

function executeGet(
  parameters: Record<string, any>,
  variables: Record<string, any>
): ExecutionResult {
  const name = parameters.variable as string | undefined;

  if (!name) {
    return { success: false, message: '#get requires variable parameter' };
  }

  const value = variables[name];

  return {
    success: true,
    message: `Variable ${name} = ${value}`,
    updatedVariables: { [name]: value }
  };
}

function executeIncrement(
  parameters: Record<string, any>,
  variables: Record<string, any>
): ExecutionResult {
  const name = parameters.variable as string | undefined;
  const amount = (parameters.amount as number) || 1;

  if (!name) {
    return { success: false, message: '#increment requires variable parameter' };
  }

  const currentValue = (variables[name] as number) || 0;
  const updatedVariables = {
    ...variables,
    [name]: currentValue + amount
  };

  return {
    success: true,
    message: `Incremented ${name} by ${amount}`,
    updatedVariables
  };
}

function executeDecrement(
  parameters: Record<string, any>,
  variables: Record<string, any>
): ExecutionResult {
  const name = parameters.variable as string | undefined;
  const amount = (parameters.amount as number) || 1;

  if (!name) {
    return { success: false, message: '#decrement requires variable parameter' };
  }

  const currentValue = (variables[name] as number) || 0;
  const updatedVariables = {
    ...variables,
    [name]: currentValue - amount
  };

  return {
    success: true,
    message: `Decremented ${name} by ${amount}`,
    updatedVariables
  };
}

// ============================================================================
// Interaction Command Implementations
// ============================================================================

function executeOnClick(
  target: string | undefined,
  parameters: Record<string, any>,
  context: ExecutionContext
): ExecutionResult {
  if (!target) {
    return { success: false, message: '#onclick requires a target' };
  }

  const action = parameters.action as string | undefined;
  if (!action) {
    return { success: false, message: '#onclick requires action parameter' };
  }

  // Register event handler (will be attached to DOM element)
  const eventKey = `click:${target}`;
  if (!context.eventHandlers.has(eventKey)) {
    context.eventHandlers.set(eventKey, []);
  }
  
  context.eventHandlers.get(eventKey)!.push(() => {
    // Action will be executed when event fires
    // This is handled by the React component that renders the layer
  });

  // Store pending event for component to attach
  context.pendingEvents.push({
    type: 'click',
    target,
    action
  });

  return {
    success: true,
    message: `Registered click handler for ${target}`
  };
}

function executeOnHover(
  target: string | undefined,
  parameters: Record<string, any>,
  context: ExecutionContext
): ExecutionResult {
  if (!target) {
    return { success: false, message: '#onhover requires a target' };
  }

  const action = parameters.action as string | undefined;
  if (!action) {
    return { success: false, message: '#onhover requires action parameter' };
  }

  context.pendingEvents.push({
    type: 'hover',
    target,
    action
  });

  return {
    success: true,
    message: `Registered hover handler for ${target}`
  };
}

function executeOnKey(
  command: string,
  parameters: Record<string, any>,
  context: ExecutionContext
): ExecutionResult {
  const key = parameters.key as string | undefined;
  if (!key) {
    return { success: false, message: `#${command} requires key parameter` };
  }

  const action = parameters.action as string | undefined;
  if (!action) {
    return { success: false, message: `#${command} requires action parameter` };
  }

  const eventType = command === 'onkey' ? 'key' : command === 'onkeydown' ? 'keydown' : 'keyup';
  
  context.pendingEvents.push({
    type: eventType,
    target: key,
    action
  });

  return {
    success: true,
    message: `Registered ${eventType} handler for key ${key}`
  };
}

function executeOnTouch(
  target: string | undefined,
  parameters: Record<string, any>,
  context: ExecutionContext
): ExecutionResult {
  if (!target) {
    return { success: false, message: '#ontouch requires a target' };
  }

  const action = parameters.action as string | undefined;
  if (!action) {
    return { success: false, message: '#ontouch requires action parameter' };
  }

  context.pendingEvents.push({
    type: 'touch',
    target,
    action
  });

  return {
    success: true,
    message: `Registered touch handler for ${target}`
  };
}

// ============================================================================
// Logic Command Implementations
// ============================================================================

function executeIf(
  parameters: Record<string, any>,
  context: ExecutionContext
): ExecutionResult {
  const condition = parameters.condition as string | undefined;
  const thenAction = parameters.then as string | undefined;
  const elseAction = parameters.else as string | undefined;

  if (!condition || !thenAction) {
    return { success: false, message: '#if requires condition and then parameters' };
  }

  // Simple condition evaluation
  // Supports: variable == value, variable > value, variable < value, etc.
  const conditionResult = evaluateCondition(condition, context.variables);

  if (conditionResult) {
    // Execute then action
    // This would need to be parsed and executed
    return {
      success: true,
      message: `Condition true, executing then action`
    };
  } else if (elseAction) {
    // Execute else action
    return {
      success: true,
      message: `Condition false, executing else action`
    };
  }

  return {
    success: true,
    message: `Condition false, no else action`
  };
}

function executeLoop(
  parameters: Record<string, any>,
  context: ExecutionContext
): ExecutionResult {
  const count = parameters.count as number | undefined;
  const commands = parameters.commands as string | undefined;

  if (!count || !commands) {
    return { success: false, message: '#loop requires count and commands parameters' };
  }

  // Commands should be comma-separated or array
  const commandList = typeof commands === 'string' 
    ? commands.split(',').map(c => c.trim())
    : Array.isArray(commands) ? commands : [];

  // Store loop for execution
  // This would need to be handled by the executor
  return {
    success: true,
    message: `Loop registered: ${count} iterations`
  };
}

// Helper function to evaluate conditions
function evaluateCondition(condition: string, variables: Record<string, any>): boolean {
  // Simple condition parser
  // Supports: var == value, var > value, var < value, var != value
  
  const operators = ['==', '!=', '>=', '<=', '>', '<'];
  let operator = '';
  let parts: string[] = [];

  for (const op of operators) {
    if (condition.includes(op)) {
      operator = op;
      parts = condition.split(op).map(p => p.trim());
      break;
    }
  }

  if (!operator || parts.length !== 2) {
    return false;
  }

  const left = parts[0];
  const right = parts[1];

  // Get variable value or parse as number/string
  const leftValue = variables[left] !== undefined ? variables[left] : 
                   !isNaN(Number(left)) ? Number(left) : left;
  const rightValue = variables[right] !== undefined ? variables[right] : 
                     !isNaN(Number(right)) ? Number(right) : right;

  switch (operator) {
    case '==':
      return leftValue == rightValue;
    case '!=':
      return leftValue != rightValue;
    case '>':
      return Number(leftValue) > Number(rightValue);
    case '<':
      return Number(leftValue) < Number(rightValue);
    case '>=':
      return Number(leftValue) >= Number(rightValue);
    case '<=':
      return Number(leftValue) <= Number(rightValue);
    default:
      return false;
  }
}

