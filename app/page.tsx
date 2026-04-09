"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from "date-fns";

export default function Home() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Load note for selected date
  useEffect(() => {
    if (selectedDate) {
      const saved = localStorage.getItem(format(selectedDate, "yyyy-MM-dd"));
      setNote(saved || "");
    }
  }, [selectedDate]);

  const saveNote = () => {
    if (!selectedDate) return alert("Select a date first");
    localStorage.setItem(format(selectedDate, "yyyy-MM-dd"), note);
    alert("Saved!");
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);

    if (!startDate) {
      setStartDate(date);
      return;
    }

    if (!endDate) {
      setEndDate(date);
      return;
    }

    setStartDate(date);
    setEndDate(null);
  };

  const realStart =
    startDate && endDate && startDate > endDate ? endDate : startDate;

  const realEnd =
    startDate && endDate && startDate > endDate ? startDate : endDate;

  const isInRange = (date: Date) =>
    realStart && realEnd && date >= realStart && date <= realEnd;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden">

        {/* HERO */}
        <div className="relative h-56">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end p-4">
            <h1 className="text-white text-2xl font-bold">
              {format(currentDate, "MMMM yyyy")}
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">

          {/* CALENDAR */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1,
                      1
                    )
                  )
                }
                className="px-3 py-1 bg-gray-200 rounded"
              >
                ←
              </button>

              <h2 className="font-bold text-lg">
                {format(currentDate, "MMMM yyyy")}
              </h2>

              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                      1
                    )
                  )
                }
                className="px-3 py-1 bg-gray-200 rounded"
              >
                →
              </button>
            </div>

            {/* DAYS */}
            <div className="grid grid-cols-7 text-center font-semibold text-gray-600">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* DATES */}
            <div className="grid grid-cols-7 mt-3">
              {days.map((day) => {
                const isStart = realStart && isSameDay(day, realStart);
                const isEnd = realEnd && isSameDay(day, realEnd);
                const inRange = isInRange(day);
                const isSelected =
                  selectedDate && isSameDay(day, selectedDate);

                return (
                  <div
                    key={day.toString()}
                    onClick={() => handleDateClick(day)}
                    className={`
                      m-1 py-3 text-center cursor-pointer rounded-xl
                      transition-all duration-200

                      ${isStart || isEnd ? "bg-blue-600 text-white" : ""}
                      ${inRange && !isStart && !isEnd ? "bg-blue-200" : ""}
                      ${isSelected ? "ring-2 ring-blue-400" : ""}
                      ${isToday(day) ? "border-2 border-red-400" : ""}
                      ${!inRange && !isStart && !isEnd ? "bg-white shadow-sm" : ""}

                      hover:scale-105
                    `}
                  >
                    {format(day, "d")}
                  </div>
                );
              })}
            </div>
          </div>

          {/* NOTES */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="font-semibold mb-2">
              Notes {selectedDate && `(${format(selectedDate, "dd MMM")})`}
            </h2>

            <textarea
              className="w-full border rounded-lg p-2 h-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Select a date and write..."
            />

            <button
              onClick={saveNote}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}