import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import AuthAPI from "../../classes/authAPI";
import { useNavigate } from "react-router-dom";

const TimezoneClock = ({ userTimezone }) => {
  const [selectedTimezone, setSelectedTimezone] = useState(userTimezone);
  const [currentTime, setCurrentTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await AuthAPI.getUser();
        setSelectedTimezone(response.timezone);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (selectedTimezone) {
      const updateTimeInSelectedTimezone = () => {
        let now = moment.utc();
        let localTime = now.tz(selectedTimezone);
        let timeString = localTime.format("HH:mm");
        setCurrentTime(timeString);
      };

      updateTimeInSelectedTimezone();
      const interval = setInterval(updateTimeInSelectedTimezone, 60000);

      return () => clearInterval(interval);
    }
  }, [selectedTimezone]);

  return (
    <div>
      <p>{currentTime}</p>
    </div>
  );
};

export default TimezoneClock;
