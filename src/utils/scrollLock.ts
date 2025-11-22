export function lockScroll() {
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollBarWidth}px`;
}

export function unlockScroll() {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}