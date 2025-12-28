/**
 * Default Animation Presets
 * Professional animation options for power users
 */

import { AnimationPreset } from '../types';

export const DEFAULT_ANIMATION_PRESETS: AnimationPreset[] = [
  // Entrance Animations
  {
    id: 'fade-in',
    name: 'Fade In',
    category: 'entrance',
    properties: { opacity: 0 },
    duration: 30,
    easing: 'ease-out'
  },
  {
    id: 'slide-in-left',
    name: 'Slide In Left',
    category: 'entrance',
    properties: { x: -200, opacity: 0 },
    duration: 30,
    easing: 'ease-out'
  },
  {
    id: 'slide-in-right',
    name: 'Slide In Right',
    category: 'entrance',
    properties: { x: 200, opacity: 0 },
    duration: 30,
    easing: 'ease-out'
  },
  {
    id: 'slide-in-up',
    name: 'Slide In Up',
    category: 'entrance',
    properties: { y: 200, opacity: 0 },
    duration: 30,
    easing: 'ease-out'
  },
  {
    id: 'slide-in-down',
    name: 'Slide In Down',
    category: 'entrance',
    properties: { y: -200, opacity: 0 },
    duration: 30,
    easing: 'ease-out'
  },
  {
    id: 'zoom-in',
    name: 'Zoom In',
    category: 'entrance',
    properties: { scaleX: 0, scaleY: 0, opacity: 0 },
    duration: 30,
    easing: 'ease-out'
  },
  {
    id: 'rotate-in',
    name: 'Rotate In',
    category: 'entrance',
    properties: { rotation: -180, opacity: 0 },
    duration: 30,
    easing: 'ease-out'
  },

  // Exit Animations
  {
    id: 'fade-out',
    name: 'Fade Out',
    category: 'exit',
    properties: { opacity: 0 },
    duration: 30,
    easing: 'ease-in'
  },
  {
    id: 'slide-out-left',
    name: 'Slide Out Left',
    category: 'exit',
    properties: { x: -200, opacity: 0 },
    duration: 30,
    easing: 'ease-in'
  },
  {
    id: 'slide-out-right',
    name: 'Slide Out Right',
    category: 'exit',
    properties: { x: 200, opacity: 0 },
    duration: 30,
    easing: 'ease-in'
  },
  {
    id: 'zoom-out',
    name: 'Zoom Out',
    category: 'exit',
    properties: { scaleX: 0, scaleY: 0, opacity: 0 },
    duration: 30,
    easing: 'ease-in'
  },

  // Emphasis Animations
  {
    id: 'pulse',
    name: 'Pulse',
    category: 'emphasis',
    properties: { scaleX: 1.2, scaleY: 1.2 },
    duration: 15,
    easing: 'ease-in-out'
  },
  {
    id: 'bounce',
    name: 'Bounce',
    category: 'emphasis',
    properties: { y: -50 },
    duration: 20,
    easing: 'bounce'
  },
  {
    id: 'shake',
    name: 'Shake',
    category: 'emphasis',
    properties: { x: 10 },
    duration: 10,
    easing: 'ease-in-out'
  },
  {
    id: 'rotate',
    name: 'Rotate',
    category: 'emphasis',
    properties: { rotation: 360 },
    duration: 30,
    easing: 'ease-in-out'
  },

  // Motion Animations
  {
    id: 'move-left',
    name: 'Move Left',
    category: 'motion',
    properties: { x: -100 },
    duration: 30,
    easing: 'ease-in-out'
  },
  {
    id: 'move-right',
    name: 'Move Right',
    category: 'motion',
    properties: { x: 100 },
    duration: 30,
    easing: 'ease-in-out'
  },
  {
    id: 'move-up',
    name: 'Move Up',
    category: 'motion',
    properties: { y: -100 },
    duration: 30,
    easing: 'ease-in-out'
  },
  {
    id: 'move-down',
    name: 'Move Down',
    category: 'motion',
    properties: { y: 100 },
    duration: 30,
    easing: 'ease-in-out'
  },
  {
    id: 'arc-motion',
    name: 'Arc Motion',
    category: 'motion',
    properties: { x: 100, y: -50 },
    duration: 30,
    easing: 'ease-in-out'
  }
];

