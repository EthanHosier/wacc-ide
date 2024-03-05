import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const LOCAL_STORAGE_CHANGE_EVENT = "localStorageChangeEvent";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const storeRecordInLocalStorage = (
  filename: string,
  fileContents: string
) => {
  try {
    // Combine filename and file content into a key-value pair
    const dataToStore = { [filename]: fileContents };

    // Convert the data to a JSON string
    const jsonData = JSON.stringify(dataToStore);

    // Store the JSON string in local storage
    localStorage.setItem(filename, jsonData);

    console.log(`Record successfully stored in local storage: ${filename}`);
  } catch (error: any) {
    console.error(`Error storing record in local storage: ${error.message}`);
  }
  window.dispatchEvent(new Event(LOCAL_STORAGE_CHANGE_EVENT));
};

export const getAllFilenamesFromLocalStorage = (): string[] => {
  try {
    // Get all keys (filenames) from local storage
    const allFilenames = Object.keys(localStorage);

    // Filter only the filenames that end with ".wacc"
    const waccFilenames = allFilenames.filter((filename) =>
      filename.endsWith(".wacc")
    );

    console.log("WACC filenames retrieved from local storage:", waccFilenames);

    return waccFilenames;
  } catch (error: any) {
    console.error(
      `Error retrieving filenames from local storage: ${error.message}`
    );
    return [];
  }
};

export const getFileFromLocalStorage = (filename: string): string | null => {
  try {
    // Get the JSON string stored in local storage for the given filename
    const jsonData = localStorage.getItem(filename);

    if (jsonData === null) {
      console.warn(`File not found in local storage for filename: ${filename}`);
      return null;
    }

    // Parse the JSON string to retrieve the file content
    const fileContent = JSON.parse(jsonData)[filename];

    console.log(`File content retrieved for filename: ${filename}`);

    return fileContent;
  } catch (error: any) {
    console.error(`Error retrieving file from local storage: ${error.message}`);
    return null;
  }
};

export const deleteFileFromLocalStorage = (filename: string) => {
  try {
    // Remove the item from local storage using the provided key
    localStorage.removeItem(filename);

    console.log(`Record successfully deleted from local storage: ${filename}`);

    // Dispatch the custom storage change event
    const customEvent = new Event(LOCAL_STORAGE_CHANGE_EVENT);
    window.dispatchEvent(customEvent);
  } catch (error: any) {
    console.error(`Error deleting record from local storage: ${error.message}`);
  }
};

export const DEFAULT_FILE_CONTENTS = `begin ${"\n\t"}println "Hello Wacc"${"\n"}end`;

export const splitAtEndOfSentence = (inputString: string) => {
  if (!inputString) {
    return [];
  }

  const sentenceSplitPattern = /[.!?]+/;

  // Use the pattern to split the string
  const sentences = inputString.split(sentenceSplitPattern);

  // Remove empty strings from the result
  const nonEmptySentences = sentences.filter(
    (sentence) => sentence.trim() !== ""
  );
  return nonEmptySentences;
};

export function extractErrorInformation(
  errorText: string
): { lineNumber: number; columnNumber: number; errorText: string } | null {
  const regex = /\(line (\d+), column (\d+)\):\n\s+(.*?)\n/g;
  const match = regex.exec(errorText);

  if (match) {
    const lineNumber = parseInt(match[1], 10);
    const columnNumber = parseInt(match[2], 10);
    const errorText = match[3];

    return { lineNumber, columnNumber, errorText };
  }

  return null;
}

export function findSemanticErrorLocation(code: string, errorMessage: string) {
  // Split the code into lines
  const lines = code.split("\n");

  // Find the line containing "in" (case-insensitive)
  const inLineIndex = lines.findIndex(
    (line) => line.trim().toLowerCase() === "in"
  );

  if (inLineIndex === -1) {
    // "in" not found, return an error message
    return "Error: 'in' not found in the code.";
  }

  // Find the line with the error message
  const errorLineIndex = lines.findIndex(
    (line, index) => index > inLineIndex && line.includes(errorMessage)
  );

  if (errorLineIndex === -1) {
    // Error message not found, return an error message
    return "Error: Semantic error message not found in the code after 'in'.";
  }

  // Extract the position of the error in the line
  const errorPosition = lines[errorLineIndex].indexOf(errorMessage);

  // Return the location information
  return {
    line: errorLineIndex + 1, // Line numbers start from 1
    column: errorPosition + 1, // Column numbers start from 1
  };
}

export function ensureWaccExtension(filename: string): string {
  // Check if the filename ends with '.wacc'
  if (!filename.endsWith(".wacc")) {
    // If not, add '.wacc' to the end
    filename += ".wacc";
  }

  return filename;
}
