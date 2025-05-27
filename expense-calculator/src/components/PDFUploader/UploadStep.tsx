import React from "react";

interface UploadStepProps {
    file: File | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: () => void;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ file, onFileChange, onRemoveFile, onBack, onSubmit }) => {
    return (
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

            <form onSubmit={onSubmit} className="space-y-6">
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
                            <input type="file" accept="application/pdf" onChange={onFileChange} className="sr-only" id="file-upload" />
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
                        <button type="button" onClick={onRemoveFile} className="ml-2 text-sm text-red-600 hover:text-red-500">
                            Remove
                        </button>
                    </div>
                )}

                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={onBack}
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
    );
};

export default UploadStep;
