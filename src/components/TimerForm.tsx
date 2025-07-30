"use client";
import { FC, useState, useEffect, useRef } from "react";
import { trackTimerStart, trackTimerComplete, trackMethodSelection } from "@/lib/gtag";

const methods = [
  { key: "16:8", label: "16:8", desc: "16h fast, 8h eating", hours: 16 },
  { key: "18:6", label: "18:6", desc: "18h fast, 6h eating", hours: 18 },
  { key: "20:4", label: "20:4", desc: "20h fast, 4h eating", hours: 20 },
  { key: "OMAD", label: "OMAD", desc: "One meal a day", hours: 23 },
  { key: "24h", label: "24h", desc: "Full day fast", hours: 24 },
  { key: "36h", label: "36h", desc: "Extended fast", hours: 36 }
];

const TimerForm: FC = () => {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [method, setMethod] = useState<string>(methods[0].key);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [fastEndTime, setFastEndTime] = useState<Date | null>(null);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Live countdown effect
  useEffect(() => {
    if (isCountdownActive && fastEndTime) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const remaining = fastEndTime.getTime() - now.getTime();
        
        if (remaining <= 0) {
          // Fast is complete
          setTimeRemaining(0);
          setIsCountdownActive(false);
          setResult("🎉 Your fast has ended! You can break your fast now.");
          
          // Track timer completion event
          const selectedMethod = methods.find(m => m.key === method);
          if (selectedMethod) {
            trackTimerComplete(selectedMethod.key, selectedMethod.hours);
          }
          
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isCountdownActive, fastEndTime, method]);

  const formatTime = (milliseconds: number): string => {
    if (milliseconds <= 0) return "0h 0m 0s";
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleCalculate = () => {
    // Clear previous results and errors
    setResult("");
    setError("");
    setIsCountdownActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Validation: Check if both date and time are selected
    if (!date || !time) {
      setError("Please select both date and time.");
      return;
    }

    try {
      // Combine date and time into a single Date object
      const lastMealDateTime = new Date(`${date}T${time}`);
      
      // Validate the date object
      if (isNaN(lastMealDateTime.getTime())) {
        setError("Invalid date or time selected.");
        return;
      }

      // Get the selected fasting method
      const selectedMethod = methods.find(m => m.key === method);
      if (!selectedMethod) {
        setError("Please select a fasting method.");
        return;
      }

      // Calculate when the fast will end
      const endTime = new Date(lastMealDateTime.getTime() + (selectedMethod.hours * 60 * 60 * 1000));
      setFastEndTime(endTime);
      
      // Get current time for comparison
      const now = new Date();
      
      // Calculate remaining time
      const remaining = endTime.getTime() - now.getTime();
      
      if (remaining > 0) {
        // Fast is still ongoing - start live countdown
        setTimeRemaining(remaining);
        setIsCountdownActive(true);
        setResult(`Your ${selectedMethod.label} fast will end at ${endTime.toLocaleString()}`);
        
        // Track timer start event
        trackTimerStart(selectedMethod.key, selectedMethod.hours);
      } else {
        // Fast is already complete
        const timeComplete = Math.abs(remaining);
        const hoursComplete = Math.floor(timeComplete / (1000 * 60 * 60));
        const minutesComplete = Math.floor((timeComplete % (1000 * 60 * 60)) / (1000 * 60));
        
        setResult(`🎉 Your ${selectedMethod.label} fast completed ${hoursComplete}h ${minutesComplete}m ago! You can break your fast now.`);
        setTimeRemaining(0);
        setIsCountdownActive(false);
        
        // Track timer completion event
        trackTimerComplete(selectedMethod.key, selectedMethod.hours);
      }

    } catch (err) {
      setError("Error calculating fasting time. Please check your inputs.");
      console.error("Fasting calculation error:", err);
    }
  };

  const handleReset = () => {
    setResult("");
    setError("");
    setTimeRemaining(0);
    setFastEndTime(null);
    setIsCountdownActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Check if form is valid for enabling the calculate button
  const isFormValid = date.trim() !== "" && time.trim() !== "";

  return (
    <section className="py-8 px-4 bg-blue-900 text-white">
      <h2 className="text-2xl font-semibold text-center mb-4">When did you last eat?</h2>
      
      {/* Date and Time Inputs */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="meal-date" className="text-sm mb-1 text-blue-200">Select date</label>
          <input 
            id="meal-date"
            type="date" 
            className="p-3 bg-blue-800 rounded-md text-white border border-blue-700 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20" 
            value={date} 
            onChange={e => setDate(e.target.value)}
            placeholder="Select date"
            max={new Date().toISOString().split('T')[0]} // Don't allow future dates
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="meal-time" className="text-sm mb-1 text-blue-200">Select time</label>
          <input 
            id="meal-time"
            type="time" 
            className="p-3 bg-blue-800 rounded-md text-white border border-blue-700 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20" 
            value={time} 
            onChange={e => setTime(e.target.value)}
            placeholder="Select time"
          />
        </div>
      </div>

      {/* Method Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
        {methods.map(m => (
          <button 
            key={m.key} 
            onClick={() => {
              setMethod(m.key);
              trackMethodSelection(m.key);
            }} 
            className={`${
              method === m.key 
                ? "bg-yellow-400 text-black" 
                : "bg-blue-800 text-white hover:bg-blue-700"
            } p-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/50`}
            type="button"
          >
            <div className="font-semibold text-lg">{m.label}</div>
            <div className="text-sm opacity-90">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center mb-4">
          <p className="text-red-300 bg-red-900/20 border border-red-700 rounded-lg p-3 inline-block">
            {error}
          </p>
        </div>
      )}

      {/* Calculate Button */}
      <div className="text-center mb-6">
        <div className="flex justify-center gap-4">
          <button 
            onClick={handleCalculate}
            disabled={!isFormValid}
            className={`px-8 py-3 rounded-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
              isFormValid 
                ? "bg-yellow-400 text-black hover:bg-yellow-300 cursor-pointer" 
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            type="button"
          >
            Calculate Fasting Time
          </button>
          {(result || isCountdownActive) && (
            <button 
              onClick={handleReset}
              className="px-6 py-3 rounded-lg font-bold bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
              type="button"
            >
              Reset
            </button>
          )}
        </div>
        {!isFormValid && (
          <p className="text-sm text-blue-200 mt-2">Please select both date and time</p>
        )}
      </div>

      {/* Live Countdown Display */}
      {isCountdownActive && timeRemaining > 0 && (
        <div className="text-center mb-6">
          <div className="bg-yellow-400/10 border border-yellow-400 rounded-lg p-6 inline-block">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Time Remaining</h3>
            <div className="text-3xl font-bold text-yellow-300 mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-yellow-200 opacity-75">
              Live countdown updating every second
            </div>
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="text-center">
          <div className={`${
            timeRemaining <= 0 && result.includes("🎉") 
              ? "bg-green-900/20 border border-green-700" 
              : "bg-blue-900/20 border border-blue-700"
          } rounded-lg p-4 inline-block max-w-2xl`}>
            <p className={`${
              timeRemaining <= 0 && result.includes("🎉")
                ? "text-green-300" 
                : "text-blue-200"
            } font-medium`}>
              {result}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default TimerForm;
