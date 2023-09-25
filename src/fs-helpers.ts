/**
 * Open a handle to an existing file on the local file system.
 */
export function getFileHandle(): Promise<FileSystemFileHandle> {
    // For Chrome 86 and later...
    if ('showOpenFilePicker' in window) {
        // @ts-ignore
        return window.showOpenFilePicker().then((handles) => handles[0]);
    }

    // For Chrome 85 and earlier...
    // @ts-ignore
    return window.chooseFileSystemEntries();
}

/**
 * Create a handle to a new (text) file on the local file system.
 */
export function getNewFileHandle(): Promise<FileSystemFileHandle> {
    // For Chrome 86 and later...
    if ('showSaveFilePicker' in window) {
        const options = {
            types: [{
                description: 'Text file',
                accept: {'text/plain': ['.txt']},
            }],
        };

        // @ts-ignore
        return window.showSaveFilePicker(options);
    }

    // For Chrome 85 and earlier...
    const options = {
        type: 'save-file',
        accepts: [{
            description: 'Text file',
            extensions: ['txt'],
            mimeTypes: ['text/plain'],
        }],
    };

// @ts-ignore
    return window.chooseFileSystemEntries(options);
}

/**
 * Reads the raw text from a file.
 */
export function readFile(file: File): Promise<string> {
    // If the new .text() reader is available, use it.
    if (file.text) {
        return file.text();
    }

    // Otherwise use the traditional file reading technique.
    return _readFileLegacy(file);
}

/**
 * Reads the raw text from a file.
 */
function _readFileLegacy(file: File): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', (e) => {
            // @ts-ignore
            const text = e.srcElement.result;
            resolve(text);
        });
        reader.readAsText(file);
    });
}

/**
 * Writes the contents to disk.
 */
export async function writeFile(fileHandle: FileSystemFileHandle, contents: string): Promise<void> {
    // Support for Chrome 82 and earlier.
    // @ts-ignore
    if (fileHandle.createWriter) {
        // Create a writer (request permission if necessary).
        // @ts-ignore
        const writer = await fileHandle.createWriter();
        // Write the full length of the contents
        await writer.write(0, contents);
        // Close the file and write the contents to disk
        await writer.close();
        return;
    }

    // For Chrome 83 and later.
    // Create a FileSystemWritableFileStream to write to.
    // @ts-ignore
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
}

/**
 * Verify the user has granted permission to read or write to the file, if
 * permission hasn't been granted, request permission.
 */
export async function verifyPermission(fileHandle: FileSystemFileHandle, withWrite: boolean): Promise<boolean> {
    const options = {};
    if (withWrite) {
        // @ts-ignore
        options.writable = true;
        // For Chrome 86 and later...
        // @ts-ignore
        options.mode = 'readwrite';
    }
    // Check if we already have permission, if so, return true.
    // @ts-ignore
    if (await fileHandle.queryPermission(options) === 'granted') {
        return true;
    }
    // Request permission to the file, if the user grants permission, return true.
    // @ts-ignore
    if (await fileHandle.requestPermission(options) === 'granted') {
        return true;
    }
    // The user did nt grant permission, return false.
    return false;
}
