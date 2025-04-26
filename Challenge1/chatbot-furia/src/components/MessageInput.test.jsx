import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageInput from './MessageInput';

describe('MessageInput', () => {
  it('chama onSendMessage ao enviar', () => {
    const onSendMessage = jest.fn();
    render(<MessageInput onSendMessage={onSendMessage} />);
    const input = screen.getByPlaceholderText(/digite sua mensagem/i);
    fireEvent.change(input, { target: { value: 'Teste' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSendMessage).toHaveBeenCalledWith('Teste');
  });

  it('desabilita input e botão quando isLoading', () => {
    render(<MessageInput onSendMessage={() => {}} isLoading />);
    expect(screen.getByPlaceholderText(/digite sua mensagem/i)).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
