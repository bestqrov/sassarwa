import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        };
    },
    useSearchParams() {
        return new URLSearchParams();
    },
    usePathname() {
        return '';
    },
}));

// Mock axios
jest.mock('axios');
global.axios = require('axios');

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    User: () => 'User',
    Mail: () => 'Mail',
    Phone: () => 'Phone',
    MapPin: () => 'MapPin',
    CreditCard: () => 'CreditCard',
    GraduationCap: () => 'GraduationCap',
    BookOpen: () => 'BookOpen',
    Calculator: () => 'Calculator',
    ShoppingCart: () => 'ShoppingCart',
    CheckCircle: () => 'CheckCircle',
    Save: () => 'Save',
    Printer: () => 'Printer',
    ArrowLeft: () => 'ArrowLeft',
    Users: () => 'Users',
    Search: () => 'Search',
    Filter: () => 'Filter',
    Plus: () => 'Plus',
    Edit: () => 'Edit',
    Trash2: () => 'Trash2',
    MoreVertical: () => 'MoreVertical',
    FileText: () => 'FileText',
    Download: () => 'Download',
    Eye: () => 'Eye',
    EyeOff: () => 'EyeOff',
    Settings: () => 'Settings',
    School: () => 'School',
    Palette: () => 'Palette',
    Database: () => 'Database',
    Check: () => 'Check',
    X: () => 'X',
    Sun: () => 'Sun',
    Moon: () => 'Moon',
    Monitor: () => 'Monitor',
    Shield: () => 'Shield',
    Lock: () => 'Lock',
    UserPlus: () => 'UserPlus',
    UserCog: () => 'UserCog',
    Calendar: () => 'Calendar',
    TrendingUp: () => 'TrendingUp',
    TrendingDown: () => 'TrendingDown',
    DollarSign: () => 'DollarSign',
    Briefcase: () => 'Briefcase',
    Building: () => 'Building',
    ArrowUpRight: () => 'ArrowUpRight',
    ArrowDownRight: () => 'ArrowDownRight',
    RefreshCw: () => 'RefreshCw',
    Wallet: () => 'Wallet',
    Upload: () => 'Upload',
    AlertCircle: () => 'AlertCircle',
    User as UserIcon: () => 'UserIcon',
    GraduationCap as GraduationCapIcon: () => 'GraduationCapIcon',
}));

// Global test utilities
global.testUtils = {
    renderWithProviders: (component: React.ReactElement) => {
        return require('@testing-library/react').render(component);
    },
};