"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  transactionID: string;
  date: string;
  reference: string;
  description: string;
  transactionTypeID: string; // "1" or "2" as strings
  amount: string;
}

function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  if (!transactions || transactions.length === 0) {
    return <div>No transactions available</div>;
  }

  return (
    <Table>
      <TableCaption>A list of your recent Banking Transactions.</TableCaption>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Date</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead className="px-2">Description</TableHead>
          <TableHead className="px-2">Debit</TableHead>
          <TableHead className="px-2">Credit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          // Convert string values to numbers
          const typeId = parseInt(transaction.transactionTypeID, 10);
          const amount = parseFloat(transaction.amount);
          
          return (
            <TableRow key={transaction.transactionID}>
              <TableCell className="px-2">{transaction.date}</TableCell>
              <TableCell>{transaction.reference}</TableCell>
              <TableCell className="px-2">{transaction.description}</TableCell>
              <TableCell className="px-2">
                {typeId === 1 
                  ? `$${amount.toFixed(2)}` 
                  : '-'}
              </TableCell>
              <TableCell className="px-2">
                {typeId === 2 
                  ? `$${amount.toFixed(2)}` 
                  : '-'}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default TransactionsTable;