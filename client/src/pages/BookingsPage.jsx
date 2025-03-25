import AccountNav from "../AccountNav";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { differenceInCalendarDays, format } from "date-fns";
import { Link, Navigate } from "react-router-dom";
import BookingDates from "../BookingDates";
import { UserContext } from "../UserContext";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(UserContext);

  if (!user) {
    console.log(user);
    return <Navigate to={"/login"} />;
  }

  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link
              to={`/account/bookings/${booking._id}`}
              key={booking._id}
              className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden"
            >
              <div className="w-48 sm:w-[220px]">
                <PlaceImg place={booking.place} />
              </div>
              <div className="xs:py-3 pr-3 grow flex flex-col justify-between items-center">
                <h2 className="text-[18px] xs:text-xl sm:text-3xl font-semibold mt-2 overflow-hidden flex-1">
                  {booking.place.title}
                </h2>
                <div className="sm:text-xl flex-1">
                  <BookingDates
                    booking={booking}
                    className="mb-2 xxs:mt-4 text-gray-500 text-[12px] xs:text-[16px] sm:text-2xl"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex gap-1 sm:mt-8 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 xs:w-8 xs:h-8 mt-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                    <span className="text-[14px] sm:text-3xl">
                      Total price: ${booking.price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
