"use server";
import axios from "axios";

export const geoSearchHandler = async (payload: any) => {
  try {
    const response = await axios.get(
      "https://liveapi.yext.com/v2/accounts/me/entities/geosearch",
      {
        params: {
          radius: 50,
          location: payload.location,
          limit: 25,
          api_key: process.env.YEST_API_KEY,
          v: "20181201",
          resolvePlaceholders: true,
          languages: "en",
          entityTypes: "healthcareProfessional",
        },
      }
    );
    return {
      error: false,
      message: "successfull",
      data: response.data.response,
    };
  } catch (error) {
    console.error("GeoSearch API Error:", error);
    return {
      error: true,
      message: "something went wrong!",
      data: null,
    };
  }
};
