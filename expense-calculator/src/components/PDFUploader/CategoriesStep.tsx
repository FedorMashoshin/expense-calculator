import React from "react";

interface CategoriesStepProps {
    selectedCategories: string[];
    categoryInput: string;
    defaultCategories: string[];
    onCategoryInputChange: (value: string) => void;
    onCategoryInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onAddCategory: (category: string) => void;
    onRemoveCategory: (category: string) => void;
    onSelectAll: () => void;
    onContinue: () => void;
}

const CategoriesStep: React.FC<CategoriesStepProps> = ({
    selectedCategories,
    categoryInput,
    defaultCategories,
    onCategoryInputChange,
    onCategoryInputKeyDown,
    onAddCategory,
    onRemoveCategory,
    onSelectAll,
    onContinue,
}) => {
    return (
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
                                <button type="button" onClick={() => onRemoveCategory(category)} className="ml-2 text-primary-600 hover:text-primary-800">
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
                        onChange={(e) => onCategoryInputChange(e.target.value)}
                        onKeyDown={onCategoryInputKeyDown}
                        placeholder="Type your category here..."
                        className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-gray-400 transition-all duration-200 shadow-sm"
                    />

                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-500">Or select from common categories:</p>
                            <button type="button" onClick={onSelectAll} className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200">
                                {selectedCategories.length === defaultCategories.length ? "Deselect All" : "Select All"}
                            </button>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {defaultCategories?.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => onAddCategory(category)}
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
                        onClick={onContinue}
                        disabled={selectedCategories.length === 0}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Continue to Upload
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoriesStep;
