import { useGeolocation } from "@/hooks/useGeolocation";
import {
  calculateDistance,
  getLocationSlug,
  getTodaySlots,
} from "@/lib/helper";
import { Location, BusinessHour } from "@/models/interfaces";
import Link from "next/link";
import Loader from "@/components/Loader/Loader";

type PhysicianResultProps = {
  locations?: Partial<Location>[];
  searchPlace?: {
    city?: string;
    state?: string;
  };
  loading: boolean;
  onLocationHover: (index: number) => void;
};

let interval: ReturnType<typeof setTimeout> | null = null;

const PhysicianResult = (props: PhysicianResultProps) => {
  const { locations, searchPlace, loading = false, onLocationHover } = props;
  const { location: currentCoordinate } = useGeolocation();

  const handleMouseEnter = (index: number) => {
    if (interval) clearTimeout(interval);
    interval = setTimeout(() => {
      onLocationHover(index);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (interval) clearTimeout(interval);
    interval = setTimeout(() => {
      onLocationHover(-1);
    }, 500);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <p
        className="mt-[15px] text-[15px] text-[#373A3C]"
        dangerouslySetInnerHTML={{
          __html:
            locations && locations.length > 0
              ? `${locations.length} near <span class="font-bold">${searchPlace?.city} ${searchPlace?.state}</span>`
              : "",
        }}
      ></p>
      <div className="mt-4 bg-white  flex-1 overflow-y-auto">
        {locations?.map((location, index) => {
          const todayHours = getTodaySlots(
            location.businessHours as BusinessHour[]
          );
          const slug = getLocationSlug(location);
          return (
            <div
              className="flex gap-3 mb-5 hover:bg-[#eee] p-4"
              key={index}
              onMouseEnter={handleMouseEnter.bind(null, index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="text-[15px] text-[#373A3C]">{index + 1}.</div>
              <div className="w-full flex justify-between">
                <div>
                  <p className="text-[15px] text-[#2780E3] hover:underline hover:text-[#165BA8] font-bold">
                    {slug && (
                      <Link
                        className=""
                        href={String(slug)}
                      >
                        {location.name}
                      </Link>
                    )}
                  </p>
                  <div className="text-[15px] text-[#373A3C] ">
                    {todayHours === "CLOSED" ? (
                      <span className="font-[700]">CLOSED</span>
                    ) : todayHours ? (
                      <>
                        <p className="">
                          <span className="font-[700]">Open at</span>{" "}
                          {todayHours.start}
                        </p>
                        <p className="">
                          <span className="font-[700]">Closed at</span>{" "}
                          {todayHours.end}
                        </p>
                      </>
                    ) : (
                      <span className="font-[700]">Hours not available</span>
                    )}
                    <p>
                      {location.street},{location.city}, {location.stateName}
                    </p>
                    <p>{location.countryIso}</p>
                    <p>{location.phone}</p>
                  </div>

                  {location?.latitude && location?.longitude && (
                    <Link
                      href={`https://www.google.com/maps/dir/?api=1&destination=${location?.latitude},${location?.longitude}`}
                      target="_blank"
                      className="text-[#2780E3] text-[15px] block cursor-pointer hover:underline"
                    >
                      Get Directions
                    </Link>
                  )}
                  {slug && (
                    <Link
                      className="text-[#2780E3] text-[15px] block cursor-pointer hover:underline"
                      href={String(slug)}
                    >
                      View Details
                    </Link>
                  )}
                </div>
                <div className="align-center">
                  {currentCoordinate && (
                    <>
                      {currentCoordinate &&
                        calculateDistance(
                          currentCoordinate.lat,
                          currentCoordinate.lng,
                          Number(location.latitude),
                          Number(location.longitude)
                        ).toFixed(2)}{" "}
                      Miles away
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PhysicianResult;
