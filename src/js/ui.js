const SVGNS = 'http://www.w3.org/2000/svg';

const ICONS = {
  grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',
  shuffle: '<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>',
  rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  play: '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
  lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  'volume-on': '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  'volume-off': '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  medal: '<path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/>',
};

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'data') {
      for (const [dk, dv] of Object.entries(v)) node.dataset[dk] = dv;
    } else if (v === true) {
      node.setAttribute(k, '');
    } else if (v !== false && v != null) {
      node.setAttribute(k, v);
    }
  }
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    if (typeof child === 'string') node.appendChild(document.createTextNode(child));
    else node.appendChild(child);
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function icon(name, { size = 18, className = '' } = {}) {
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('icon');
  if (className) svg.classList.add(className);
  svg.innerHTML = ICONS[name] || '';
  return svg;
}

export function button({ label, iconName, variant = '', onClick, title, iconOnly = false, type = 'button' } = {}) {
  const classes = ['btn'];
  if (variant) classes.push(`btn--${variant}`);
  if (iconOnly) classes.push('btn--icon');
  const b = el('button', {
    type,
    class: classes.join(' '),
    title: title || label || '',
    'aria-label': iconOnly ? (title || label || '') : undefined,
  });
  if (iconName) b.appendChild(icon(iconName, { size: 16 }));
  if (label && !iconOnly) b.appendChild(el('span', { class: 'btn__label', text: label }));
  if (typeof onClick === 'function') b.addEventListener('click', onClick);
  return b;
}

export function createSelect({ options, value, onChange, icon: iconName, ariaLabel = '' }) {
  const trigger = el('button', {
    type: 'button',
    class: 'cselect',
    'aria-haspopup': 'listbox',
    'aria-expanded': 'false',
    'aria-label': ariaLabel,
  });
  if (iconName) trigger.appendChild(icon(iconName, { size: 14, className: 'cselect__icon' }));
  const labelEl = el('span', { class: 'cselect__label' });
  trigger.appendChild(labelEl);
  trigger.appendChild(icon('chevron', { size: 14, className: 'cselect__chev' }));

  const pop = el('div', { class: 'popover', role: 'listbox' });
  pop.hidden = true;

  const wrap = el('div', { class: 'cselect-wrap' }, [trigger]);

  let currentValue = value;
  let currentOptions = options || [];

  function renderLabel() {
    const opt = currentOptions.find((o) => o.value === currentValue);
    labelEl.textContent = opt ? opt.label : '';
  }

  function renderOptions() {
    clear(pop);
    for (const opt of currentOptions) {
      const isSel = opt.value === currentValue;
      const item = el('button', {
        type: 'button',
        class: `popover__item${isSel ? ' is-selected' : ''}`,
        role: 'option',
        'aria-selected': String(isSel),
      });
      item.appendChild(el('span', { class: 'popover__item-label', text: opt.label }));
      if (isSel) item.appendChild(icon('check', { size: 14, className: 'popover__item-check' }));
      item.addEventListener('click', () => {
        const changed = currentValue !== opt.value;
        currentValue = opt.value;
        renderLabel();
        renderOptions();
        close();
        if (changed && typeof onChange === 'function') onChange(currentValue);
      });
      pop.appendChild(item);
    }
  }

  function onDocClick(ev) {
    if (!wrap.contains(ev.target) && !pop.contains(ev.target)) close();
  }
  function onKey(ev) {
    if (ev.key === 'Escape') close();
  }
  function onReposition() {
    if (pop.hidden) return;
    positionPopover();
  }
  function positionPopover() {
    const rect = trigger.getBoundingClientRect();
    pop.style.minWidth = `${rect.width}px`;
    const margin = 8;
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;
    pop.style.maxHeight = '';
    pop.style.left = `${Math.max(8, Math.min(rect.left, viewportW - rect.width - 8))}px`;
    const spaceBelow = viewportH - rect.bottom - margin - 8;
    const spaceAbove = rect.top - margin - 8;
    const popH = pop.offsetHeight;
    if (popH > spaceBelow && spaceAbove > spaceBelow) {
      pop.style.top = '';
      pop.style.bottom = `${viewportH - rect.top + margin}px`;
      pop.style.maxHeight = `${spaceAbove}px`;
    } else {
      pop.style.bottom = '';
      pop.style.top = `${rect.bottom + margin}px`;
      pop.style.maxHeight = `${Math.max(160, spaceBelow)}px`;
    }
  }
  function open() {
    if (!pop.isConnected) document.body.appendChild(pop);
    pop.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    wrap.classList.add('is-open');
    positionPopover();
    setTimeout(() => {
      document.addEventListener('mousedown', onDocClick, true);
      document.addEventListener('keydown', onKey);
      window.addEventListener('resize', onReposition);
      window.addEventListener('scroll', onReposition, true);
    }, 0);
  }
  function close() {
    pop.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    wrap.classList.remove('is-open');
    document.removeEventListener('mousedown', onDocClick, true);
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onReposition);
    window.removeEventListener('scroll', onReposition, true);
  }

  trigger.addEventListener('click', (ev) => {
    ev.stopPropagation();
    if (pop.hidden) open(); else close();
  });

  renderLabel();
  renderOptions();

  return {
    element: wrap,
    getValue: () => currentValue,
    setValue(v) {
      currentValue = v;
      renderLabel();
      renderOptions();
    },
    setOptions(opts) {
      currentOptions = opts || [];
      if (!currentOptions.find((o) => o.value === currentValue)) {
        currentValue = currentOptions[0] ? currentOptions[0].value : null;
      }
      renderLabel();
      renderOptions();
    },
  };
}

export function createModal({ title = '', ariaLabel = '' } = {}) {
  const backdrop = el('div', { class: 'modal-backdrop', role: 'presentation' });
  backdrop.hidden = true;
  const titleEl = el('h2', { class: 'modal__title', text: title, id: `modal-title-${Math.random().toString(36).slice(2, 8)}` });
  const closeBtn = el('button', {
    type: 'button',
    class: 'modal__close',
    'aria-label': 'Close',
  });
  closeBtn.appendChild(icon('close', { size: 18 }));
  const header = el('div', { class: 'modal__header' }, [titleEl, closeBtn]);
  const body = el('div', { class: 'modal__body' });
  const dialog = el('div', {
    class: 'modal',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': titleEl.id,
    'aria-label': ariaLabel || title,
  }, [header, body]);
  backdrop.appendChild(dialog);

  function onKey(ev) {
    if (ev.key === 'Escape') close();
  }
  function onBackdrop(ev) {
    if (ev.target === backdrop) close();
  }
  function open() {
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add('is-open'));
    document.addEventListener('keydown', onKey);
    backdrop.addEventListener('mousedown', onBackdrop);
  }
  function close() {
    backdrop.classList.remove('is-open');
    document.removeEventListener('keydown', onKey);
    backdrop.removeEventListener('mousedown', onBackdrop);
    setTimeout(() => { backdrop.hidden = true; }, 180);
  }
  closeBtn.addEventListener('click', close);

  return {
    element: backdrop,
    body,
    setTitle(t) { titleEl.textContent = t; },
    open,
    close,
  };
}
