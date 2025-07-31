import React, {type FormEvent, useState} from 'react';
import FileUploader from '~/components/FileUploader';
import Navbar from "~/components/Navbar";

const Upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleAnalyze = async ({
        companyName, 
        jobTitle, 
        jobDescription, 
        file
    }: {
        companyName: string, 
        jobTitle: string, 
        jobDescription: string,
        file: File | null
    }) => {

    }

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;
        handleAnalyze({
            companyName,
            jobTitle,
            jobDescription,
            file
        });

    }

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    return (
        <main className={"bg-[url('/images/bg-main.svg')] bg-cover"}>
            <Navbar/>
            <section className={"main-section"}>
                <div className={"page-heading py-16"}>
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img
                                src={"/images/resume-scan.gif"}
                                className={"w-full"}
                            />
                        </>
                    ) : (
                        <h2>Drop your resume for ATS and imporvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id={"upload-form"} onSubmit={handleSubmit} className={"flex flex-col gap-4"}>
                            <div className={"form-div"}>
                                <label htmlFor={"company-name"}>Company Name</label>
                                <input type={"text"} name={"company-name"} placeholder={"Company Name"} id={"company-name"} />
                            </div>
                            <div className={"form-div"}>
                                <label htmlFor={"job-title"}>Job Title</label>
                                <input type={"text"} name={"job-title"} placeholder={"Job Title"} id={"job-title"} />
                            </div>
                            <div className={"form-div"}>
                                <label htmlFor={"job-description"}>Job Description</label>
                                <textarea name={"job-description"} placeholder={"Job Description"} id={"job-description"} rows={5} />
                            </div>
                            <div className={"form-div"}>
                                <label htmlFor={"job-description"}>Upload Resume</label>
                               <FileUploader onFileSelected={handleFileSelect}/>
                            </div>
                            <button className="primary-button" type='submit'>
                                Analyze resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;