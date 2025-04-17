"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import RightSidebar from '@/components/ui/RightSidebar'
import React from 'react'
import Image from "next/image"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BranchDropdown from '@/components/ui/BranchDropdown'

const branchLocations = [
  "Kathmandu", "Pokhara", "Lalitpur", "Biratnagar", "Bharatpur", "Birgunj", "Janakpur", 
  "Butwal", "Hetauda", "Tulsipur", "Dharan", "Nepalgunj", "Kalaiya", "Itahari", 
  "Ghorahi", "Dhangadi", "Jitpursimara", "Bhaktapur", "Bhimdoot", "Budhanilkantha"
];

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const router = useRouter();

  const handleDigitClick = (digit: string) => {
    setAmount((prev) => {
      const newAmount = prev + digit;
      if (/^\d*\.?\d*$/.test(newAmount) && (!newAmount || Number(newAmount) <= 100000)) {
        return newAmount;
      }
      return prev;
    });
  };

  const handleDelete = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const playSuccessSound = () => {
    const audio = new Audio('/success.mp3');
    audio.play()
      .then(() => console.log("Success sound played"))
      .catch((error) => console.error("Error playing sound:", error));
  };

  const handleWithdraw = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setErrorMessage("To withdraw you are not authenticated. Please log in.");
      return;
    }
    if (!amount || Number(amount) === 0) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }
    if (Number(amount) > 100000) {
      setErrorMessage('Amount exceeds maximum withdrawal limit of NPR 100,000.');
      return;
    }
    if (!selectedBranch) {
      setErrorMessage('Please select a branch location.');
      return;
    }

    const withdrawalData = {
      amount: Number(amount),
      withdrawal_type: "atm",
      location: selectedBranch,
      used_chip: 0,
    };

    try {
      const response = await fetch('http://localhost:8000/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(withdrawalData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requires_otp) {
          setOtpRequired(true);
        } else {
          playSuccessSound();
          setTransactionSuccess(true);
        }
      } else {
        setErrorMessage(data.error || "An error occurred during withdrawal.");
      }
    } catch (error) {
      setErrorMessage("Failed to connect to the server.");
    }
  };

  const handleOtpSubmit = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setErrorMessage("You are not authenticated. Please log in.");
      return;
    }

    const otpData = {
      amount: Number(amount),
      withdrawal_type: "atm",
      location: selectedBranch,
      used_chip: 0,
      otp_code: otpCode,
    };

    try {
      const response = await fetch("http://localhost:8000/api/withdraw", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(otpData),
      });

      const data = await response.json();

      if (response.ok) {
        playSuccessSound();
        setTransactionSuccess(true);
        setOtpRequired(false);
      } else {
        setErrorMessage(data.error || "Invalid OTP. Transaction canceled.");
      }
    } catch (error) {
      setErrorMessage("Failed to connect to the server.");
    }
  };

  const handleCloseSuccessPopup = () => {
    setTransactionSuccess(false);
    router.push('/');
  };

  const handleEnter = () => {
    setErrorMessage(''); // Clear any previous error messages
    handleWithdraw();
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
  };

  return (
    <div className="withdraw">
      <div className="div">
        <div className="overlap relative">
          <div className="smart-banking-dropdown">
            <label htmlFor="branch-select" className="span">
              Branch Location:
            </label>
            <select
              id="branch-select"
              value={selectedBranch}
              onChange={(e) => handleBranchChange(e.target.value)}
              className="px-2 py-1 bg-blue-600 text-white rounded cursor-pointer text-base"
            >
              <option value="">Select a branch</option>
              {branchLocations.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <div className="smart-banking-branch">
            <span>
              Smart Banking
              <br />
            </span>
          </div>
          <section className="text-wrapper-2">
            ATM Simulation
          </section>
          <div className="number-pad-container absolute top-20 right-2 z-10">
            <table className="number-pad border-collapse">
              <tbody>
                <tr>
                  <td className="p-1"><button className="pad-button" onClick={() => handleDigitClick('1')}>1</button></td>
                  <td className="p-1"><button className="pad-button" onClick={() => handleDigitClick('2')}>2</button></td>
                  <td className="p-1"><button className="pad-button" onClick={() => handleDigitClick('3')}>3</button></td>
                </tr>
                <tr>
                  <td className="p-1"><button className="pad-button" onClick={() => handleDigitClick('4')}>4</button></td>
                  <td className="p-1"><button className="pad-button" onClick={() => handleDigitClick('5')}>5</button></td>
                  <td className="p-1"><button className="pad-button" onClick={() => handleDigitClick('6')}>6</button></td>
                </tr>
                <tr>
                  <td className="p-1"><button className="pad-button" onClick={() => handleDigitClick('7')}>7</button></td>
                  <td className="p-1"><button className="pad-button" onClick={() => handleDigitClick('8')}>8</button></td>
                  <td className="p-1"><button className="pad-button" onClick={() => handleDigitClick('9')}>9</button></td>
                </tr>
                <tr>
                  <td className="p-1"><button className="pad-button" onClick={() => handleDigitClick('0')}>0</button></td>
                  <td className="p-1"><button className="pad-button bg-red-500 hover:bg-red-700 hover:scale-105 text-white" onClick={handleDelete}>Del</button></td>
                  <td className="p-1"><button className="pad-button bg-green-500 hover:bg-green-700 hover:scale-105 text-white" onClick={handleEnter}>Enter</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="please-enter-the">
            Please enter the amount you want
            <br /> to withdraw
          </p>
          
          <div className="overlap-group-2">
            <div className="NPR">
              NPR <span className="amount-display">{amount || '0.00'}</span>
            </div>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <p className="please-do-not-share">
            <span className="text-wrapper-3">
              Please do not share your banking credentials to
              <br />
              untrusted parties.
              <br />
              <br />
            </span>
            <span className="text-wrapper-4">Help us make banking secure!</span>
          </p>
          <p>Maximum Withdraw limit: 100,000</p>
        </div>
      </div>

      {otpRequired && (
        <div className="otp-popup">
          <div className="otp-popup-content">
            <h3>OTP Verification</h3>
            <p>An OTP has been sent to your registered phone number.</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
            />
            <button onClick={handleOtpSubmit}>Submit OTP</button>
            <button onClick={() => setOtpRequired(false)}>Cancel</button>
          </div>
        </div>
      )}

      {transactionSuccess && (
        <div className="success-popup">
          <div className="success-popup-content">
            <h3>Transaction Successful!</h3>
            <p>Your withdrawal of NPR {amount} was successful.</p>
            <button onClick={handleCloseSuccessPopup}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 640px) {
          .number-pad-container {
            position: static !important;
            margin-top: 1rem;
            display: flex;
            justify-content: center;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .number-pad-container {
            right: 0.5rem;
          }
        }
        .otp-popup, .success-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .otp-popup-content, .success-popup-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .otp-popup-content input {
          margin: 10px 0;
          padding: 8px;
          width: 100%;
          max-width: 200px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .otp-popup-content button, .success-popup-content button {
          margin: 5px;
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .otp-popup-content button:hover, .success-popup-content button:hover {
          background-color: #0056b3;
        }
        .error-message {
          color: red;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Withdraw;