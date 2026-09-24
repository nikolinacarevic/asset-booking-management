import { toast, type ToastOptions } from 'react-toastify';

const options: ToastOptions = {
  position: 'bottom-right',
  autoClose: 3000,
  theme: 'colored',
};

export const Toast = {
  success(message: string) {
    toast.success(message, options);
  },

  // Errors stay longer so there's time to read them.
  error(message: string) {
    toast.error(message, { ...options, autoClose: 6000 });
  },

  info(message: string) {
    toast.info(message, options);
  },

  warning(message: string) {
    toast.warning(message, options);
  },
};
