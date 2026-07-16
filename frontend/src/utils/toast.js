export const toast = (message, type = 'success') => {
  window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }));
};

export default toast;
