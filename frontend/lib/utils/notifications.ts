import toast from 'react-hot-toast';

export const notifications = {
    success: (message: string) => {
        toast.success(message);
    },

    error: (message: string) => {
        toast.error(message);
    },

    info: (message: string) => {
        toast(message, {
            icon: 'ℹ️',
        });
    },

    warning: (message: string) => {
        toast(message, {
            icon: '⚠️',
            style: {
                background: '#F59E0B',
                color: '#fff',
            },
        });
    },

    loading: (message: string) => {
        return toast.loading(message);
    },

    dismiss: (toastId?: string) => {
        toast.dismiss(toastId);
    },

    promise: async <T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return toast.promise(promise, messages);
    },
};

export default notifications;