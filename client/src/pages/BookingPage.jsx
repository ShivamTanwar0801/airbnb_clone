import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center       justify-center sm:justify-between flex-wrap">
        <div className="items-center xxs:text-center sm:text-start">
          <h2 className="text-xl sm:text-2xl mb-4 text-wrap">
            Your booking information:
          </h2>
          <BookingDates booking={booking} />
        </div>
        <div className="bg-primary w-full mt-4 sm:mt-0 sm:w-auto sm:p-6 text-white rounded-2xl text-center">
          <div>Total price</div>
          <div className="sm:text-3xl">₹{booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
}
