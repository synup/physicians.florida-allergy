export interface Location {
  id: string;
  databaseId: number;
  name: string;
  stateIso: string;
  stateName: string;
  countryIso: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  description?: string;
  street: string;
  street1?: string;
  city: string;
  ownerEmail?: string;
  phone: string;
  paymentMethods?: string[];
  subCategoryName: string;
  additionalCategoryNames: string[];
  locationPhotos: {
    url: string;
    name: string;
    type: string;
    thumbnailUrl: string;
  }[];
  customAttributes: {
    name: string;
    value: string;
  }[];
  businessHours: BusinessHour[];
  bizUrl?: string;
}

export interface BusinessHour {
  day: string;
  slots: {
    end: string;
    start: string;
  }[];
  specialDate: string;
  type: string;
}

export type Slot = {
  start: string | null;
  end: string | null;
};

type BusinessDay = {
  day: string;
  type: "OPEN" | "CLOSED";
  slots: Slot[];
  specialDate: string | null;
};

export type DayHours = {
  start: string | null;
  end: string | null;
};
