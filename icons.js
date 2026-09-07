// Icônes en traits, dans le style de la charte (aucun emoji dans tout le projet).
export const icons = {
  link: `<svg class="icon" viewBox="0 0 24 24"><path d="M9 15l6-6"/><path d="M7 12l-2 2a4 4 0 0 0 5.6 5.6l2-2"/><path d="M17 12l2-2a4 4 0 0 0-5.6-5.6l-2 2"/></svg>`,
  mail: `<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`,
  lock: `<svg class="icon" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`,
  dice: `<svg class="icon" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>`,
  grid: `<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/></svg>`,
  columns: `<svg class="icon" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 4v16M15 4v16"/></svg>`,
  balloon: `<svg class="icon" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 1 2 11.6c-.3.9-.2 1.9.4 2.4"/><path d="M12 3a6 6 0 0 0-2 11.6c.3.9.2 1.9-.4 2.4"/><path d="M11 17h2"/><path d="M12 17v4"/></svg>`,
  pencil: `<svg class="icon" viewBox="0 0 24 24"><path d="M4 20l1-4 11-11 3 3-11 11-4 1z"/><path d="M14 6l3 3"/></svg>`,
  signOut: `<svg class="icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>`,
  arrowLeft: `<svg class="icon" viewBox="0 0 24 24"><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></svg>`,
  refresh: `<svg class="icon" viewBox="0 0 24 24"><path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.6"/><path d="M4 4v4.6h4.6"/><path d="M4 13a8 8 0 0 0 13.7 4.7L20 15.4"/><path d="M20 20v-4.6h-4.6"/></svg>`,
  copy: `<svg class="icon" viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>`,
  heart: `<svg class="icon" viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21.5 11c-2.5 4.6-9.5 9-9.5 9z"/></svg>`,
  check: `<svg class="icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>`,
  eraser: `<svg class="icon" viewBox="0 0 24 24"><path d="M18 13l-7 7H7l-4-4 9-9z"/><path d="M14 4l6 6-4 4-6-6z"/></svg>`
};

export function icon(name) {
  return icons[name] || "";
}
