import { Location } from "@/models/interfaces";
import request, { gql } from "graphql-request";
import { SYNUP_API_KEY } from "../constants";
import axios from "axios";
export const fetchLocations = async (): Promise<Partial<Location>[]> => {
  try {
    const ALL_STATES = gql`
      {
        filterLocations(first: 10000, approved: true, archived: false) {
          edges {
            node {
              id
              name
              stateIso
              postalCode
              street
              street1
              city
              latitude
              longitude
              description
              ownerEmail
              countryIso
              phone
              paymentMethods
              stateName
              subCategoryName
              additionalCategoryNames
              locationPhotos {
                url
                type
              }
              customAttributes {
                name
                value
              }
              businessHours {
                day
                type
                slots {
                  start
                  end
                }
                specialDate
              }
            }
          }
        }
      }
    `;
    const statesDataFromPlatform: {
      filterLocations?: {
        edges?: { node: Partial<Location> }[];
      };
    } = await request({
      url: `https://v2.synup.com/graphql?date=${new Date().getTime()}`,
      document: ALL_STATES,
      requestHeaders: {
        authorization: `API ${SYNUP_API_KEY}`,
      },
    });

    let allLocations: Partial<Location>[] = [];
    if (Array.isArray(statesDataFromPlatform?.filterLocations?.edges)) {
      allLocations = statesDataFromPlatform.filterLocations.edges.map(
        (l: { node: Partial<Location> }) => l.node
      );
    }
    return allLocations as Location[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchReview = async (
  locationId: string,
) => {
  try {
    const review = await axios.get(`/api/reviews-list?id=${locationId}`);
    return review.data.locations;
  } catch (error) {
    console.error("error while update", error);
    return [];
  }
};
