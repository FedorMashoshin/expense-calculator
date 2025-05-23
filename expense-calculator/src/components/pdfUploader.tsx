import React, { useState } from "react";

interface PdfUploaderProps {
    onUpload: (file: File) => void;
}

const PDFUploader: React.FC<PdfUploaderProps> = ({ onUpload }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const selectedFile = e.target.files[0];
        if (selectedFile.type !== "application/pdf") {
            alert("Please select a PDF file.");
        }
        setFile(selectedFile);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert("Please, select a file first.");
            return;
        }
        onUpload(file);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
            <div className="space-y-2">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                            <input type="file" accept="application/pdf" onChange={handleFileChange} className="sr-only" id="file-upload" />
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                                <span>Upload a file</span>
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF up to 10MB</p>
                    </div>
                </div>
            </div>
            {file && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600 truncate flex-1">{file.name}</p>
                    <button type="button" onClick={() => setFile(null)} className="ml-2 text-sm text-red-600 hover:text-red-500">
                        Remove
                    </button>
                </div>
            )}
            <button
                type="submit"
                disabled={!file}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
                Upload PDF
            </button>
        </form>
    );
};

export default PDFUploader;
