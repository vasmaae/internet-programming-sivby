#!/usr/bin/env bash
# Собирает все исходники проекта в один файл sources.txt

OUT="sources.txt"
ROOT="$(cd "$(dirname "$0")" && pwd)"

> "$OUT"

print_file() {
  local path="$1"
  local rel="${path#$ROOT/}"
  echo "================================================================" >> "$OUT"
  echo "FILE: $rel" >> "$OUT"
  echo "================================================================" >> "$OUT"
  cat "$path" >> "$OUT"
  echo -e "\n" >> "$OUT"
}

# Backend: Java sources
find "$ROOT/backend/src" -name "*.java" | sort | while read -r f; do
  print_file "$f"
done

# Backend: resources
find "$ROOT/backend/src/main/resources" -type f | sort | while read -r f; do
  print_file "$f"
done

# Backend: build files
for f in "$ROOT/backend/build.gradle" "$ROOT/backend/settings.gradle"; do
  [ -f "$f" ] && print_file "$f"
done

# Frontend: sources (src/)
find "$ROOT/frontend/src" -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" \) | sort | while read -r f; do
  print_file "$f"
done

# Frontend: root config files
for f in "$ROOT/frontend/index.html" "$ROOT/frontend/vite.config.js" "$ROOT/frontend/package.json"; do
  [ -f "$f" ] && print_file "$f"
done

echo "Готово: $OUT ($(wc -l < "$OUT") строк)"
