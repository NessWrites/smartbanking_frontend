import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import TransactionsTable from './TransactionsTable'
import { useRouter } from 'next/navigation';

interface Transaction {
	transactionID: string;
	date: string;
	reference: string;
	description: string;
	transactionTypeID: string;
	amount: string;
	
	// Add other fields as needed
  }

const RecentTransactions = (
	{
		transaction
	
	}
) => {
	const [transactions, setTransactions] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchTransactions = async () => {
		  try {
			const token = localStorage.getItem("authToken");
			
			if (!token) {
			  router.push("/login");
			  return;
			}
	
			const response = await fetch("http://localhost:8000/api/account-statement", {
			  method: "GET",
			  headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			  },
			});
	
			if (!response.ok) {
			  throw new Error(`HTTP error! status: ${response.status}`);
			}
	
			const transactionsData = await response.json();
			setTransactions(transactionsData);
			console.log("I am from recent transactions",transactionsData)
		  } catch (err) {
			setError(err.message || "Failed to fetch transactions");
			console.error("Error fetching transactions:", err);
		  } finally {
			setLoading(false);
		  }
		};
	
		fetchTransactions();
	  }, []); // Empty dependency array means this runs once on mount
	  console.log(transactions)
	  if (loading) return <div>Loading transactions...</div>;
	  if (error) return <div>Error: {error}</div>;
  return (
	<section className='recent-transactions'>
		<header className='flex items-center justify-between'>
			<h2 className='recent-transactions-label'>
				Recent transactions
			</h2>
			<Link href = {`/transaction-history/`} className="view-all-btn">
				View all
			</Link>
		</header>
		<TransactionsTable
		
		transactions={transactions}/>
	</section>
  )
}

export default RecentTransactions 