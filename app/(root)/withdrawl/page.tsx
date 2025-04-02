"use client";
import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';

const branchLocations = [
  "Kathmandu", "Pokhara", "Lalitpur", "Biratnagar", "Bharatpur", "Birgunj", "Janakpur", "Butwal", "Hetauda", "Tulsipur", "Dharan", "Nepalgunj", "Kalaiya", "Itahari", "Ghorahi", "Dhangadi", "Jitpursimara", "Bhaktapur", "Bhimdoot", "Budhanilkantha"
];

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('Kathmandu');
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and optional decimal points
    if (/^\d*\.?\d*$/.test(value) && Number(value) <= 100000) {
      setAmount(value);
    }
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
  };

  const playSuccessSound = () => {
    const audio = new Audio('/success.mp3'); // Ensure the file exists in the public folder
    audio.play()
      .then(() => console.log("Success sound played"))
      .catch((error) => console.error("Error playing sound:", error));
  };

  const handleWithdraw = async () => {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    console.log('withdraw: ', token)
    if (!token) {
      setErrorMessage("To withdraw you are not authenticated. Please log in.");
      return;
    }
     // Ensure selectedBranch is not empty
     if (!selectedBranch) {
      setErrorMessage("Please select a branch location.");
      return;
    }

    const withdrawalData = {
      amount: amount,
      withdrawal_type: "atm",
      location: selectedBranch,
      used_chip: 0, // Changed to boolean
    };

    try {
      const response = await fetch('http://localhost:8000/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify(withdrawalData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requires_otp) {
          setOtpRequired(true); // Show OTP input popup
        } else {
          playSuccessSound(); // Play success sound
          setTransactionSuccess(true); // Show success popup
        }
      } else {
        setErrorMessage(data.error || "An error occurred during withdrawal.");
      }
    } catch (error) {
      setErrorMessage("Failed to connect to the server.");
    }
  };

  const handleOtpSubmit = async () => {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    console.log('withdraw:',token)
    if (!token) {
      setErrorMessage("You are not authenticated. Please log in.");
      return;
    }

    const otpData = {
      amount: amount,
      withdrawal_type: "atm",
      location: selectedBranch,
      used_chip: 0, // Changed to boolean
      otp_code: otpCode,
    };

    try {
      const response = await fetch("http://localhost:8000/api/withdraw", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':  `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify(otpData),
      });

      const data = await response.json();

      if (response.ok) {
        playSuccessSound(); // Play success sound
        setTransactionSuccess(true); // Show success popup
      } else {
        setErrorMessage(data.error || "Invalid OTP. Transaction canceled.");
      }
    } catch (error) {
      setErrorMessage("Failed to connect to the server.");
    }
  };

  const handleCloseSuccessPopup = () => {
    setTransactionSuccess(false);
    router.push('/'); // Redirect to dashboard or another page
  };

  return (
    <div className="withdraw">
      <div className="div">
        <div className="overlap">
          <div className="smart-banking-dropdown">
            <label htmlFor="branch-select" className="span">
              Branch Location:
            </label>
            <select
              id="branch-select"
              value={selectedBranch}
              onChange={(e) => handleBranchChange(e.target.value)}
              style={{
                position: 'absolute',
                left: '300px',
                display: 'flex',
                padding: '8px',
                backgroundColor: '#007bff',
                color: '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '26px',
              }}
            >
              {branchLocations.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <div className="smart-banking-branch">
            <span>Smart Banking</span>
          </div>
          <div>
            <div className="text-wrapper-2">ATM Simulation</div>
            <p className="please-enter-the">
              Please enter the amount you want to withdraw
            </p>
            <Image className="image" alt="Image" src="/icons/keypad.svg" width={100} height={100} />
          </div>
          <div className="overlap-group-2">
            <label className="NPR">
              NPR &nbsp;
              <input
                type="text"
                className="amount-input"
                value={amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </label>
          </div>
          <div>
            <button className="enter-button" onClick={handleWithdraw}>Withdraw</button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p className="please-do-not-share">
            Please do not share your banking credentials with untrusted parties.
            <br />
            Help us make banking secure!
          </p>
          <p>Maximum Withdraw limit: 100000</p>
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
    </div>
  );
};

export default Withdraw;