import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageDisplay from './MessageDisplay';

describe('MessageDisplay', () => {
  it('exibe mensagem do usuário e do bot', () => {
    const messages = [
      { text: 'Olá', sender: 'user' },
      { text: 'Oi, posso ajudar?', sender: 'bot' },
    ];
    render(<MessageDisplay messages={messages} isLoading={false} />);
    expect(screen.getByText('Olá')).toBeInTheDocument();
    expect(screen.getByText('Oi, posso ajudar?')).toBeInTheDocument();
  });

  it('exibe mensagem de carregando', () => {
    render(<MessageDisplay messages={[]} isLoading={true} />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('exibe mensagem padrão se não houver mensagens', () => {
    render(<MessageDisplay messages={[]} isLoading={false} />);
    expect(screen.getByText(/nenhuma mensagem ainda/i)).toBeInTheDocument();
  });
});
