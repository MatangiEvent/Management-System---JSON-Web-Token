import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../Shared/Components/Table";
import Loading from "../../../Shared/Components/Loading";
import { getLoggedInUser } from "../../../Shared/Store/LoginAuthStore";
import { fetchPgBookingsByRegisterId } from "../../../Shared/Store/PgBookingAuthStore";
import { PgBookingBody as PgBookingBodyModel } from "../../../Shared/Models/PgBooking.model";

const UserPgBooking: React.FC = () => {
  const [pgBookings, setPgBookings] = useState<PgBookingBodyModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getPgBookings = async (registerId: string | null) => {
    setLoading(true);
    if (!registerId) {
      setError("Register ID is missing.");
      setLoading(false);
      navigate("/");
      return;
    }

    try {
      const pgBooking = await fetchPgBookingsByRegisterId(registerId);
      if (Array.isArray(pgBooking)) {
        setPgBookings(
          pgBooking.filter((booking) => booking.pgDetail[0].isVerified)
        );
      } else if (pgBooking && typeof pgBooking === "object") {
        if (pgBooking.isVerified) {
          setPgBookings([pgBooking]);
        } else {
          setPgBookings([]);
        }
      } else {
        setPgBookings([]);
      }
    } catch (err) {
      setError("Failed to fetch Bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchRegisterIdAndBookings = async () => {
        try {
          setLoading(true);
          const registerId = await getLoggedInUser();
          if (!registerId._id) {
            navigate("/login");
          } else if (registerId._id) {
            getPgBookings(registerId._id);
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
  }, [navigate]);

  if (loading) {
    return <Loading size={50} />;
  }

  if (error) {
    return <div className="m-6 text-center text-red-500">{error}</div>;
  }

  // Check if pgBookings is empty
  if (pgBookings.length === 0) {
    return (
      <div className="bg-white pt-24 px-5 md:px-8 lg:px-14 mb-10">
        <div className="w-full">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold text-blue-500">Pg Booking</h2>
          </div>
          {/* No bookings message */}
          <div className="text-center">
            <p className="text-lg font-semibold">No booking found</p>
            <button
              onClick={() => navigate("/allavailablepg")}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              View Available PGs
            </button>
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    "Sr No.",
    "Pg Booking ID",
    "Pg Owner",
    "Address",
    "Price",
    "Gender",
    "Start Date",
    "Status",
    "Payment Status",
  ];

  const data = pgBookings.map((pgBooking, index) => ({
    No: index + 1,
    _id: pgBooking._id,
    provider_id: pgBooking.pgOwnerDetail?.[0]?.name || "N/A",
    address: `${pgBooking.pgDetail?.[0]?.address}, ${pgBooking.pgDetail?.[0]?.street}, ${pgBooking.pgDetail?.[0]?.city}, ${pgBooking.pgDetail?.[0]?.state}, ${pgBooking.pgDetail?.[0]?.country}`,
    price: pgBooking.pgDetail?.[0]?.price || "N/A",
    gender: pgBooking.gender || "N/A",
    startDate: pgBooking.start_date
      ? new Date(pgBooking.start_date).toLocaleDateString()
      : "N/A",
    status: pgBooking.status || "N/A",
    paymentStatus: pgBooking.payment_status || "N/A",
  }));

  return (
    <div className="bg-white pt-24 px-5 md:px-8 lg:px-14 mb-10">
      <div className="w-full">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-blue-500">Pg Booking</h2>
        </div>
        <Table
          columns={columns}
          data={data}
          editHeadName="Cancel Booking"
          editName="Cancel Booking"
          editStatus={false}
          deleteStatus={false}
        />
      </div>
    </div>
  );
};

export default UserPgBooking;
