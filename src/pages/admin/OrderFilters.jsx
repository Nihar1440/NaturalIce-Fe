// src/pages/admin/OrderFilters.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, FileText, Filter, RotateCw, Search, X } from "lucide-react";

const statusOptions = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const OrderFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterDate,
  setFilterDate,
  showFilters,
  setShowFilters,
  onSearch,
  onReset,
  totalOrders,
}) => (
  <div className="mb-6 space-y-4">
    {/* Search Bar */}
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 flex">
        <Input
          type="text"
          placeholder="Search by Order ID, customer name, or email..."
          className="flex-1 rounded-r-none border-r-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") onSearch();
          }}
        />
        <Button
          onClick={onSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-l-none px-4"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Search</span>
        </Button>
      </div>
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="sm:hidden"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
    </div>

    {/* Desktop Filters */}
    <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Status
        </label>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Date
        </label>
        <div className="relative">
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>
      </div>
      <div className="flex items-end">
        <Button onClick={onReset} variant="outline" className="w-full">
          <RotateCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
      <div className="flex items-end">
        <Button
          onClick={() => alert("Export to PDF not implemented")}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <FileText className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>
      <div className="flex items-end">
        <div className="text-sm text-gray-600 p-2">
          Total: <span className="font-semibold">{totalOrders}</span> orders
        </div>
      </div>
    </div>

    {/* Mobile Filters */}
    {showFilters && (
      <div className="sm:hidden bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-800">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Status
            </label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onReset} variant="outline" className="flex-1">
              <RotateCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={() => alert("Export to PDF not implemented")}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default OrderFilters;