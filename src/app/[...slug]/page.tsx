

import Image from "next/image";
import { GraphQLClient, gql } from "graphql-request";
import InternalPagesFooter from "@/components/Footer/InternalPagesFooter";
import { notFound } from "next/navigation";
import { SYNUP_API_KEY } from "@/lib/constants";
import {
  BusinessHourLocations,
  formatPhoneNumber,
  getTodaySlots,
} from "@/lib/helper";
import { BusinessHour } from "@/models/interfaces";
import Link from "next/link";
import SingleLocationMap from "@/components/Map/SingleLocationMap";
import { fetchSheetData } from "@/actions/location.action";
import DocDetHeader from "@/components/doc-det-head/page";


const fetchLocation = async (locationId: string) => {
  try {
    if (!locationId) {
      return notFound();
    }
    const LOCATION = gql`
        {
          getLocationsByIds(ids: ["${locationId}"]) {
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
            archivedAt
            archived
          }
        }
      `;

    const graphqlClient = new GraphQLClient(
      `https://v2.synup.com/graphql?date=${new Date().getTime()}`,
      {
        headers: {
          authorization: `API ${SYNUP_API_KEY}`,
        },
      }
    );

    const locationData: any = await graphqlClient.request(LOCATION);
    console.log(locationData, 'locationData');
    return locationData.getLocationsByIds[0];
  } catch (error) {
    console.error("error while fetch loc", error);
    return null;
  }
};

const fetchLocationSlug = async (slug: string) => {
  try {
    const QUERY = gql`
        {
          filterLocations(
            first: 1
            approved: true
            archived: null
            input: {
              customAttributes: {
                customAttrName: "Slug"
                customAttrValues: ["${slug}"]
              }
            }
          ) {
            edges {
              node {
                id
              }
            }
          }
        }
      `;

    const graphqlClient = new GraphQLClient(
      `https://v2.synup.com/graphql?date=${new Date().getTime()}`,
      {
        headers: {
          authorization: `API ${SYNUP_API_KEY}`,
        },
      }
    );

    const locationData: any = await graphqlClient.request(QUERY);
    let locationId = null;

    if (Array.isArray(locationData?.filterLocations?.edges)) {
      locationId = locationData.filterLocations.edges.map(
        (l: { node: any }) => l.node
      )[0].id;
    }
    return locationId;
  } catch (error) {
    console.error("error while fetch loc", error);
    return null;
  }
};

