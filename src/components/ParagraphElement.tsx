import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

// Extension personnalisée pour la taille
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
});

export default function ParagraphElement({ 
  value, 
  onChange 
}: { 
  value: string, 
  onChange: (newValue: string) => void 
}) {
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      FontSize,
    ],
    content: value,
    editable: isEditing,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Mettre à jour le contenu quand value change de l'extérieur
  if (editor && editor.getHTML() !== value && !isEditing) {
    editor.commands.setContent(value);
  }

  const handleClick = () => {
    setIsEditing(true);
    editor?.setEditable(true);
    editor?.commands.focus();
  };

  const handleBlur = () => {
    setIsEditing(false);
    editor?.setEditable(false);
  };

  if (!editor) return null;

  return (
    <div className={"p-2 rounded" + (isEditing ? " border border-blue-500" : "")}>
      {isEditing && (
        <div className="flex flex-wrap gap-1 p-2 bg-gray-100 rounded mb-2 border border-gray-300">
          {/* Gras, Italique */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded text-sm font-bold ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded text-sm italic ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1 rounded text-sm underline ${editor.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            U
          </button>

          <div className="w-px bg-gray-400 mx-1"></div>

          {/* Alignement */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-3 py-1 rounded text-sm ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            ◀
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-3 py-1 rounded text-sm ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            ▮
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-3 py-1 rounded text-sm ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            ▶
          </button>

          <div className="w-px bg-gray-400 mx-1"></div>

          {/* Taille */}
          <select
            onChange={(e) => editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()}
            className="px-2 py-1 rounded text-sm bg-white border"
          >
            <option value="">Taille</option>
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="24px">24px</option>
            <option value="32px">32px</option>
            <option value="48px">48px</option>
          </select>

          {/* Couleur */}
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="w-10 h-8 rounded border cursor-pointer"
            title="Couleur du texte"
          />
        </div>
      )}

      <div 
        className="cursor-pointer min-h-[50px]"
        onClick={!isEditing ? handleClick : undefined}
        onBlur={handleBlur}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}