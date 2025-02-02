"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Image from '@tiptap/extension-image'
import ImageResize from 'tiptap-extension-resize-image'
import { useEditorStore } from '../store/user-editor-store';
import Underline from '@tiptap/extension-underline'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style';

// Custom-extensions for editing text styles
import { FontSizeExtension } from '@/extensions/font-size';

import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { Threads } from "./threads";

interface EditorProps {
    initialContent?: string | undefined;
  };
  

export const EditorComponent = ({ initialContent }: EditorProps) => {
    const { setEditor } = useEditorStore();
    const liveblocks = useLiveblocksExtension({initialContent, offlineSupport_experimental: true});

    const editor = useEditor({
        onCreate({ editor }) {
            setEditor(editor);
        },
        onDestroy() {
            setEditor(null);
        },
        onUpdate({ editor }) {
            setEditor(editor);
        },
        onSelectionUpdate({ editor }) {
            setEditor(editor);
        },
        onTransaction({ editor }) {
            setEditor(editor);
        },
        onFocus({ editor }) {
            setEditor(editor);
        },
        onBlur({ editor }) {
            setEditor(editor);
        },
        onContentError({ editor }) {
            setEditor(editor);
        }, 

        editorProps: {
            attributes: {
                style: "padding-left: 56px; padding-right: 56px; padding-top: 40px; padding-bottom: 40px;",
                class: 'focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] py-10 pr-14 cursor-text',
            }
        }, 
        extensions: [
            StarterKit.configure({
                history: false,
            }),
            FontFamily,
            TextStyle,
            FontSizeExtension,
            Underline,
            Image,
            ImageResize,
            Table, 
            TableCell,
            TableHeader,
            TableRow,
            TaskList, 
            TaskItem.configure({
                nested: true,
            }),
            liveblocks,
        ],
        content: `<table>
        <tbody>
          <tr>
            <th>Name</th>
            <th colspan="3">Description</th>
          </tr>
          <tr>
            <td>Cyndi Lauper</td>
            <td>Singer</td>
            <td>Songwriter</td>
            <td>Actress</td>
          </tr>
        </tbody>
      </table>`,
      immediatelyRender: false, // to prevent rendering the editor immediately (resolve hydration error)
    })
    
    return (
        <div className='size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible' >
            <div className='min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0 overflow-auto h-screen'>

                <EditorContent editor={editor} />
                <Threads editor={editor} />
            </div>
        </div>
    );
};