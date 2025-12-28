#!/bin/bash
# Apply Xibalba Theme to All Components
# Replaces orange with blue, fixes visual weights, adds micro-interactions

echo "Applying Xibalba brand identity to all components..."

# Replace orange colors with Xibalba blue
find components -name "*.tsx" -type f -exec sed -i 's/#FF9800/#007acc/g' {} \;
find components -name "*.tsx" -type f -exec sed -i 's/primary-hover/#005a9e/g' {} \;
find components -name "*.tsx" -type f -exec sed -i 's/from-primary to-\[#E65100\]/from-\[var(--xibalba-accent)\] to-\[var(--xibalba-accent-hover)\]/g' {} \;
find components -name "*.tsx" -type f -exec sed -i 's/xi-vector-glow/rgba(0, 122, 204, 0.35)/g' {} \;

# Replace obsidian colors with Xibalba variables
find components -name "*.tsx" -type f -exec sed -i 's/bg-obsidian-200/bg-\[var(--xibalba-bg-primary)\]/g' {} \;
find components -name "*.tsx" -type f -exec sed -i 's/bg-obsidian-100/bg-\[var(--xibalba-bg-secondary)\]/g' {} \;
find components -name "*.tsx" -type f -exec sed -i 's/text-obsidian-500/text-\[var(--xibalba-text-muted)\]/g' {} \;

echo "✅ Xibalba theme applied"

