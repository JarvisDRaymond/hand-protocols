import { useState, useEffect } from "react";
import { projectStorage, projectFirestore, timestamp } from "../firebase/config";

const useStorage = (file, title, text) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    // refs
    const storageRef = projectStorage.ref(file.name);

    const collectionRef = projectFirestore.collection('images');

    if (typeof file !== "string") {
      storageRef.put(file).on(
        "state_changed",
        (snap) => {
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
          setProgress(percentage);
        },
        (err) => {
          setError(err);
        },
        async () => {
          const url = await storageRef.getDownloadURL();
          const createdAt = timestamp();
          collectionRef.add({url, createdAt, title, text});
          setUrl(url);
        }
      );  
    }
    else {
      const updateDB = async () => {
        const url = file;
        const createdAt = timestamp();
          collectionRef.add({url, createdAt, title, text});
          setUrl(url);
      }
      updateDB();
      setProgress(100);

    }
  }, [file]);

  return { progress, url, error };
};
export default useStorage;
