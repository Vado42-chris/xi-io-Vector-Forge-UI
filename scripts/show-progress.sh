#!/bin/bash
# Progress bar display for terminal visibility

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  INLINE STYLE REMOVAL - LIVE PROGRESS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat .progress-tracker 2>/dev/null || echo "Progress tracker not found"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

