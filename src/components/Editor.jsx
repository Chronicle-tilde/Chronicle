/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { TiptapExtensions } from './tiptapExtensions';
import { WebrtcProvider } from 'y-webrtc';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
const Editor = ({ docID, fileID }) => {
  const [markdownContent, setMarkdownContent] = useState('');


  const ydoc = new Y.Doc()
  const provider = new WebrtcProvider(fileID, ydoc, {
    signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
  });





  const editor = useEditor({
    extensions: [
      ...TiptapExtensions,
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: 'Anonymous',
          color: '#565758',
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      setMarkdownContent(editor.getHTML());
    },
  });

  useEffect(() => {
    const saveContent = () => {
      if (editor) {
        const content = editor.getHTML();
        localStorage.setItem(docID, content);
      }
    };
    window.addEventListener('beforeunload', saveContent);
    const savedContent = localStorage.getItem(docID);
    if (savedContent) {
      editor?.commands.setContent(savedContent);
    }
    return () => {
      window.removeEventListener('beforeunload', saveContent);
    };
  }, [editor, docID]);
  return (
    <div className="markdown-editor tiptap h-full w-full">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
