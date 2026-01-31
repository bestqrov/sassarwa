import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InscriptionForm from '../components/forms/InscriptionForm';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('InscriptionForm', () => {
    beforeEach(() => {
        mockedAxios.post.mockClear();
    });

    it('renders the form with default SOUTIEN type', () => {
        render(<InscriptionForm />);
        expect(screen.getByText('Inscription Étudiant')).toBeInTheDocument();
        expect(screen.getByLabelText('Soutien Scolaire')).toBeChecked();
        expect(screen.getByLabelText('Formation Professionnelle')).not.toBeChecked();
    });

    it('switches between SOUTIEN and FORMATION types', async () => {
        const user = userEvent.setup();
        render(<InscriptionForm />);

        // Initially SOUTIEN
        expect(screen.getByLabelText('Soutien Scolaire')).toBeChecked();

        // Switch to FORMATION
        await user.click(screen.getByLabelText('Formation Professionnelle'));
        expect(screen.getByLabelText('Formation Professionnelle')).toBeChecked();
        expect(screen.getByLabelText('Soutien Scolaire')).not.toBeChecked();

        // Check FORMATION specific fields appear
        expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
        expect(screen.getByText('Détails de la Formation')).toBeInTheDocument();
    });

    it('shows validation errors for required fields', async () => {
        const user = userEvent.setup();
        render(<InscriptionForm />);

        const submitButton = screen.getByText('Inscrire l\'Étudiant');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Le champ name est requis')).toBeInTheDocument();
        });
    });

    it('submits the form successfully for SOUTIEN type', async () => {
        const user = userEvent.setup();
        const mockStudent = { id: '1', name: 'John', surname: 'Doe' };

        mockedAxios.post
            .mockResolvedValueOnce({ data: { data: mockStudent } })
            .mockResolvedValueOnce({ data: {} });

        render(<InscriptionForm />);

        // Fill required fields
        await user.type(screen.getByLabelText('Nom *'), 'John');
        await user.type(screen.getByLabelText('Prénom *'), 'Doe');
        await user.type(screen.getByLabelText('Téléphone *'), '0612345678');
        await user.selectOptions(screen.getByLabelText('Catégorie *'), 'Soutien Scolaire Primaire');
        await user.type(screen.getByLabelText('Montant (MAD) *'), '1000');

        const submitButton = screen.getByText('Inscrire l\'Étudiant');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(2);
            expect(screen.getByText('Inscription Réussie !')).toBeInTheDocument();
        });
    });

    it('submits the form successfully for FORMATION type', async () => {
        const user = userEvent.setup();
        const mockStudent = { id: '1', name: 'Jane', surname: 'Smith' };

        mockedAxios.post
            .mockResolvedValueOnce({ data: { data: mockStudent } })
            .mockResolvedValueOnce({ data: {} });

        render(<InscriptionForm initialType="FORMATION" />);

        // Switch to FORMATION
        await user.click(screen.getByLabelText('Formation Professionnelle'));

        // Fill required fields
        await user.type(screen.getByLabelText('Nom *'), 'Jane');
        await user.type(screen.getByLabelText('Prénom *'), 'Smith');
        await user.type(screen.getByLabelText('Téléphone *'), '0612345678');
        await user.type(screen.getByLabelText('Email *'), 'jane@example.com');
        await user.selectOptions(screen.getByLabelText('Catégorie *'), 'Développement Personnel');
        await user.type(screen.getByLabelText('Montant (MAD) *'), '2000');

        const submitButton = screen.getByText('Inscrire l\'Étudiant');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(2);
            expect(screen.getByText('Inscription Réussie !')).toBeInTheDocument();
        });
    });

    it('handles API errors', async () => {
        const user = userEvent.setup();

        mockedAxios.post.mockRejectedValueOnce({
            response: { data: { message: 'Erreur de serveur' } }
        });

        render(<InscriptionForm />);

        // Fill minimal required fields
        await user.type(screen.getByLabelText('Nom *'), 'John');
        await user.type(screen.getByLabelText('Prénom *'), 'Doe');
        await user.type(screen.getByLabelText('Téléphone *'), '0612345678');
        await user.selectOptions(screen.getByLabelText('Catégorie *'), 'Soutien Scolaire Primaire');
        await user.type(screen.getByLabelText('Montant (MAD) *'), '1000');

        const submitButton = screen.getByText('Inscrire l\'Étudiant');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Erreur de serveur')).toBeInTheDocument();
        });
    });

    it('shows print receipt button in success modal', async () => {
        const user = userEvent.setup();
        const mockStudent = { id: '1', name: 'John', surname: 'Doe' };

        mockedAxios.post
            .mockResolvedValueOnce({ data: { data: mockStudent } })
            .mockResolvedValueOnce({ data: {} });

        render(<InscriptionForm />);

        // Fill and submit form
        await user.type(screen.getByLabelText('Nom *'), 'John');
        await user.type(screen.getByLabelText('Prénom *'), 'Doe');
        await user.type(screen.getByLabelText('Téléphone *'), '0612345678');
        await user.selectOptions(screen.getByLabelText('Catégorie *'), 'Soutien Scolaire Primaire');
        await user.type(screen.getByLabelText('Montant (MAD) *'), '1000');

        await user.click(screen.getByText('Inscrire l\'Étudiant'));

        await waitFor(() => {
            expect(screen.getByText('Imprimer Reçu')).toBeInTheDocument();
        });
    });
});