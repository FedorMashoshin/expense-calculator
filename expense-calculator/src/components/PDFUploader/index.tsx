import React, { useState } from "react";
import ProgressSteps from "./ProgressSteps";
import CategoriesStep from "./CategoriesStep";
import UploadStep from "./UploadStep";

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
            setSelectedCategories([]);
        } else {
            setSelectedCategories([...defaultCategories]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <ProgressSteps currentStep={currentStep} />

            {currentStep === "categories" ? (
                <CategoriesStep
                    selectedCategories={selectedCategories}
                    categoryInput={categoryInput}
                    defaultCategories={defaultCategories}
                    onCategoryInputChange={(value) => setCategoryInput(value)}
                    onCategoryInputKeyDown={addCategoryOnEnter}
                    onAddCategory={addCategory}
                    onRemoveCategory={removeCategory}
                    onSelectAll={handleSelectAll}
                    onContinue={() => setCurrentStep("upload")}
                />
            ) : (
                <UploadStep file={file} onFileChange={handleFileChange} onRemoveFile={() => setFile(null)} onBack={() => setCurrentStep("categories")} onSubmit={handleSubmit} />
            )}
        </div>
    );
};

export default PDFUploader;
