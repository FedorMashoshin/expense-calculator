import PDFUploader from "./components/pdfUploader";

export default function App() {
    const handeUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const json = await res.json();
            console.log("Server response:", json);
            // TODO display progress
        } catch (err) {
            console.error("Uploaded failed:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Expense Calculator</h1>
                    <p className="mt-3 text-lg text-gray-600">Upload your bank statement to analyze your expenses</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <PDFUploader onUpload={handeUpload} />
                </div>
            </div>
        </div>
    );
}
