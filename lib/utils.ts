import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const storeRecordInLocalStorage = (
  filename: string,
  fileContents: string
) => {
  try {
    // Combine filename and file content into a key-value pair
    const dataToStore = { [filename + ".wacc"]: fileContents };

    // Convert the data to a JSON string
    const jsonData = JSON.stringify(dataToStore);

    // Store the JSON string in local storage
    localStorage.setItem(filename + ".wacc", jsonData);

    console.log(`Record successfully stored in local storage: ${filename}`);
  } catch (error: any) {
    console.error(`Error storing record in local storage: ${error.message}`);
  }
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
    const jsonData = localStorage.getItem(filename + ".wacc");

    if (jsonData === null) {
      console.warn(`File not found in local storage for filename: ${filename}`);
      return null;
    }

    // Parse the JSON string to retrieve the file content
    const fileContent = JSON.parse(jsonData)[filename + ".wacc"];

    console.log(`File content retrieved for filename: ${filename}`);

    return fileContent;
  } catch (error: any) {
    console.error(`Error retrieving file from local storage: ${error.message}`);
    return null;
  }
};

export const DEFAULT_FILE_CONTENTS = `begin ${"\n\t"}println "Hello Wacc"${"\n"}end`;
