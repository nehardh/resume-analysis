import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, fs, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);
    const [wiped, setWiped] = useState(false);

    // Load files from FS
    const loadFiles = async () => {
        try {
            const files = (await fs.readDir("./")) as FSItem[];
            setFiles(files);
        } catch (err) {
            console.error("Failed to load files:", err);
        }
    };

    // Initial load
    useEffect(() => {
        loadFiles();
    }, []);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading, auth.isAuthenticated]);

    // Wipe all app data
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to wipe all app data? This cannot be undone.")) return;

        try {
            await Promise.all(files.map((file) => fs.delete(file.path)));
            await kv.flush();
            setWiped(true); // Show back to home button
            loadFiles();
            alert("All app data wiped successfully!");
        } catch (err) {
            console.error("Failed to wipe files:", err);
            alert("Failed to wipe files. Check console for details.");
        }
    };

    if (isLoading) return <div className="text-center mt-20">Loading...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
            <div className="max-w-xl w-full flex flex-col items-center gap-4">
                {/* Back to Home button */}

                    <button
                        className="self-start bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition mb-4"
                        onClick={() => navigate("/")}
                    >
                        Back to Home
                    </button>


                <div className="w-full bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
                    <h2 className="text-xl font-bold mb-4 text-center">
                        Authenticated as: {auth.user?.username}
                    </h2>

                    <div className="mb-4 text-center font-semibold">Existing files:</div>
                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto w-full">
                        {files.length > 0 ? (
                            files.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex justify-between p-3 bg-gray-100 rounded-md shadow-sm"
                                >
                                    <p>{file.name}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No files found.</p>
                        )}
                    </div>

                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 w-full rounded-md transition"
                        onClick={handleDelete}
                    >
                        Wipe App Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WipeApp;
