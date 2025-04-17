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
import { cn } from "@/lib/utils";

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
      <TableCaption className="text-lg">A list of your recent Banking Transactions.</TableCaption>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow className="py-16">
          <TableHead className="px-2 text-16 font-semibold text-[#344054]">Date</TableHead>
          <TableHead className="px-2 text-16 font-semibold text-[#344054]">Reference</TableHead>
          <TableHead className="px-2 text-16 font-semibold text-[#344054]">Description</TableHead>
          <TableHead className="px-2 text-16 font-semibold text-[#344054]">Debit</TableHead>
          <TableHead className="px-2 text-16 font-semibold text-[#344054]">Credit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          const typeId = parseInt(transaction.transactionTypeID, 10);
          const amount = parseFloat(transaction.amount);
          const isDebit = typeId === 1;
          const isCredit = typeId === 2;

          return (
            <TableRow
              key={transaction.transactionID}
              className={cn(
                `${isDebit ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !border-b-DEFAULT py-6`
              )}
            >
              <TableCell className="max-w-[150px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-16 truncate font-semibold text-[#344054]">
                    {transaction.date}
                  </h1>
                </div>
              </TableCell>
              <TableCell className="pl-2 pr-10 text-16">{transaction.reference}</TableCell>
              <TableCell className="pl-2 pr-10 text-16">{transaction.description}</TableCell>
              <TableCell
                className={cn(
                  'pl-2 pr-10 font-semibold text-16',
                  isDebit ? 'text-[#f04438]' : 'text-[#039855]'
                )}
              >
                {isDebit ? `$${amount.toFixed(2)}` : '-'}
              </TableCell>
              <TableCell
                className={cn(
                  'pl-2 pr-10 font-semibold text-16',
                  isCredit ? 'text-[#039855]' : 'text-[#f04438]'
                )}
              >
                {isCredit ? `$${amount.toFixed(2)}` : '-'}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default TransactionsTable;