import React from "react";
import DataTable from "../components/DataTable";

const Subscribers = () => {
  // Mock data for subscribers since it's a new feature
  const mockSubscribers = [
    { _id: "1", email: "ALEX.ARCHIVE@PROTOCOL.COM", createdAt: new Date(), status: "ACTIVE" },
    { _id: "2", email: "SYSTEM.NODE@NETWORK.IO", createdAt: new Date(), status: "ACTIVE" },
    { _id: "3", email: "RECRUITER.ACCESS@CORP.NET", createdAt: new Date(), status: "PENDING" },
    { _id: "4", email: "GHOST.USER@VOID.SH", createdAt: new Date(), status: "ACTIVE" },
    { _id: "5", email: "SIGNAL.ALPHA@TERMINAL.XYZ", createdAt: new Date(), status: "INACTIVE" },
  ];

  return (
    <DataTable
      pageTitle="Network Subscribers"
      dalaListName="Communication Nodes"
      searchInputPlaceholder="Search by identifier..."
      tableHeaderTitleList={["Node / Email", "Registration Date", "Protocol Status", "Operations"]}
      data={mockSubscribers}
      isLoading={false}
      isFetching={false}
    >
      {mockSubscribers.map((sub) => (
        <tr key={sub._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <span className="font-ibm text-xs uppercase tracking-widest font-bold">{sub.email}</span>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <span className="font-ibm text-xs opacity-60">
              {new Date(sub.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <span className={`font-geist text-[9px] tracking-widest uppercase ${sub.status === 'ACTIVE' ? 'text-green-500' : 'text-orange-500 opacity-50'}`}>
              [{sub.status}]
            </span>
          </td>
          <td className="px-8 py-6 border-b-[0.5px] border-black/10 dark:border-white/10">
            <button className="font-geist text-[10px] tracking-widest uppercase text-red-500 opacity-30 hover:opacity-100 transition-opacity">
              [Expunge]
            </button>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};

export default Subscribers;
