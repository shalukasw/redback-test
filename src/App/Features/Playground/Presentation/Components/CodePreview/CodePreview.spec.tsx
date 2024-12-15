import React from 'react';
import { render, screen } from '@testing-library/react';
import CodePreview from './CodePreview';

describe('CodePreview', () => {
  test('should render without errors', () => {
    render(<CodePreview code="" />);
    const editorElement = screen.getByRole('textbox');
    expect(editorElement).toBeInTheDocument();
  });

  test('should display the provided code in the editor', () => {
    const code = 'int main() {\n  return 0;\n}';

    render(<CodePreview code={code} />);
    const editorElement = screen.getByRole('textbox');
    expect(editorElement.textContent).toBe('int main() {  return 0;}');
  });

  test('should show the updated code when the code prop changes', () => {
    const initialCode = 'int main() {\n  return 0;\n}';
    const updatedCode = 'int add(int a, int b) {\n  return a + b;\n}';

    const { rerender } = render(<CodePreview code={initialCode} />);
    const editorElement = screen.getByRole('textbox');
    expect(editorElement.textContent).toBe('int main() {  return 0;}');

    rerender(<CodePreview code={updatedCode} />);
    expect(editorElement.textContent).toBe(
      'int add(int a, int b) {  return a + b;}',
    );
  });
});
