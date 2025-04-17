import { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import ForeignExchangeCard from './ForeignExchangeCard';

interface RightSidebarProps {
  user: any;
}

const RightSidebar = ({ user }: RightSidebarProps) => {
  const displayName = typeof user === "object" ? user.firstName : user;
  const lastName = typeof user === "object" ? user.lastName : user;

  // Set initial date to today or earlier
  const getInitialDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD (e.g., "2025-04-13")
  };

  const [selectedDate, setSelectedDate] = useState<string>(getInitialDate);

  // Function to get maximum allowed date (today)
  const getMaxDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Ensure selected date is not in the future
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = new Date(e.target.value);
    const today = new Date();
    if (selected > today) {
      setSelectedDate(getMaxDate());
    } else {
      setSelectedDate(e.target.value);
    }
  };

  return (
    <aside className='right-sidebar'>
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">{displayName[0]}</span>
          </div>

          <div className="profile-details">
            <h1 className='profile-name'>
              {displayName}
            </h1>
            <p className="profile-email">
              {lastName}
            </p>
          </div>
        </div>
      </section>
      
      <section>
        <div className="flex w-full top items-center">
          <div className="flex items-center gap-2">
            <Image 
              src="/icons/calendar.png"
              width={80}
              height={15}
              alt="calendar"
            />
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              max={getMaxDate()}
              className="text-1 font-semibold text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center gap-5 mt-4">
          <ForeignExchangeCard selectedDate={selectedDate} />
        </div>
      </section>
    </aside>
  );
};

export default RightSidebar;