import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import notifications from '../lib/utils/notifications';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
    __esModule: true,
    default: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        dismiss: jest.fn(),
        promise: jest.fn(),
        loading: jest.fn(() => 'toast-id'),
    },
}));

describe('notifications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call toast.success for success notification', () => {
        const mockToast = require('react-hot-toast').default;
        notifications.success('Success message');

        expect(mockToast.success).toHaveBeenCalledWith('Success message');
    });

    it('should call toast.error for error notification', () => {
        const mockToast = require('react-hot-toast').default;
        notifications.error('Error message');

        expect(mockToast.error).toHaveBeenCalledWith('Error message');
    });

    it('should call toast with custom icon for info notification', () => {
        const mockToast = require('react-hot-toast').default;
        notifications.info('Info message');

        expect(mockToast).toHaveBeenCalledWith('Info message', {
            icon: 'ℹ️',
        });
    });

    it('should call toast with warning styles for warning notification', () => {
        const mockToast = require('react-hot-toast').default;
        notifications.warning('Warning message');

        expect(mockToast).toHaveBeenCalledWith('Warning message', {
            icon: '⚠️',
            style: {
                background: '#F59E0B',
                color: '#fff',
            },
        });
    });

    it('should call toast.loading for loading notification', () => {
        const mockToast = require('react-hot-toast').default;
        const result = notifications.loading('Loading message');

        expect(mockToast.loading).toHaveBeenCalledWith('Loading message');
        expect(result).toBe('toast-id');
    });

    it('should call toast.dismiss for dismiss notification', () => {
        const mockToast = require('react-hot-toast').default;
        notifications.dismiss('toast-id');

        expect(mockToast.dismiss).toHaveBeenCalledWith('toast-id');
    });

    it('should call toast.promise for promise notification', async () => {
        const mockToast = require('react-hot-toast').default;
        const mockPromise = Promise.resolve('success');
        const messages = {
            loading: 'Loading...',
            success: 'Success!',
            error: 'Error!',
        };

        await notifications.promise(mockPromise, messages);

        expect(mockToast.promise).toHaveBeenCalledWith(mockPromise, messages);
    });
});