const AboutLocation = async ({ params }: any) => {
  const { slug: slg } = await params;

  const slug = `/${slg.map((item: any) => item.toLowerCase()).join("/")}`;
  const locationId = await fetchLocationSlug(slug);

  if (!locationId) {
    return notFound();
  }

  const location = await fetchLocation(locationId);
  const todayHours = getTodaySlots(location?.businessHours as BusinessHour[]);
  const businessHours = BusinessHourLocations(
    location?.businessHours as BusinessHour[]
  );

  const ExcelDataKeys: any = {
    "synup_id": 0,
    "npi": 1,
    "first_name": 2,
    "middle_initial": 3,
    "last_name": 4,
    "degrees": 5,
    "title": 6,
    "doctor_website_url": 7,
    "office_name": 8,
    "office_website_url": 9,
    "address_line_1": 10,
    "address_line_2": 11,
    "state": 12,
    "postal_code": 13,
    "county": 14,
    "website_url": 15,
    "toll_free": 16,
    "instagram": 17,
    "facebook": 18,
    "linkedin": 19,
    "pictureUrl": 20
  };

  // Fetch Excel data
  const excelData = await fetchSheetData(slug);


  const filterdataByAddress = async (id: any) => {
    if (!excelData || !Array.isArray(excelData)) {
      console.error("Excel data is empty or invalid.");
      return [];
    }
    const filteredData = excelData.filter(
      (data: any) => String(data[ExcelDataKeys.synup_id]) === String(id)
    );
    // console.log(filteredData,"filteredData");
    if (filteredData.length === 0) {
      return notFound();
    }
    return filteredData[0];
  };

  function decodeBase64(base64String: any) {
    const decodedBuffer = Buffer.from(base64String, 'base64');
    const decodedString = decodedBuffer.toString('utf-8');
    return decodedString.replace(/^Location:\s*/, '');
  }

  const printNames = (result: any) => {
    const nameItems = [];
    if (result[ExcelDataKeys["first_name"]]) {
      nameItems.push(result[ExcelDataKeys["first_name"]]);
    }
    if (result[ExcelDataKeys["middle_initial"]]) {
      nameItems.push(result[ExcelDataKeys["middle_initial"]]);
    }
    if (result[ExcelDataKeys["last_name"]]) {
      nameItems.push(result[ExcelDataKeys["last_name"]]);
    }
    return nameItems.join(" ");
  }

  const id = location.id;
  const base64Id: any = decodeBase64(id);

  const result = await filterdataByAddress(base64Id);

  console.log(result)

  const convertGoogleDriveLink = (url: string) => {
    const match = url.match(/[-\w]{25,}/);
    return match ? `https://drive.google.com/uc?export=view&id=${match[0]}` : url;
  };

  const getDoctorBio = () => {
    const customAttrs = location.customAttributes;
    for (const customAttr of customAttrs) {
      if (customAttr["name"] === "Doctor bio") {
        if (customAttr["value"] && customAttr["value"].length > 0) {
          return customAttr["value"].join(" ");
        }
      }
    }
    return null;
  }

  return (
    <>


      <DocDetHeader getlocation={location} />
      {/* Hero */}
      <div className="bg-[url('/img/bg.png')] bg-cover bg-center py-[50px] md:py-[64px] relative hero-bnr">
        <div className="container mx-auto px-[15px] flex flex-col justify-center items-center h-full text-white relative z-10">
          <h1 className="banner-heading font-light mb-[8px]">
            {printNames(result)}, {result[ExcelDataKeys["degrees"]]}
          </h1>
          <p className="mt-1 banner-content text-center  mb-[16px]">
            {result[ExcelDataKeys["title"]]}
          </p>
          <Link href={result[ExcelDataKeys["doctor_website_url"]]} className="bg-[#373a3c] px-6 py-2 text-center text-sm md:text-lg text-[15px] font-medium mt-1">
            Request an Appointment in {result[ExcelDataKeys["office_name"]]}
          </Link>
        </div>
      </div>

      {/* Doctor Section */}
      <div className="container px-[15px] mx-auto flex py-[32px]  flex-col md:flex-row  md:items-none gap-8 border-b border-[#e5e5e5]">
        {/* <div className=""> */}
        <Image
          src={
            result[ExcelDataKeys["pictureUrl"]]
              ? convertGoogleDriveLink(result[ExcelDataKeys["pictureUrl"]])
              : `https://placehold.co/400x400?text=${encodeURIComponent(printNames(result))}`
          }
          alt=""
          width={300}
          height={550}
          className="w-full md:w-[300px]"

        />
        {/* </div> */}
        <div className=" flex-1">
          <p className="mb-[16px] text-center md:text-start  text-[#373a3c]">{getDoctorBio()}</p>
          <div className="flex flex-col md:flex-row gap-0 md:gap-5">
            <Link href={result[ExcelDataKeys["doctor_website_url"]]} className="px-[16px] text-center py-[8px] bg-[#3fae49] text-[18px] text-white my-[16px]">
              Learn More
            </Link>
            <Link href="" className="px-[16px]  py-[8px] bg-[#373a3c] hover:bg-[#252728] text-[18px] text-center text-white my-[16px]">
              Visit Dr. {result[ExcelDataKeys["last_name"]]} in Hialeah
            </Link>
          </div>
        </div>
      </div>

      {/* <hr className="text-gray-300 h-10 w-[80%] mx-auto" /> */}

      {/* Map Section */}
      <div className="container  mx-auto px-[15px] pt-[32px] md:py-[32px]">
        <div className="flex flex-col items-center">
          <h1 className="text-[22px] text-[#373a3c] mb-2 font-light font-medium ">
            {todayHours === "CLOSED" ? "Currently Closed" : "Currently Open"}
          </h1>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-3 lg:gap-0 mt-4 ">
            <div className=" mb-[24px]">
              <h1 className="text-[22.5px] mb-[8px] text-[#373a3c] font-wight">
                Address
              </h1>
              <p className="w-72 text-[#373a3c]">
                {location?.street}
                {location?.street1 ? `, ${location?.street1}` : ""}
                {location?.city ? `, ${location?.city}` : ""}
                {location?.stateName ? `, ${location?.stateName}` : ""}
                {location?.postalCode ? `, ${location?.postalCode}` : ""}
                {location?.countryIso ? `, ${location?.countryIso}` : ""}
              </p>
              <p className="mt- text-[15px] ">
                {location?.phone && formatPhoneNumber(location?.phone)}
              </p>
              <p className="mt- text-[15px] mb-[16px] text-[#373a3c]">
                {location?.ownerEmail}
              </p>
              {location?.latitude && location?.longitude && (
                <Link
                  className="text-[18.75px] px-[16px] py-[8px] mt-[16px] border block md:inline text-center  w-[100%] bg-[#3fae49] text-white"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${location?.latitude},${location?.longitude}`}
                  target="_blank"
                >
                  Get Directions
                </Link>

              )}

            </div>
            <div className=" mb-[24px]">
              <h1 className="text-[22.5px] font-light mb-[8px] ">
                Office Hours
              </h1>
              <div className="flex flex-col current-day">
                {businessHours?.map((hours: BusinessHour) => (
                  <div className="flex  text-[#373a3c]" key={hours.day}>
                    <div className=" md:w-[25%] w-[30%]">
                      <p className="py-[1px] pl-[1px] pr-[10px] ">{hours.day}</p>
                    </div>
                    {hours?.type === "CLOSED" ? (
                      <div className="w-40">CLOSED</div>
                    ) : (
                      <div className="w-40">
                        {hours.slots[0].start.toUpperCase()} –{" "}
                        {hours.slots[0].end.toUpperCase()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className=" md:mb-[24px] -mx-[15px] md:mx-[0]">
              <SingleLocationMap location={location} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <InternalPagesFooter result={result} />
    </>
  );
};

export default AboutLocation;
