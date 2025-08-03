import { useState, useMemo } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/shared/PageHeader";
import LoadingDots from "../../components/shared/LoadingDots";
import {
  useBillsForCurrentCongress,
  useBillActions,
} from "../../hooks/useBills";
import type { Bill } from "../../types/bill";

export default function BillsPage() {
  const {
    data: billsResponse,
    isLoading,
    error,
  } = useBillsForCurrentCongress();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterChamber, setFilterChamber] = useState<string>("all");

  // Get actions for selected bill
  const {
    data: actionsResponse,
    isLoading: actionsLoading,
    error: actionsError,
  } = useBillActions(
    selectedBill?.congress || 0,
    selectedBill?.type || "",
    selectedBill?.number || ""
  );

  // Filter and search bills
  const filteredBills = useMemo(() => {
    if (!billsResponse?.bills) return [];

    return billsResponse.bills.filter((bill) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.type.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType = filterType === "all" || bill.type === filterType;

      // Chamber filter
      const matchesChamber =
        filterChamber === "all" ||
        bill.originChamber.toLowerCase() === filterChamber.toLowerCase();

      return matchesSearch && matchesType && matchesChamber;
    });
  }, [billsResponse?.bills, searchTerm, filterType, filterChamber]);

  // Get unique bill types and chambers for filters
  const billTypes = useMemo(() => {
    if (!billsResponse?.bills) return [];
    return Array.from(
      new Set(billsResponse.bills.map((bill) => bill.type))
    ).sort();
  }, [billsResponse?.bills]);

  const chambers = useMemo(() => {
    if (!billsResponse?.bills) return [];
    return Array.from(
      new Set(billsResponse.bills.map((bill) => bill.originChamber))
    ).sort();
  }, [billsResponse?.bills]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBillTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "hr":
        return "text-patriot-neon-blue";
      case "s":
        return "text-patriot-neon-red";
      case "hjres":
      case "sjres":
        return "text-patriot-neon-purple";
      default:
        return "text-gray-300";
    }
  };

  const getChamberColor = (chamber: string) => {
    return chamber.toLowerCase() === "house"
      ? "text-patriot-neon-blue"
      : "text-patriot-neon-red";
  };

  const header_info = () => {
    if (error)
      return (
        <div className="min-h-screen cyber-grid">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center space-y-8">
              <div className="glass-dark border border-patriot-neon-red/30 rounded-xl p-8">
                <p className="text-patriot-neon-red text-lg">
                  Unable to load bills data. Please try again later.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    if (isLoading)
      return (
        <div className="rounded-lg p-4 inline-block">
          <span className="text-gray-300">
            <div className="text-center space-y-8">
              <LoadingDots variant="purple" size="large" speed="normal" />
              <p className="text-gray-400">Loading current congress bills...</p>
            </div>
          </span>
        </div>
      );

    return (
      billsResponse && (
        <div className="glass-patriot rounded-lg p-4 inline-block ">
          <span className="text-gray-300">
            {billsResponse.pagination.count} bills in the current congress
          </span>
        </div>
      )
    );
  };


  return (
    <MainLayout>
      <div className="min-h-screen  cyber-grid">
        <div className="container mx-auto px-6 py-8 ">
          <PageHeader
            title="BILLS"
            description="Explore current congressional bills and their legislative journey"
            descriptionMaxWidth="max-w-3xl"
            additionalContent={header_info()}
          />

          {/* Search and Filters */}
          <div className="glass-dark rounded-xl p-6 mt-4 mb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search bills by title, number, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-patriot-darker border border-patriot-neon-blue/30 rounded-lg text-white placeholder-gray-400 focus:border-patriot-neon-blue focus:outline-none focus:ring-2 focus:ring-patriot-neon-blue/20"
                />
              </div>

              {/* Bill Type Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 bg-patriot-darker border border-patriot-neon-blue/30 rounded-lg text-white focus:border-patriot-neon-blue focus:outline-none focus:ring-2 focus:ring-patriot-neon-blue/20"
                >
                  <option value="all">All Types</option>
                  {billTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chamber Filter */}
              <div>
                <select
                  value={filterChamber}
                  onChange={(e) => setFilterChamber(e.target.value)}
                  className="w-full px-4 py-2 bg-patriot-darker border border-patriot-neon-blue/30 rounded-lg text-white focus:border-patriot-neon-blue focus:outline-none focus:ring-2 focus:ring-patriot-neon-blue/20"
                >
                  <option value="all">All Chambers</option>
                  {chambers.map((chamber) => (
                    <option key={chamber} value={chamber}>
                      {chamber}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-400">
              Showing {filteredBills.length} of{" "}
              {billsResponse?.bills.length || 0} bills
            </div>
          </div>

          {/* Split View Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
            {/* Bills List */}
            <div className="glass-dark rounded-xl space-y-4 min-w-0  p-5">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center  space-x-2">
                <span>📋</span>
                <span>Bills List</span>
              </h2>

              <div className="space-y-3 p-3 max-h-screen overflow-y-auto">
                {isLoading ? (
                  <div className="glass-dark rounded-lg p-8 text-center">
                    <LoadingDots variant="purple" size="large" speed="normal" />
                    <p className="text-gray-400 mt-4">Loading current congress bills...</p>
                  </div>
                ) : (
                  <>
                    {filteredBills.map((bill) => (
                      <div
                        key={`${bill.congress}-${bill.type}-${bill.number}`}
                        onClick={() => setSelectedBill(bill)}
                        className={`glass-patriot rounded-lg p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-patriot-neon-blue/50 ${
                          selectedBill &&
                          selectedBill.congress === bill.congress &&
                          selectedBill.type === bill.type &&
                          selectedBill.number === bill.number
                            ? "border-patriot-neon-blue shadow-lg shadow-patriot-neon-blue/25"
                            : "border-transparent"
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Bill Number and Type */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`font-bold text-lg ${getBillTypeColor(
                                  bill.type
                                )}`}
                              >
                                {bill.type.toUpperCase()} {bill.number}
                              </span>
                              <span
                                className={`text-sm px-2 py-1 rounded ${getChamberColor(
                                  bill.originChamber
                                )} bg-current/10`}
                              >
                                {bill.originChamber}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {bill.introducedDate &&
                                formatDate(bill.introducedDate)}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-white font-medium line-clamp-2 leading-snug">
                            {bill.title}
                          </h3>

                          {/* Latest Action */}
                          {bill.latestAction && (
                            <div className="space-y-1">
                              <div className="text-xs text-gray-400">
                                Latest Action: {formatDate(bill.latestAction.date)}
                              </div>
                              <p className="text-sm text-gray-300 line-clamp-2">
                                {bill.latestAction.text}
                              </p>
                            </div>
                          )}

                          {/* Policy Area */}
                          {bill.policyArea && (
                            <div className="text-xs text-patriot-neon-purple">
                              {bill.policyArea.name}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredBills.length === 0 && !isLoading && (
                      <div className="glass-dark rounded-lg p-8 text-center">
                        <p className="text-gray-400">
                          No bills match your search criteria
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Bill Actions */}
            <div className="glass-dark rounded-xl space-y-4 min-w-0 p-5">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <span>⚡</span>
                <span>Bill Actions</span>
              </h2>

              {!selectedBill ? (
                <div className="glass-dark rounded-lg p-8 text-center">
                  <p className="text-gray-400">
                    Select a bill to view its actions
                  </p>
                </div>
              ) : (
                <div className="glass-dark rounded-lg p-6">
                  {/* Selected Bill Header */}
                  <div className="border-b border-patriot-neon-blue/20 pb-4 mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`font-bold text-lg ${getBillTypeColor(
                          selectedBill.type
                        )}`}
                      >
                        {selectedBill.type.toUpperCase()} {selectedBill.number}
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded ${getChamberColor(
                          selectedBill.originChamber
                        )} bg-current/10`}
                      >
                        {selectedBill.originChamber}
                      </span>
                    </div>
                    <h3 className="text-white font-medium leading-snug">
                      {selectedBill.title}
                    </h3>
                  </div>

                  {/* Actions List */}
                  {actionsLoading ? (
                    <div className="text-center py-8">
                      <LoadingDots
                        variant="blue"
                        size="medium"
                        speed="normal"
                      />
                      <p className="text-gray-400 mt-4">
                        Loading bill actions...
                      </p>
                    </div>
                  ) : actionsError ? (
                    <div className="text-center py-8">
                      <p className="text-patriot-neon-red">
                        Unable to load actions for this bill
                      </p>
                    </div>
                  ) : actionsResponse?.actions ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {actionsResponse.actions.map((action, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-patriot-neon-blue/30 pl-4 pb-4"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <span className="text-sm text-patriot-neon-blue font-medium">
                                {formatDate(action.actionDate)}
                              </span>
                              {action.actionCode && (
                                <span className="text-xs text-gray-400 bg-patriot-darker px-2 py-1 rounded">
                                  {action.actionCode}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {action.text}
                            </p>
                            {action.committee && (
                              <div className="text-xs text-patriot-neon-purple">
                                Committee: {action.committee.name}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {actionsResponse.actions.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-400">
                            No actions available for this bill
                          </p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
