import React, { useState } from "react";

interface PdfUploaderProps {
    defaultCategories: string[];
    onUpload: (file: File, categories: string[]) => void;
}

const PDFUploader: React.FC<PdfUploaderProps> = ({ defaultCategories, onUpload }) => {
    const [file, setFile] = useState<File | null>(null);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categoryInput, setCategoryInput] = useState<string>("");

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
        onUpload(file, selectedCategories);
    };

    const addCategory = (category: string) => {
        if (!category || selectedCategories.includes(category)) return;
        setSelectedCategories([...selectedCategories, category]);
        setCategoryInput("");
    };

    const removeCategory = (category: string) => {
        setSelectedCategories(selectedCategories.filter((c) => c !== category));
    };

    const addCategoryOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addCategory(categoryInput.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-2 bg-white space-y-6">
            <div className="space-y-4">
                <label htmlFor="categories" className="block text-base font-semibold text-gray-900">
                    Categories:
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCategories.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">No categories yet</p>
                    ) : (
                        selectedCategories.map((category) => (
                            <span key={category} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                                {category}
                                <button type="button" onClick={() => removeCategory(category)} className="ml-2 text-primary-600 hover:text-primary-800">
                                    &times;
                                </button>
                            </span>
                        ))
                    )}
                </div>
                <div className="space-y-3">
                    <input
                        type="text"
                        id="categories"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        onKeyDown={addCategoryOnEnter}
                        placeholder="Type your category here..."
                        className="
                            block w-full px-4 py-2.5
                            text-gray-700 bg-white
                            border border-gray-200 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                            placeholder:text-gray-400
                            transition-all duration-200
                            shadow-sm
                        "
                    />
                    <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-2">Or select from default categories:</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {defaultCategories?.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => addCategory(category)}
                                    disabled={selectedCategories.includes(category)}
                                    className={`
                                        px-3 py-2 rounded-md text-sm font-medium
                                        ${
                                            selectedCategories.includes(category)
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-gray-50 text-gray-700 hover:bg-primary-100 hover:text-primary-700 border border-gray-200 shadow-sm hover:shadow"
                                        }
                                        transition-all duration-200
                                    `}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="file-upload" className="block text-base font-semibold text-gray-900 mb-2">
                    Upload PDF
                </label>
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
                                className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
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
                disabled={!file || selectedCategories.length === 0}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
                Upload PDF
            </button>
        </form>
    );
};

export default PDFUploader;
