import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Image, Container, Row } from 'react-bootstrap';
import styles from './codepreview.module.scss';
import { EditorView, minimalSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { cpp } from '@codemirror/lang-cpp';
import { EditorViewConfig, lineNumbers } from '@codemirror/view';
import editIcon from 'Assets/Icons/edit.svg';
interface Props {
  code: string;
}
const CodePreview: FC<Props> = ({ code }) => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef<EditorView | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [currentCode, setCurrentCode] = useState(code); // Preserve the current code
  useEffect(() => {
    if (editorRef.current) {
      const state: EditorState = EditorState.create({
        doc: currentCode, // Use current code
        extensions: [
          minimalSetup,
          cpp(),
          EditorView.editable.of(isEditable),
          EditorState.readOnly.of(!isEditable),
          EditorView.lineWrapping,
          lineNumbers(),
          EditorView.theme({
            '.cm-content': { color: '#000' },
            '.cm-editor.cm-focused': { outline: 'none' },
          }),
        ],
        //doc: '',
      });

      const config: EditorViewConfig = {
        parent: editorRef.current,
        state,
      };
      editorInstanceRef.current = new EditorView(config);
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
      }
    };
  }, [isEditable, currentCode]);

  // Enable editing
  const enableEdit = () => {
    if (!isEditable) {
      setIsEditable(true);
    }
  };
  const commitCode = useCallback(
    (code: string) => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.dispatch({
          changes: {
            from: 0,
            to: editorInstanceRef.current.state.doc.length,
            insert: code,
          },
        });
        setCurrentCode(code);
      }
    },
    [code],
  );

  // Sync the editor content to `currentCode`
  const syncCode = useCallback(() => {
    if (editorInstanceRef.current) {
      setCurrentCode(editorInstanceRef.current.state.doc.toString());
    }
  }, []);
  useEffect(() => {
    commitCode(code);
  }, [code, commitCode]);

  return (
    <Container className={styles.container}>
      <Row>
        <div className="gutter-0 p-0 pt-2" ref={editorRef}>
          <Button
            style={{ marginLeft: '240px' }}
            variant="outline-secondary"
            className="mt-2"
            onClick={enableEdit} // Only enable editing
          >
            Enable Editing
            <Image
              src={editIcon}
              style={{ marginLeft: '10px' }}
              height={25}
              width={25}
            />
          </Button>
        </div>
      </Row>
    </Container>
  );
};

export default CodePreview;
