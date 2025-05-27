import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PDFUploader from "../components/PDFUploader";
import AvailableMonths from "../components/AvailableMonths";
import { dummyAvailableMonths } from "../types/expense";

const defaultCategories = [
    "Housing",
    "Subscriptions",
    "Utilities & Services",
    "Groceries",
    "Dining Out",
    "Transportation",
    "Healthcare",
    "Investments & Wealth",
    "Personal & Family",
    "Entertainment & Recreation",
    "Household & Supplies",
    "Miscellaneous",
];

type Tab = "upload" | "statements";

export default function UploadPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("upload");

    const handleUpload = async (file: File, categories: string[]) => {
        const formData = new FormData();
        formData.append("file", file);
        categories.forEach((category) => formData.append("categories[]", category));

        try {
            console.log(formData);
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }
            const json = await res.json();
            console.log(json);
            // navigate("/results", { state: { expenseData: json } });
        } catch (err: unknown) {
            console.error("Upload failed:", err);
            alert(err instanceof Error ? err.message : "An unknown error occurred");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Expense Calculator</h1>
                    <p className="mt-3 text-lg text-gray-600">Upload your bank statement to analyze your expenses</p>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab("upload")}
                                className={`
                                    flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center
                                    ${activeTab === "upload" ? "border-primary-500 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
                                `}
                            >
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Upload New Statement
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab("statements")}
                                className={`
                                    flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-center
                                    ${activeTab === "statements" ? "border-primary-500 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
                                `}
                            >
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                    Available Statements
                                </div>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {activeTab === "upload" ? (
                        <div className="p-6">
                            <PDFUploader onUpload={handleUpload} defaultCategories={defaultCategories} />
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Statements</h2>
                                <p className="text-gray-600">View and analyze your uploaded bank statements</p>
                            </div>
                            <AvailableMonths months={dummyAvailableMonths} />
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => navigate("/results")}
                                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                    View All Statements
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
