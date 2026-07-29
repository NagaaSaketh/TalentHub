import { X } from "lucide-react";

const FilterBar = () => {
  return (
    <>
      <div className="drawer-side z-50 lg:hidden">
        <label htmlFor="filter-drawer" className="drawer-overlay"></label>

        <aside className="w-72 min-h-full bg-base-100 p-6">
          <label
            htmlFor="filter-drawer"
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          >
            <X size={18} />
          </label>

          <Filters />
        </aside>
      </div>

      <aside className="hidden lg:block w-64 border-r border-base-300 bg-base-100 p-5">
        <Filters />
      </aside>
    </>
  );
};

function Filters() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button className="btn btn-ghost btn-xs text-primary">Clear All</button>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-semibold mb-2">Location</h3>

        <select className="select select-sm w-full">
          <option>Select location</option>
          <option>Bangalore</option>
          <option>Hyderabad</option>
          <option>Mumbai</option>
          <option>Delhi</option>
        </select>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-semibold mb-2">Experience</h3>

        <div className="space-y-2">
          <label className="flex items-center gap-2 py-1 cursor-pointer text-sm">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span>0 - 1 Years</span>
          </label>

          <label className="flex items-center gap-2 py-1 cursor-pointer text-sm">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span>1 - 3 Years</span>
          </label>

          <label className="flex items-center gap-2 py-1 cursor-pointer text-sm">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span>3 - 5 Years</span>
          </label>

          <label className="flex items-center gap-2 py-1 cursor-pointer text-sm">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span>5+ Years</span>
          </label>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-semibold mb-2">Salary Range</h3>

        <input
          type="range"
          min="0"
          max="50"
          defaultValue="20"
          className="range range-primary range-xs"
        />

        <div className="flex justify-between mt-2 text-sm">
          <span>₹0</span>
          <span>₹20 LPA+</span>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-semibold mb-2">Employment Type</h3>

        <div className="space-y-2">
          <label className="flex items-center gap-2 py-1 cursor-pointer text-sm">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span>Full Time</span>
          </label>

          <label className="flex items-center gap-2 py-1 cursor-pointer text-sm">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span>Part Time</span>
          </label>

          <label className="flex items-center gap-2 py-1 cursor-pointer text-sm">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span>Contract</span>
          </label>

          <label className="flex items-center gap-2 py-1 cursor-pointer text-sm">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span>Internship</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Remote</h3>

        <label className="flex items-center gap-2 py-1 cursor-pointer text-sm">
          <input type="checkbox" className="checkbox checkbox-sm" />
          <span>Remote Only</span>
        </label>
      </div>
    </>
  );
}

export default FilterBar;
