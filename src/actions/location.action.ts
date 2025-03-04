import { LOCATIONS_SHEET_ID } from "@/lib/constants";
import {
  formatSlug,
  getLocationObjectFromGoogleSheetObject,
} from "@/lib/helper";
import { Location } from "@/models/interfaces";
import axios from "axios";
import Papa from "papaparse";

// Key mapping: Old column names → New formatted keys
const keyMapping: Record<string, string> = {
  "Synup ID": "synupId",
  "NPI": "npi",
  "First Name": "first_name",
  "Middle Initial": "middle_initial",
  "Last Name": "last_name",
  "Degrees": "degrees",
  "Title": "title",
  "Doctor's Website URL": "doctor_website_url",
  "Office Name": "office_name",
  "Office Website URL": "office_website_url",
  "Address > Line 1": "address_line_1",
  "Address > Line 2": "address_line_2",
  "State": "state",
  "Postal Code": "postal_code",
  "County": "county",
  "Website URL > URL": "website_url",
  "Toll free": "toll_free",
  "Social Media Icons/Instagram": "instagram",
  "Social Media Icons: Facebook": "facebook",
  "Social Media Icons: LinkedIn": "linkedin",
};

// Function to rename keys based on mapping
const renameKeys = (data: any[], mapping: Record<string, string>) => {
  return data.map((row) => {
    const newRow: any = {};
    Object.keys(row).forEach((key) => {
      const newKey = mapping[key] || key; // Use new key if available, else keep original
      newRow[newKey] = row[key];
    });
    return newRow;
  });
};

export const fetchSheetData = async (slug: string) => {
  let sheetLocations: Partial<Location>[] = [];
  try {
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${LOCATIONS_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=details`;

    const response = await axios.get(sheetUrl);

    const parsedData = Papa.parse(response.data, {
      skipEmptyLines: true,
      transformHeader: (header: any) => header.trim(),
    });

    if (parsedData.data.length > 0 && !parsedData.data[0]["npi"]) {
      parsedData.data.unshift(
        parsedData.meta.fields?.reduce((obj: any, key: number) => {
          obj[key] = ""; // Insert an empty row to fix alignment
          return obj;
        }, {} as Record<string, string>) || {}
      );
    }

    if (Array.isArray(parsedData.data) && parsedData.data.length > 0) {
      // Rename keys in parsed data
      const transformedData = renameKeys(parsedData.data, keyMapping);

      transformedData.forEach((row: any) => {
        if (row["npi"]) {
          const location = getLocationObjectFromGoogleSheetObject(row);
          if (location) sheetLocations.push(location);
        }
      });

      return transformedData;
    }
  } catch (e) {
    console.error(`Error fetching Google Sheets data: ${e}`);
  }

  if (!Array.isArray(sheetLocations)) {
    sheetLocations = [];
  }

  // Format slug
  const formatSlugInfo = (loc: any) =>
    `/${formatSlug(loc?.state)}/${formatSlug(loc.city)}/${formatSlug(
      loc.address_line_1
    )}`;

  // Find matching location by slug
  const existLocation = sheetLocations.find(
    (loc) => formatSlugInfo(loc) === slug
  );

  return existLocation || null;
};
