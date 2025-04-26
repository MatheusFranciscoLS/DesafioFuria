import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chatbot from './Chatbot';

describe('Chatbot', () => {
  it('exibe mensagem do usuário e resposta do bot', async () => {
    render(<Chatbot />);
    const input = screen.getByPlaceholderText(/digite sua mensagem/i);
    fireEvent.change(input, { target: { value: 'Oi bot' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(await screen.findByText('Oi bot')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/resposta do chatbot/i)).toBeInTheDocument());
  });

  it('mostra mensagem de carregando', async () => {
    render(<Chatbot />);
    const input = screen.getByPlaceholderText(/digite sua mensagem/i);
    fireEvent.change(input, { target: { value: 'Teste' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());
  });
});
