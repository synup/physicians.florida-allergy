import { BusinessHour, Location } from "@/models/interfaces";
import moment from "moment";
import axios from "axios";
import Papa from "papaparse";

export const formatPhoneNumber = (phoneNumberString: string) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
};

export const DEFAULT_CONTAINER_STYLE = {
  width: "100%",
  height: "100vh",
};

export const RADIUS_THRESHOLD = 50; // in miles

export const DEFAULT_LOCATION = {
  lat: 41.850033,
  lng: -87.650052,
};

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  // Haversine formula to calculate distance between two points

  const earthRadius = 3956;
  const lat1Rad = (Number(lat1) * Math.PI) / 180;
  const lon1Rad = (Number(lon1) * Math.PI) / 180;
  const lat2Rad = (Number(lat2) * Math.PI) / 180;
  const lon2Rad = (Number(lon2) * Math.PI) / 180;

  // Calculate the differences
  const latDiff = lat2Rad - lat1Rad;
  const lonDiff = lon2Rad - lon1Rad;

  // Haversine formula
  const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate the distance
  const distance = earthRadius * c;
  return distance;
}

export const getWidth = () => {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
};

export const isEmpty = (data: any) => {
  if (
    data !== undefined &&
    data !== "undefined" &&
    data !== "" &&
    data !== null &&
    data !== "null"
  ) {
    return false;
  }
  return true;
};

export const haveValue = (data: any) => {
  if (isEmpty(data)) {
    return false;
  }
  return true;
};

export function getTodaySlots(
  businessHours: BusinessHour[]
): { end: string; start: string } | "CLOSED" | null {
  const today = new Date().toLocaleString("en-US", { weekday: "long" });

  const todayHours = businessHours?.find(
    (hour) => hour.day.toLowerCase() === today.toLowerCase()
  );

  if (!todayHours || todayHours.type === "CLOSED") {
    return "CLOSED";
  }

  return todayHours.slots[0] || null;
}

export const avgRating = (array: any) => {
  if (!haveValue(array)) {
    return [0, []];
  }

  const ratings = array.reduce((acc: any, curr: any) => {
    const rating = curr?.node?.rating;
    if (rating >= 1 && rating <= 5) {
      acc[rating] = acc[rating] || { count: 0, items: [] };
      acc[rating].count++;
      acc[rating].items.push(curr);
    }
    return acc;
  }, {});

  const RattingInfo = Object.entries(ratings)
    .map(([rating, { count, items }]: any) => ({
      rating: Number(rating),
      count,
      items,
    }))
    .sort((a, b) => b.count - a.count);

  const totalCount = RattingInfo.reduce((total, item) => total + item.count, 0);

  if (totalCount === 0) {
    return [0, []];
  }

  const weightedSum = RattingInfo.reduce(
    (sum, item) => sum + item.rating * item.count,
    0
  );
  const average = (Math.round((weightedSum / totalCount) * 10) / 10).toFixed(1);

  return [average, RattingInfo];
};

export const printTime = (date: any) => {
  return moment(date).subtract(10, "days").calendar(); // 09/23/2023
};

export function generatePaginationText(totalReviewCount: any, itemOffset: any) {
  const pageSize = 4;

  const startItem = itemOffset ? itemOffset : 1;
  const endItem = Math.min(startItem + pageSize - 1, totalReviewCount);

  return `Showing ${startItem} to ${endItem} of ${totalReviewCount} Reviews`;
}

export function calculatePercentage(part: number, whole: number) {
  if (whole === 0) {
    return 0; // Avoid division by zero
  }
  return (part / whole) * 100;
}

export function createGoogleSearchURL(
  placeName: string,
  address: any,
  city: string,
  state: string,
  country: string,
  lang: string = "en",
  region: string = "us"
) {
  // Base URL for Google Search
  const baseUrl = "https://www.google.com/search";

  // Construct the query string
  const query = `${placeName}, ${address}, ${city}, ${state}, ${country}`
    .split(" ")
    .join("+");

  // Example placeholder for ludocid and lrd parameters
  const ludocid = "SPECIFIC_PLACE_ID"; // Replace with actual LUDOCID
  const lsig = "SPECIFIC_SIGNATURE"; // Replace with actual signature if needed
  const lrd = "SPECIFIC_LOCATION_REFERENCE"; // Replace with actual LRD

  const url = `${baseUrl}?hl=${lang}-${region}&gl=${region}&q=${query}&ludocid=${ludocid}&lsig=${lsig}#lrd=${lrd}`;

  return url;
}

