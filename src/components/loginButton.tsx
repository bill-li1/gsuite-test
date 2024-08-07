// pages/index.tsx

import { signIn, signOut, useSession } from "next-auth/react";

import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [files, setFiles] = useState([]);
  const [fileContent, setFileContent] = useState("");
  const [fileType, setFileType] = useState("");

  const fetchDriveFiles = async () => {
    const res = await fetch("/api/drive");
    const data = await res.json();
    setFiles(data.files || []);
  };

  const fetchFileMetadata = async (fileId: string) => {
    const res = await fetch(`/api/drive?fileId=${fileId}`, { method: "GET" });
    const data = await res.json();
    setFileType(data.mimeType);
  };

  const fetchFileContent = async (fileId: string) => {
    const res = await fetch(`/api/drive?fileId=${fileId}`, { method: "POST" });
    const blob = await res.blob();
    const reader = new FileReader();
    if (!res.ok) {
      throw new Error("Failed to fetch file content");
    }

    const text = await blob.text();
    const json = JSON.parse(text);

    console.log("File content1 :", json);
    setFileContent(JSON.stringify(json, null, 2));
    reader.onload = () => {
      const content = reader.result as string;
      console.log("File content:", content);
      setFileContent(content);
    };
    reader.readAsText(blob);
  };

  if (session) {
    return (
      <>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
        <button onClick={fetchDriveFiles}>Fetch Google Drive Files</button>
        <ul>
          {files.map((file) => (
            <li key={file.id} className="flex gap-24">
              {file.name}
              <button onClick={() => fetchFileMetadata(file.id)}>
                Get Metadata
              </button>
              <button onClick={() => fetchFileContent(file.id)}>
                Read Content
              </button>
            </li>
          ))}
        </ul>
        {fileType && <p>File Type: {fileType}</p>}
        {fileContent && (
          <div>
            <h3>File Content:</h3>
            <pre>{fileContent}</pre>
          </div>
        )}
      </>
    );
  }
  return (
    <>
      <p>Not signed in</p>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </>
  );
}
