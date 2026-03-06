#!/bin/bash
# Sync generated CSS into the injection utility
CSS_VAL=$(cat dist/index.css | sed 's/`/\\`/g')
# Use a temporary file to avoid complex sed delimiters
cat <<EOF > src/injectStyles.ts
// Standard Micro-CMS Style Injection
export const CSS_CONTENT = \`$CSS_VAL\`;

export const injectStyles = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById('mcms-crypto-styles')) return;

  const style = document.createElement('style');
  style.id = 'mcms-crypto-styles';
  style.textContent = CSS_CONTENT;
  document.head.appendChild(style);
};
EOF