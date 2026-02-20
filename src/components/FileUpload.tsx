
import React, { useRef, useState } from 'react';

interface FileUploadProps {
    file: File | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ file, onFileChange }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => setIsDragOver(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const event = { target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>;
            onFileChange(event);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
                VCF File Upload
            </label>
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`cursor-pointer mt-1 flex justify-center px-6 py-8 border-2 border-dashed rounded-xl transition-all duration-300 group
                    ${isDragOver
                        ? 'border-brand-400 bg-brand-500/10 scale-[1.02]'
                        : file
                            ? 'border-emerald-500/40 bg-emerald-500/5'
                            : 'border-surface-500 hover:border-brand-500/40 hover:bg-brand-500/5'
                    }`}
            >
                <div className="space-y-2 text-center">
                    {file ? (
                        <>
                            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-emerald-400">{file.name}</p>
                            <p className="text-xs text-slate-500">Click to change file</p>
                        </>
                    ) : (
                        <>
                            <div className="mx-auto w-12 h-12 rounded-full bg-surface-600 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors duration-300">
                                <svg className="h-6 w-6 text-slate-400 group-hover:text-brand-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                            </div>
                            <div className="text-sm text-slate-400">
                                <span className="font-medium text-brand-400">Click to upload</span> or drag & drop
                            </div>
                            <p className="text-xs text-slate-500">.vcf files up to 5MB</p>
                        </>
                    )}
                </div>
            </div>
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".vcf"
                onChange={onFileChange}
            />
        </div>
    );
};

export default FileUpload;
