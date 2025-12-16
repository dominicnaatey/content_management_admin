import { Modal } from "@/components/ui/modal";
import { useState } from "react";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { type: "upload" | "link"; value: string | File }) => void;
  type: "image" | "video";
}

export const MediaModal = ({
  isOpen,
  onClose,
  onSave,
  type,
}: MediaModalProps) => {
  const [activeTab, setActiveTab] = useState<"upload" | "link">("upload");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (activeTab === "link") {
      if (url) {
        onSave({ type: "link", value: url });
        onClose();
      }
    } else {
      if (file) {
        onSave({ type: "upload", value: file });
        onClose();
      }
    }
    // Reset state
    setUrl("");
    setFile(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === "image" ? "Insert Image" : "Insert Video"}
    >
      <div className="flex flex-col gap-4">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "upload"
                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            Upload
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "link"
                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("link")}
          >
            Link
          </button>
        </div>

        {activeTab === "upload" ? (
          <div className="flex flex-col gap-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload {type === "image" ? "Image" : "Video"}
            </label>
            <input
              key="file-input"
              type="file"
              accept={type === "image" ? "image/*" : "video/*"}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full rounded border border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {type === "video" && (
                <p className="text-sm text-red-500">
                    Note: Video upload requires a backend. For this demo, please use the Link option (YouTube/Vimeo).
                </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {type === "image" ? "Image URL" : "Video URL (YouTube/Vimeo)"}
            </label>
            <input
              key="url-input"
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded border border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={activeTab === "upload" ? !file : !url}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Insert
          </button>
        </div>
      </div>
    </Modal>
  );
};
