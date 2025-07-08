/**
 * Toast notification utility
 * Simple toast implementation for notifications
 */

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  type?: ToastType;
}

class ToastManager {
  private toasts: Map<string, HTMLDivElement> = new Map();
  private container: HTMLDivElement | null = null;

  constructor() {
    this.createContainer();
  }

  private createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.position = 'fixed';
    this.container.style.top = '20px';
    this.container.style.right = '20px';
    this.container.style.zIndex = '9999';
    this.container.style.display = 'flex';
    this.container.style.flexDirection = 'column';
    this.container.style.gap = '10px';
    this.container.style.maxWidth = '400px';
    document.body.appendChild(this.container);
  }

  private getToastStyles(type: ToastType): string {
    const baseStyles = `
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid;
      min-width: 300px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      animation: toastSlideIn 0.3s ease-out;
    `;

    const typeStyles = {
      success: 'background-color: #f0f9ff; border-color: #22c55e; color: #166534;',
      error: 'background-color: #fef2f2; border-color: #ef4444; color: #991b1b;',
      warning: 'background-color: #fffbeb; border-color: #f59e0b; color: #92400e;',
      info: 'background-color: #f0f9ff; border-color: #3b82f6; color: #1e40af;'
    };

    return baseStyles + typeStyles[type];
  }

  show(message: string, options: ToastOptions = {}) {
    const {
      title,
      description,
      duration = 4000,
      type = 'info'
    } = options;

    const toastId = Date.now().toString();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.style.cssText = this.getToastStyles(type);

    const content = `
      ${title ? `<div style="font-weight: 600; margin-bottom: 4px;">${title}</div>` : ''}
      <div>${description || message}</div>
    `;

    toast.innerHTML = content;

    // Add animation styles
    if (!document.querySelector('#toast-animation-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'toast-animation-styles';
      styleSheet.textContent = `
        @keyframes toastSlideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes toastSlideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // Add click to dismiss
    toast.addEventListener('click', () => {
      this.dismiss(toastId);
    });

    this.toasts.set(toastId, toast);
    this.container?.appendChild(toast);

    // Auto dismiss
    setTimeout(() => {
      this.dismiss(toastId);
    }, duration);

    return toastId;
  }

  dismiss(toastId: string) {
    const toast = this.toasts.get(toastId);
    if (toast) {
      toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
      setTimeout(() => {
        toast.remove();
        this.toasts.delete(toastId);
      }, 300);
    }
  }

  success(message: string, options: Omit<ToastOptions, 'type'> = {}) {
    return this.show(message, { ...options, type: 'success' });
  }

  error(message: string, options: Omit<ToastOptions, 'type'> = {}) {
    return this.show(message, { ...options, type: 'error' });
  }

  warning(message: string, options: Omit<ToastOptions, 'type'> = {}) {
    return this.show(message, { ...options, type: 'warning' });
  }

  info(message: string, options: Omit<ToastOptions, 'type'> = {}) {
    return this.show(message, { ...options, type: 'info' });
  }
}

// Export singleton instance
export const toast = new ToastManager();
