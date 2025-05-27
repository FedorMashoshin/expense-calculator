import React, { useState } from "react";

interface PdfUploaderProps {
    defaultCategories: string[];
    onUpload: (file: File, categories: string[]) => void;
}

type Step = "categories" | "upload";

const PDFUploader: React.FC<PdfUploaderProps> = ({ defaultCategories, onUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [currentStep, setCurrentStep] = useState<Step>("categories");
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

    const handleSelectAll = () => {
        if (selectedCategories.length === defaultCategories.length) {
            // If all categories are selected, deselect all
            setSelectedCategories([]);
        } else {
            // Otherwise, select all categories
            setSelectedCategories([...defaultCategories]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-4">
                <div className={`flex items-center ${currentStep === "categories" ? "text-primary-600" : "text-gray-400"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === "categories" ? "border-primary-600" : "border-gray-300"}`}>1</div>
                    <span className="ml-2 font-medium">Select Categories</span>
                </div>
                <div className="w-16 h-0.5 bg-gray-200"></div>
                <div className={`flex items-center ${currentStep === "upload" ? "text-primary-600" : "text-gray-400"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === "upload" ? "border-primary-600" : "border-gray-300"}`}>2</div>
                    <span className="ml-2 font-medium">Upload PDF</span>
                </div>
            </div>

            {/* Step Content */}
            {currentStep === "categories" ? (
                <div className="bg-white p-6">
                    <div className="mb-6">
                        <div className="bg-secondary-100 border-l-4 border-secondary-500 text-secondary-700 p-4" role="alert">
                            <p className="font-light">Choose the categories you want to track in your expenses. These will help us analyze your spending patterns and provide better insights.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedCategories.length === 0 ? (
                                <p className="text-gray-400 text-sm italic">No categories selected yet</p>
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
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                onKeyDown={addCategoryOnEnter}
                                placeholder="Type your category here..."
                                className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-gray-400 transition-all duration-200 shadow-sm"
                            />

                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-gray-500">Or select from common categories:</p>
                                    <button type="button" onClick={handleSelectAll} className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200">
                                        {selectedCategories.length === defaultCategories.length ? "Deselect All" : "Select All"}
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {defaultCategories?.map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() => addCategory(category)}
                                            disabled={selectedCategories.includes(category)}
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                selectedCategories.includes(category)
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-gray-50 text-gray-700 hover:bg-primary-100 hover:text-primary-700 border border-gray-200 shadow-sm hover:shadow"
                                            } transition-all duration-200`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={() => setCurrentStep("upload")}
                                disabled={selectedCategories.length === 0}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Continue to Upload
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6">
                    <div className="mb-6">
                        <div className="space-y-2 text-gray-600">
                            <p className="font-light mb-6">Please upload your bank statement PDF file. We'll analyze your expenses based on the categories you selected.</p>
                            <div className="bg-secondary-100 p-4 rounded-lg">
                                <h4 className="font-medium text-secondary-700 mb-2">File Requirements:</h4>
                                <ul className="list-disc list-inside text-sm text-secondary-700 space-y-1">
                                    <li>File must be in PDF format</li>
                                    <li>Maximum file size: 10MB</li>
                                    <li>File should be a bank statement or credit card statement</li>
                                    <li>Statement should be in English</li>
                                    <li className="font-bold">
                                        File name should look like this: <span className="font-normal">td_credit_05_25.pdf</span>
                                        <p className="text-xs text-gray-500">name of the bank, type of account, month and year</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        {file && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                <p className="text-sm text-gray-600 truncate flex-1">{file.name}</p>
                                <button type="button" onClick={() => setFile(null)} className="ml-2 text-sm text-red-600 hover:text-red-500">
                                    Remove
                                </button>
                            </div>
                        )}

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setCurrentStep("categories")}
                                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Back to Categories
                            </button>
                            <button
                                type="submit"
                                disabled={!file}
                                className="flex-1 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Upload and Analyze
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PDFUploader;
