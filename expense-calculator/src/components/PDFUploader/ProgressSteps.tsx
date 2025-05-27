import React from "react";

interface ProgressStepsProps {
    currentStep: "categories" | "upload";
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
    return (
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
    );
};

export default ProgressSteps;
