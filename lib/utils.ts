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

export function ensureWaccExtension(filename: string): string {
  // Check if the filename ends with '.wacc'
  if (!filename.endsWith(".wacc")) {
    // If not, add '.wacc' to the end
    filename += ".wacc";
  }

  return filename;
}

export function extractSyntaxErrorInformation(errorText: string): {
  lineNumber: number;
  columnNumber: number;
  errorText: string;
  endColNumber?: number;
} | null {
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

export function extractSemanticErrorInformation(
  errorText: string,
  fileText: string
): {
  lineNumber: number;
  columnNumber: number;
  errorText: string;
  endColNumber?: number;
} | null {
  //console.log({ errorText, fileText });

  const semanticErr = extractExpectedString(errorText)
    ?.split("\n")[0]
    ?.split("in ")[1];

  console.log({ semanticErr });

  if (!semanticErr) return null;

  let lineNumber = -1;
  const lines = fileText.split("\n");

  console.log(lines);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].replace(/\s/g, "").includes(semanticErr.replace(/\s/g, ""))) {
      lineNumber = i;
      break;
    }
  }

  console.log(lineNumber);
  if (lineNumber === -1) return null;

  const pos = findSubstringPosition(lines[lineNumber], semanticErr);

  const err = errorText.split("returned:")[1];

  return {
    lineNumber: lineNumber + 1,
    columnNumber: (pos?.firstCharIndex ?? -2) + 1,
    errorText: err,
    endColNumber: (pos?.lastCharIndex ?? -2) + 1,
  };
}

function extractExpectedString(inputString: string) {
  const regex = /Expected (.+), but got (.+)\n(.+)/;
  const match = inputString.match(regex);

  if (match) {
    // Extract the string after the expected/got message
    const extractedString = match[3].trim();
    return extractedString;
  } else {
    // Return null if the pattern is not found
    return null;
  }
}

function findSubstringPosition(mainString: string, subString: string) {
  // Escape special characters in the substring for creating a RegExp
  const escapedSubString = subString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Create a regular expression to match the substring with any whitespace
  const regex = new RegExp(escapedSubString.split(/\s+/).join("\\s*"));

  // Find the match in the main string
  const match = mainString.match(regex);

  if (match) {
    // Get the position of the first and last character of the substring
    const firstCharIndex = match.index;
    const lastCharIndex = firstCharIndex! + match[0].length - 1;

    return { firstCharIndex, lastCharIndex };
  } else {
    // Return null if the substring is not found
    return null;
  }
}
