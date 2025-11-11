#!/usr/bin/env bash
set -euo pipefail
OUT="mobile_snapshot.md"; >"$OUT"

add(){ t="$1"; p="$2"; [ -f "$p" ] || return 0
  ext="${p##*.}"; case "$ext" in ts|tsx|js|json|md|yml|yaml|sh|xml) f="$ext";; *) f="txt";; esac
  { echo -e "\n\n## $t — \`$p\`\n"; echo '```'"$f"; sed 's/\t/    /g' "$p"; echo '```'; } >>"$OUT"
}

echo "# Mobile Snapshot ($(date))" >>"$OUT"

add "package.json (mobile)"   "mobile/package.json"
add "app.config.ts"           "mobile/app.config.ts"
add "app.json"                "mobile/app.json"
add "tsconfig.json (mobile)"  "mobile/tsconfig.json"
add "metro.config.js"         "mobile/metro.config.js"
add "babel.config.js"         "mobile/babel.config.js"

add "api.ts"                  "mobile/src/api.ts"
add "AuthContext"             "mobile/src/context/AuthContext.tsx"
add "Navigation index"        "mobile/src/navigation/index.tsx"
add "Tabs"                    "mobile/src/navigation/tabs.tsx"
add "HomeScreen"              "mobile/src/screens/HomeScreen.tsx"
add "DayLogList"              "mobile/src/components/DayLogList.tsx"
add "home/api"                "mobile/src/features/home/api.ts"
add "types/api"               "mobile/src/types/api.ts"

echo -e "\n\nDone → $OUT" >>"$OUT"
echo "Generated: $OUT"
