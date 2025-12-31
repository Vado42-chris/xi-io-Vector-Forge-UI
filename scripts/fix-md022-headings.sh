#!/bin/bash
# Agent BETA (Yang-Fixer) - Automated MD022 Fix Script
# Fixes: Headings should be surrounded by blank lines [Expected: 1; Actual: 0; Below]
# Product: xi-io VectorForge
# Fireteam: XIBALBA

echo "🔥 Agent BETA: Starting MD022 automated fix..."
echo "📊 Scanning markdown files..."

# Find all markdown files
find . -name "*.md" -type f | while read file; do
    # Skip node_modules and other ignored directories
    if [[ "$file" == *"node_modules"* ]] || [[ "$file" == *".git"* ]]; then
        continue
    fi
    
    # Create temp file
    temp_file="${file}.tmp"
    changed=false
    
    # Read file line by line
    prev_line=""
    prev_was_heading=false
    line_num=0
    
    while IFS= read -r line || [ -n "$line" ]; do
        line_num=$((line_num + 1))
        
        # Check if current line is a heading (starts with #)
        if [[ "$line" =~ ^#{1,6}[[:space:]] ]]; then
            # If previous line was also a heading or current line has content immediately after
            # We need to check the next line
            echo "$line" >> "$temp_file"
            prev_was_heading=true
            prev_line="$line"
        else
            # If previous line was a heading and current line is not blank and not a list/code block
            if [ "$prev_was_heading" = true ] && [[ -n "$line" ]] && [[ ! "$line" =~ ^[[:space:]]*[-*+][[:space:]] ]] && [[ ! "$line" =~ ^[[:space:]]*[0-9]+\.[[:space:]] ]] && [[ ! "$line" =~ ^[[:space:]]*``` ]]; then
                # Add blank line before current line
                echo "" >> "$temp_file"
                changed=true
            fi
            echo "$line" >> "$temp_file"
            prev_was_heading=false
            prev_line="$line"
        fi
    done < "$file"
    
    # Replace original if changed
    if [ "$changed" = true ]; then
        mv "$temp_file" "$file"
        echo "✅ Fixed: $file"
    else
        rm -f "$temp_file"
    fi
done

echo "🔥 Agent BETA: MD022 fix complete!"