export const SortByName = (locations: any) => {
  return locations.sort((a: any, b: any) => {
    if (a.name && b.name) {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });
};

export const SortByDistance = (locations: any, currentCoordinate: any) => {
  return locations.sort((a: any, b: any) => {
    const distanceA = calculateDistance(
      currentCoordinate.lat,
      currentCoordinate.lng,
      a.latitude,
      a.longitude
    );
    const distanceB = calculateDistance(
      currentCoordinate.lat,
      currentCoordinate.lng,
      b.latitude,
      b.longitude
    );
    return distanceA - distanceB;
  });
};

export const getLocationSlug = (location: any) => {
  if (!location) {
    return null;
  }
  const customAttributes = location?.customAttributes;
  const slugName = customAttributes?.find((item: any) =>
    item.name.includes("Slug")
  );
  if (haveValue(slugName)) {
    const value = slugName.value[0];
    return value;
  }
  return null;
};

export const sortHours = (hours: BusinessHour[]): BusinessHour[] => {
  try {
    const sortedHours: BusinessHour[] = [];
    if (hours?.length > 0) {
      let day = "";
      const daysRequired = 6;
      for (let i = 0; i <= daysRequired; i++) {
        day = moment().add(i, "days").format("dddd");
        const dayHour = hours?.find(function (h) {
          return h?.day?.toLowerCase() == day?.toLowerCase();
        });
        sortedHours?.push(dayHour as BusinessHour);
      }
    }
    return sortedHours;
  } catch (e) {
    console.error(e);
  }
  return [];
};

export const BusinessHourLocations = (hours: BusinessHour[]) => {
  try {
    let businessHours = hours.filter((businessHourObject) => {
      return businessHourObject?.day?.toLowerCase() != "special";
    });
    businessHours = sortHours(businessHours);
    return businessHours;
  } catch (e) {
    console.error(e);
  }
  return [];
};

export const STATES: { name: string; iso: string }[] = [
  {
    name: "Alabama",
    iso: "AL",
  },
  {
    name: "Alaska",
    iso: "AK",
  },
  {
    name: "Arizona",
    iso: "AZ",
  },
  {
    name: "Arkansas",
    iso: "AR",
  },
  {
    name: "California",
    iso: "CA",
  },
  {
    name: "Colorado",
    iso: "CO",
  },
  {
    name: "Connecticut",
    iso: "CT",
  },
  {
    name: "Delaware",
    iso: "DE",
  },
  {
    name: "Florida",
    iso: "FL",
  },
  {
    name: "Georgia",
    iso: "GA",
  },
  {
    name: "Hawaii",
    iso: "HI",
  },
  {
    name: "Idaho",
    iso: "ID",
  },
  {
    name: "Illinois",
    iso: "IL",
  },
  {
    name: "Indiana",
    iso: "IN",
  },
  {
    name: "Iowa",
    iso: "IA",
  },
  {
    name: "Kansas",
    iso: "KS",
  },
  {
    name: "Kentucky",
    iso: "KY",
  },
  {
    name: "Louisiana",
    iso: "LA",
  },
  {
    name: "Maine",
    iso: "ME",
  },
  {
    name: "Maryland",
    iso: "MD",
  },
  {
    name: "Massachusetts",
    iso: "MA",
  },
  {
    name: "Michigan",
    iso: "MI",
  },
  {
    name: "Minnesota",
    iso: "MN",
  },
  {
    name: "Mississippi",
    iso: "MS",
  },
  {
    name: "Missouri",
    iso: "MO",
  },
  {
    name: "Montana",
    iso: "MT",
  },
  {
    name: "Nebraska",
    iso: "NE",
  },
  {
    name: "Nevada",
    iso: "NV",
  },
  {
    name: "New Hampshire",
    iso: "NH",
  },
  {
    name: "New Jersey",
    iso: "NJ",
  },
  {
    name: "New Mexico",
    iso: "NM",
  },
  {
    name: "New York",
    iso: "NY",
  },
  {
    name: "North Carolina",
    iso: "NC",
  },
  {
    name: "North Dakota",
    iso: "ND",
  },
  {
    name: "Ohio",
    iso: "OH",
  },
  {
    name: "Oklahoma",
    iso: "OK",
  },
  {
    name: "Oregon",
    iso: "OR",
  },
  {
    name: "Pennsylvania",
    iso: "PA",
  },
  {
    name: "Rhode Island",
    iso: "RI",
  },
  {
    name: "South Carolina",
    iso: "SC",
  },
  {
    name: "South Dakota",
    iso: "SD",
  },
  {
    name: "Tennessee",
    iso: "TN",
  },
  {
    name: "Texas",
    iso: "TX",
  },
  {
    name: "Utah",
    iso: "UT",
  },
  {
    name: "Vermont",
    iso: "VT",
  },
  {
    name: "Virginia",
    iso: "VA",
  },
  {
    name: "Washington",
    iso: "WA",
  },
  {
    name: "Washington, D.C.", // adding this because its present in the platform
    iso: "DC",
  },
  {
    name: "West Virginia",
    iso: "WV",
  },
  {
    name: "Wisconsin",
    iso: "WI",
  },
  {
    name: "Wyoming",
    iso: "WY",
  },
];

export const formatSlug = (value: string) => {
  return value
    ?.toLowerCase()
    ?.replaceAll(",", "")
    ?.replaceAll("#", "")
    ?.replaceAll("*", "")
    ?.replaceAll("(", "")
    ?.replaceAll("/", "")
    ?.replaceAll("&", "")
    ?.split(" ")
    ?.join("-");
};

export const getLocationObjectFromGoogleSheetObject = (
  row: any
): Partial<Location> | null => {
  let location: Partial<Location> | null = null;

  location = {
    id: row["Location id"] || "",
    name: row["Name"] || "",
    street: row["Address Line 1"] || "",
    city: row["City"] || "",
    stateIso: row["State"] || "",
    countryIso: row["Country"] || "",
    postalCode: row["Postal Code/Zip Code"] || "",
    latitude: row["Latitude"] || "-9999",
    longitude: row["Longitude"] || "-9999",
    phone: row["Primary phone"] || "",
    description: row["Description"],
  };
  location["stateName"] =
    STATES?.find((state) => state?.iso === location?.stateIso)?.name || "";
  return location;
};

export const isShowCareerPage = (slug: string) => {
  const arr = [
    "/arizona/tucson/3925-n-flowing-wells-rd",
    "/arizona/tucson/1703-w-valencia-rd",
    "/arizona/tucson/3725-e-fort-lowell-rd",
    "/arizona/tucson/7201-east-22nd-street",
    "/arizona/casa-grande/1325-e-florence-blvd",
    "/arizona/sierra-vista/2105-e-fry-blvd",
  ];

  return arr.includes(slug);
};

export const getCoverImage = (locationPhotos: any) => {
  const coverImage = locationPhotos.find(
    (attr: {
      name?: string;
      url?: string;
      thumbnailUrl?: string;
      type?: string;
    }) => attr.type === "COVER"
  );
  return coverImage?.url;
};

export const getRedirectLink = async (providedLocation: string) => {
  try {
    providedLocation = providedLocation.startsWith("/")
      ? providedLocation.slice(1)
      : providedLocation;

    providedLocation = providedLocation.toLowerCase();
    const sheetId = "1kiA6SyDqRXk68ERC3YTCdAJ_EHznHrwR";
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=details`;

    const response = await axios.get(sheetUrl);
    const data = response?.data;

    //Parse data using PapaParse
    const parsedData = Papa.parse(data, {
      header: true,
    });

    interface ParsedRow {
      "Location URL": string;
      "Redirect link": string;
      "Button Name": string;
    }

    const match = (parsedData?.data as ParsedRow[]).find((row: ParsedRow) => {
      if (!row["Location URL"]) return false;
      try {
        const locationPath = new URL(row["Location URL"]).pathname
          .slice(1)
          .toLowerCase();
        return locationPath === providedLocation;
      } catch (error) {
        console.log(error,"error")
        return false;
      }
    });

    if (match) {
      return {
        title: match["Button Name"] ?? null,
        href: match["Redirect link"] ?? null,
      };
    }

    return null;
  } catch (error: any) {
    console.log("Error in getRedirectLink", error?.mes);
    return null;
  }
};

export const getCenterPosition = (
  locations: { lat: number; lng: number }[]
) => {
  if (locations.length === 0) {
    return { lat: 0, lng: 0 };
  }
  const total = locations.reduce(
    (acc, loc) => {
      acc.lat += loc.lat;
      acc.lng += loc.lng;
      return acc;
    },
    { lat: 0, lng: 0 }
  );

  const center = {
    lat: total.lat / locations.length,
    lng: total.lng / locations.length,
  };

  return center;
};
