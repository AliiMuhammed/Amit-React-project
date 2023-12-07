import React, { useEffect, useState } from "react";
import MainHeader from "../../../../Shared/components/MainHeader";
import axios from "axios";
import ArabicClock from "./components/ArabicClock ";
import { FaCalendarDay } from "react-icons/fa6";
import ArabicDate from "./components/ArabicDate";
import ArabicHijriDate from "./components/ArabicHijriDate";
import "../../Style/prayers.css";

import { connect, useSelector } from "react-redux";
import { fetchLocation } from "../../../../Redux/Actions/Location";
import Loader from "../../../../Shared/components/Loader";
const Prayers = ({ fetchLocation }) => {
  const [todayDate, setTodayDate] = useState({
    gregorian: {},
    hijri: {},
    err: null,
  });
  const [prayersTime, setParyersTime] = useState({});
  let location = useSelector((state) => state.location);

  useEffect(() => {
    axios
      .get("https://api.aladhan.com/v1/timingsByCity/formattedDate", {
        params: {
          city: location.location !== null ? `"${location.city}"` : "Cairo",
          country:
            location.location !== null ? `"${location.country}"` : "Egypt",
          method: 5,
        },
      })
      .then((res) => {
        setTodayDate({
          ...todayDate,
          gregorian: res.data.data.date.gregorian,
          hijri: res.data.data.date.hijri,
        });
        setParyersTime(res.data.data.timings);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetchLocation(); 
  }, [fetchLocation]);
  const date = new Date();
  const options = { weekday: "long", localeMatcher: "best fit" };
  const dayNameInArabic = date.toLocaleDateString("ar", options);

  let times = [];

  if (prayersTime.hasOwnProperty("Fajr")) {
    function convertToArabicNumbers(input) {
      const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

      return input.replace(/[0-9]/g, (match) => arabicNumbers[parseInt(match)]);
    }

    function convertTo12HourFormat(time) {
      const [hours, minutes] = time.split(":");
      let period = "ص";

      let hours12 = parseInt(hours, 10);

      if (hours12 >= 12) {
        period = "م";
        if (hours12 > 12) {
          hours12 -= 12;
        }
      }

      const arabicTime = `${convertToArabicNumbers(
        hours12.toString()
      )}:${convertToArabicNumbers(minutes)} ${period}`;
      return arabicTime;
    }

    const keysToExtract = [
      "Fajr",
      "Sunrise",
      "Dhuhr",
      "Asr",
      "Maghrib",
      "Isha",
    ];
    times = keysToExtract.map((key) => convertTo12HourFormat(prayersTime[key]));
  }

  let prayers = ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"];

  return (
    <section className="prayers-section" name="prayers-time">
      <div className="container">
        <MainHeader
          smHeader={"مَواقِيت الصَّلَاة"}
          Header={"مَواقِيت الصَّلَاة لِلْمسْلمين"}
        />
        <div className="bg-div">
          <div className="prayers-time">
            <div className="date">
              <div className="day">
                <FaCalendarDay />
                {dayNameInArabic}
              </div>
              <div className="full-date">
                <ArabicDate />
                <ArabicHijriDate />
              </div>
            </div>
          </div>
          <div className="city">
            <h1>مواقيت الصلاة في مصر</h1>
            <div className="time">
              <span>الساعة الآن</span>
              <ArabicClock />
            </div>
          </div>
          <div className="prayers-cards">
            {location.location === null && <Loader />}
            {!location.isLoading &&
              location.location !== null &&
              times.map((time, index) => {
                return (
                  <div key={time} className="prayer-card">
                    <h1>{prayers[index]}</h1>
                    <span>{time}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

const mapDispatchToProps = {
  fetchLocation, // Use fetchLocation action
};

export default connect(null, mapDispatchToProps)(Prayers);
