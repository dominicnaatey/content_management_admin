"use client";

import { useEditor, EditorContent, Editor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import { useEffect, useState, useRef } from "react";
import { MediaModal } from "./media-modal";

const Toolbar = ({ editor }: { editor: TiptapEditor | null }) => {
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  const colorInputRef = useRef<HTMLInputElement>(null);
  const formatDropdownRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formatDropdownRef.current &&
        !formatDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFormatDropdown(false);
      }
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMediaSave = (data: { type: "upload" | "link"; value: string | File }) => {
    if (!editor) return;

    if (mediaType === "image") {
      if (data.type === "link") {
        editor.chain().focus().setImage({ src: data.value as string }).run();
      } else {
        const file = data.value as File;
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
      }
    } else {
      // Video
      if (data.type === "link") {
        editor.commands.setYoutubeVideo({
          src: data.value as string,
          width: 640,
          height: 480,
        });
      } else {
         alert("Video upload is not fully supported in this demo without backend storage. Please use the Link option.");
      }
    }
  };

  const colors = [
    "#000000",
    "#4B5563",
    "#9CA3AF",
    "#DC2626",
    "#D97706",
    "#059669",
    "#2563EB",
    "#7C3AED",
    "#DB2777",
    "#FFFFFF",
  ];

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const addImage = () => {
    setMediaType("image");
    setMediaModalOpen(true);
  };

  const addYoutube = () => {
    setMediaType("video");
    setMediaModalOpen(true);
  };

  const Button = ({
    onClick,
    isActive,
    disabled,
    title,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title?: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white ${
        isActive ? "bg-gray-100 dark:bg-gray-600" : ""
      }`}
      type="button"
      title={title}
    >
      {children}
    </button>
  );

  const Separator = () => (
    <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
  );

  return (
    <div className="border-b border-stroke bg-gray-50 px-3 py-2 dark:border-stroke-dark dark:bg-gray-700">
      {/* Row 1 */}
      <div className="flex flex-wrap items-center gap-1 mb-2">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5h4.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0-7H6m2 7h6.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0 0H6"/>
          </svg>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8.874 19 6.143-14M6 19h6.33m-.66-14H18"/>
          </svg>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M6 19h12M8 5v9a4 4 0 0 0 8 0V5M6 5h4m4 0h4"/>
          </svg>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 6.2V5h12v1.2M7 19h6m.2-14-1.677 6.523M9.6 19l1.029-4.018M5 12h14"/>
          </svg>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          title="Highlight"
        >
           <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 19.2H5.5c-.3 0-.5-.2-.5-.5V16c0-.2.2-.4.5-.5L13.8 4.6c.5-.5 1.4-.5 1.9 0l3.7 3.7c.5.5.5 1.4 0 1.9L10 19.6c-.1.3-.3.5-.6.5H6c-.3 0-.5-.2-.5-.5v-4.7c0-.2.2-.4.5-.5l1.3-1.3"/>
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M19 20H5"/>
          </svg>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Code"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"/>
          </svg>
        </Button>
        <Button
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="Link"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
          </svg>
        </Button>
        <Button
          onClick={removeLink}
          disabled={!editor.isActive("link")}
          title="Remove Link"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
             <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
             <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </Button>
        <Separator />
        <div className="relative" ref={colorPickerRef}>
        <Button
          onClick={() => setShowColorPicker(!showColorPicker)}
          isActive={editor.isActive("textStyle", { color: /.*/ })}
          title="Text Color"
        >
           <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
             <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M7 21h10M12 3l-5 14h10L12 3Zm0 0v14"/>
             <circle cx="17.5" cy="17.5" r="2.5" fill="currentColor" />
           </svg>
        </Button>
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-2 z-50 w-32 rounded border border-stroke bg-white p-2 shadow-lg dark:border-strokedark dark:bg-gray-700">
            <div className="grid grid-cols-5 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                  className={`h-5 w-5 rounded border border-gray-200 hover:scale-110 ${editor.isActive('textStyle', { color }) ? 'ring-1 ring-blue-500' : ''}`}
                  style={{ backgroundColor: color }}
                  title={color}
                  type="button"
                />
              ))}
            </div>
            <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-600">
                <button
                    type="button"
                    onClick={() => {
                        colorInputRef.current?.click();
                        setShowColorPicker(false);
                    }}
                    className="w-full text-xs text-left hover:text-blue-500 dark:text-gray-300 dark:hover:text-white"
                >
                    Custom...
                </button>
            </div>
          </div>
        )}
        <input
          type="color"
          ref={colorInputRef}
          className="hidden"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
        />
        </div>
         <Button
          onClick={() => {
              const family = window.prompt("Font Family", "Arial");
              if (family) editor.chain().focus().setFontFamily(family).run();
          }}
          isActive={editor.isActive("textStyle", { fontFamily: /.*/ })}
          title="Font Family"
        >
           <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v18M5 8h14M7 16h10"/>
           </svg>
        </Button>
        <Separator />
         <Button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6h8m-8 4h12M6 14h8m-8 4h12"/>
          </svg>
        </Button>
         <Button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6h8M6 10h12M8 14h8M6 18h12"/>
          </svg>
        </Button>
         <Button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6h8m-12 4h12m-8 4h8m-12 4h12"/>
          </svg>
        </Button>
         <Button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Align Justify"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6h12M6 10h12M6 14h12M6 18h12"/>
          </svg>
        </Button>
      </div>

      {/* Row 2 */}
      <div className="flex flex-wrap items-center gap-1">
        <div className="relative" ref={formatDropdownRef}>
            <button
                type="button"
                onClick={() => setShowFormatDropdown(!showFormatDropdown)}
                className="flex items-center justify-between rounded px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 min-w-[100px]"
            >
                <span>
                  {editor.isActive('heading', { level: 1 }) ? 'Heading 1' :
                   editor.isActive('heading', { level: 2 }) ? 'Heading 2' :
                   editor.isActive('heading', { level: 3 }) ? 'Heading 3' :
                   editor.isActive('heading', { level: 4 }) ? 'Heading 4' :
                   editor.isActive('heading', { level: 5 }) ? 'Heading 5' :
                   editor.isActive('heading', { level: 6 }) ? 'Heading 6' :
                   'Paragraph'}
                </span>
                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>
            {showFormatDropdown && (
                <div className="absolute z-50 mt-1 min-w-25 mb-4 rounded divide-y divide-gray-100 shadow bg-white dark:bg-gray-700 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                            <button type="button" onClick={() => { editor.chain().focus().setParagraph().run(); setShowFormatDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Paragraph</button>
                        </li>
                        {[1, 2, 3, 4, 5, 6].map((level) => (
                             <li key={level}>
                                <button
                                    type="button"
                                    onClick={() => { editor.chain().focus().toggleHeading({ level: level as any }).run(); setShowFormatDropdown(false); }}
                                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${editor.isActive('heading', { level }) ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                                >
                                    Heading {level}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        <Separator />
        <Button
          onClick={addImage}
          title="Image"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/>
          </svg>
        </Button>
         <Button
          onClick={addYoutube}
          title="Video"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Zm-9 10.5v-5l4 2.5-4 2.5Z"/>
          </svg>
        </Button>
        <Separator />
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"/>
          </svg>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6h8m-8 6h8m-8 6h8M4 6h1v5.185a1.5 1.5 0 0 1-2.036 1.45L2.129 12M6 19a2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2Zm0-5.833A2.167 2.167 0 0 0 3.833 11 2.167 2.167 0 0 0 1.667 13.167"/>
          </svg>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
        </Button>
         <Button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M4 12h16"/>
          </svg>
        </Button>
      </div>
      <MediaModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSave={handleMediaSave}
        type={mediaType}
      />
    </div>
  );
};

export default function Editor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Highlight,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Youtube.configure({
        controls: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "format lg:format-lg dark:format-invert focus:outline-none format-blue max-w-none min-h-[200px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-stroke bg-white dark:border-stroke-dark dark:bg-dark-2">
      <Toolbar editor={editor} />
      <div className="p-4 text-dark dark:text-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
