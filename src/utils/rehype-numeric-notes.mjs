// rehype-numeric-notes.mjs: Converte automaticamente citações [1], [2] no texto do Markdown
// em links sobrescritos <sup><a href="#nota-N">[N]</a></sup> apontando para a seção de Referências/Notas.

function getTextContent(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value || '';
  if (Array.isArray(node.children)) {
    return node.children.map(getTextContent).join('');
  }
  return '';
}

export function rehypeNumericNotes() {
  return (tree) => {
    const noteTooltips = new Map();
    const refNodes = new Set();

    // 1. Localiza listas <ol> ou parágrafos [N] após cabeçalho de Referências / Notas / Works cited
    if (Array.isArray(tree.children)) {
      let inRefSection = false;
      for (const child of tree.children) {
        if (child.type === 'element' && /^h[1-6]$/.test(child.tagName)) {
          const headingText = getTextContent(child).trim();
          inRefSection = /refer[êe]ncias|notas|works\s+cited|fontes/i.test(headingText);
          continue;
        }

        if (!inRefSection || child.type !== 'element') continue;

        if (child.tagName === 'ol') {
          refNodes.add(child);
          child.properties = child.properties || {};
          const existingClass = child.properties.className || [];
          const classList = Array.isArray(existingClass)
            ? existingClass
            : String(existingClass).split(/\s+/).filter(Boolean);
          if (!classList.includes('references-list')) {
            classList.push('references-list');
          }
          child.properties.className = classList;

          let idx = 1;
          for (const li of child.children || []) {
            if (li.type === 'element' && li.tagName === 'li') {
              li.properties = li.properties || {};
              li.properties.id = `nota-${idx}`;
              const text = getTextContent(li).replace(/\s+/g, ' ').trim();
              if (text) {
                noteTooltips.set(String(idx), text);
              }
              idx++;
            }
          }
        } else if (child.tagName === 'p') {
          const pText = getTextContent(child).replace(/\s+/g, ' ').trim();
          const m = pText.match(/^\[(\d{1,3})\]\s*(.+)$/);
          if (m) {
            const [, num, rest] = m;
            refNodes.add(child);
            child.properties = child.properties || {};
            child.properties.id = `nota-${num}`;
            noteTooltips.set(num, rest);
          }
        }
      }
    }

    // 2. Percorre nós de texto do artigo convertendo [N] em <sup><a href="#nota-N">[N]</a></sup>
    const SKIP_TAGS = new Set(['a', 'code', 'pre', 'script', 'style', 'sup']);
    const NOTE_REGEX = /\[(\d{1,3})\]/g;

    function walk(node) {
      if (!node || !Array.isArray(node.children)) return;
      if (refNodes.has(node)) return;
      if (node.type === 'element' && SKIP_TAGS.has(node.tagName)) return;

      const newChildren = [];
      for (const child of node.children) {
        if (child.type === 'text' && NOTE_REGEX.test(child.value)) {
          NOTE_REGEX.lastIndex = 0;
          let lastIndex = 0;
          let match;
          while ((match = NOTE_REGEX.exec(child.value)) !== null) {
            const [fullMatch, num] = match;
            if (match.index > lastIndex) {
              newChildren.push({
                type: 'text',
                value: child.value.slice(lastIndex, match.index),
              });
            }

            const tooltip = noteTooltips.get(num);
            const aProps = { href: `#nota-${num}` };
            if (tooltip) {
              aProps.title = tooltip;
            }

            newChildren.push({
              type: 'element',
              tagName: 'sup',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'a',
                  properties: aProps,
                  children: [{ type: 'text', value: fullMatch }],
                },
              ],
            });

            lastIndex = match.index + fullMatch.length;
          }
          if (lastIndex < child.value.length) {
            newChildren.push({
              type: 'text',
              value: child.value.slice(lastIndex),
            });
          }
        } else {
          walk(child);
          newChildren.push(child);
        }
      }
      node.children = newChildren;
    }

    walk(tree);
  };
}
