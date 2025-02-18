import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../Shared/Components/Table";
import Loading from "../../../Shared/Components/Loading"; // Import the Loading component
import { Booking as BookingModel } from "../../../Shared/Models/Booking.model";
import { fetchBookingsByRegisterId } from "../../../Shared/Store/BookingAuthStore";
import { getLoggedInUser } from "../../../Shared/Store/LoginAuthStore";

const UserMaidBooking: React.FC = () => {
  const [bookings, setBookings] = useState<BookingModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getBookings = async (registerId: string | null) => {
    setLoading(true);
    if (!registerId) {
      setError("Register ID is missing.");
      setLoading(false);
      return;
    }

    try {
      const maidBooking = await fetchBookingsByRegisterId(registerId);
      if (Array.isArray(maidBooking)) {
        setBookings(maidBooking);
      } else if (maidBooking && typeof maidBooking === "object") {
        setBookings([maidBooking]); // Wrap in an array
      } else {
        setBookings([]); // Default to an empty array
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token)
    {
      const fetchRegisterIdAndBookings = async () => {
        try {
          setLoading(true);
          const registerId = await getLoggedInUser();
          if (!registerId._id) {
            navigate("/login");
          } else {
            getBookings(registerId._id);
          }
        } catch (error) {
          console.error(error);
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
      fetchRegisterIdAndBookings();
    }
    else{
      navigate("/");
    }
    
  }, [navigate]);

  if (loading) {
    return <Loading size={50} />;
  }

  if (error) {
    return <div className="pt-24 text-center text-red-500">{error}</div>;
  }

  const columns = [
    "Sr No.",
    "Booking ID",
    "UserName",
    "Provider Name",
    "Male",
    "Category",
    "Sub Category",
    "Start Date",
    "Status",
  ];

  const data = bookings.map((booking, index) => ({
    No: index + 1,
    _id: booking._id,
    user_id: booking.userDetail?.[0]?.name || "N/A",
    provider_id: booking.providerDetail?.[0]?.name || "N/A",
    male: booking.gender || "N/A",
    category_id: booking.category?.[0]?.name || "N/A",
    subcategory_id: booking.subcategory?.[0]?.name || "N/A",
    startDate: booking.start_date
      ? new Date(booking.start_date).toLocaleDateString()
      : "N/A",
    status: booking.status || "N/A",
  }));

  return (
    <div className="bg-white pt-24 px-5 md:px-8 lg:px-14 mb-10">
      <div className="w-full">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-blue-500">Maid Booking</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center pt-24">
            <p className="text-lg text-gray-500">No bookings found.</p>
            <button
              onClick={() => navigate("/maidbooking")}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Do Booking
            </button>
          </div>
        ) : (
          <Table
            columns={columns}
            data={data}
            editHeadName="Cancel Booking"
            editName="Cancel Booking"
            editStatus={false}
            deleteStatus={false}
          />
        )}
      </div>
    </div>
  );
};

export default UserMaidBooking;