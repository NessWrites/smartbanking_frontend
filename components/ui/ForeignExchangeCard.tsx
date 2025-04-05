import { useState, useEffect } from 'react';
import Image from 'next/image';

const currencies:Currency[] = [
  { code: 'NPR', name: 'Nepali Rupees' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'QAR', name: 'Qatari Riyal' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'SEK', name: 'Swedish Krona' },
  { code: 'DKK', name: 'Danish Krone' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'KWD', name: 'Kuwaiti Dinar' },
  { code: 'BHD', name: 'Bahraini Dinar' },
  { code: 'OMR', name: 'Omani Rial' }
];
const ForeignExchangeCard = ({ selectedDate }: ForeignExchangeCardProps) => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[0]);
  const [toCurrency, setToCurrency] = useState<Currency>(currencies[1]);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  
  const fetchExchangeRate = async () => {
    if (fromCurrency.code === toCurrency.code) {
      setExchangeRate(1);
      setConvertedAmount(parseFloat(amount) || 0);
      setError(null);
      
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        "http://localhost:8000/api/convert-currency",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            date: selectedDate || new Date().toISOString().split('T')[0],
            from_currency: fromCurrency.code,
            to_currency: toCurrency.code
          })
        });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch exchange rate');
      }

      // Updated to handle nested converted_amount object
    const conversionData = data.converted_amount;
    setExchangeRate(conversionData.exchange_rate);
    setConvertedAmount(conversionData.converted_amount);
    
    console.log('Formatted Exchange Rate:', conversionData.exchange_rate);
    console.log('Formatted Converted Amount:', conversionData.converted_amount);
      
    } catch (err) {
      console.error('Error fetching exchange rate:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch exchange rates');
      setExchangeRate(null);
      setConvertedAmount(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleConvert = () => {
    fetchExchangeRate();
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency, selectedDate]);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Currency Converter</h2>
        <button className="text-blue-600 font-semibold">Quick Conversion</button>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Amount
        </label>
        <input
          id="amount"
          type="text"
          value={amount}
          onChange={handleAmountChange}
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter amount"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="from">
          From
        </label>
        <select
          id="from"
          value={fromCurrency.code}
          onChange={(e) => {
            const selected = currencies.find(c => c.code === e.target.value);
            if (selected) setFromCurrency(selected);
          }}
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {currencies.map((currency) => (
            <option key={`from-${currency.code}`} value={currency.code}>
              {`${currency.code} - ${currency.name}`}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center mb-6">
        <button 
          onClick={handleSwapCurrencies}
          disabled={isLoading}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Swap currencies"
        >
          <Image 
            src="/icons/swap.png" 
            width={124} 
            height={124} 
            alt="Swap currencies" 
          />
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="to">
          To
        </label>
        <select
          id="to"
          value={toCurrency.code}
          onChange={(e) => {
            const selected = currencies.find(c => c.code === e.target.value);
            if (selected) setToCurrency(selected);
          }}
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {currencies.map((currency) => (
            <option key={`to-${currency.code}`} value={currency.code}>
              {`${currency.code} - ${currency.name}`}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="mb-4 text-center text-blue-600">Loading rates...</div>
      )}

      {error && (
        <div className="mb-4 text-red-500 text-center">{error}</div>
      )}

{(exchangeRate !== null || convertedAmount !== null) && (
  <div className="mb-6 p-4 bg-gray-50 rounded">
    {exchangeRate !== null && !isNaN(exchangeRate) && (
      <p className="text-sm text-gray-600">
        Exchange Rate: 1 {fromCurrency.code} = {exchangeRate.toFixed(2)} {toCurrency.code}
      </p>
    )}
    
    {convertedAmount !== null && !isNaN(convertedAmount) && (
      <div className="mt-4">
        <p className="text-2xl font-bold text-blue-600">
          {convertedAmount.toFixed(2)} {toCurrency.code}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {amount} {fromCurrency.code} → {toCurrency.code}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Rates for {new Date(selectedDate || new Date()).toLocaleDateString()}
        </p>
      </div>
    )}
  </div>
)}

      <button 
        onClick={handleConvert}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Converting...' : 'Convert'}
      </button>

      {selectedDate && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Rates for {new Date(selectedDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default ForeignExchangeCard;