import { X } from "lucide-react";

const FilterBar = ({ searchParams, setSearchParams }) => {
  return (
    <>
      <div className="drawer-side z-50 lg:hidden">
        <label htmlFor="filter-drawer" className="drawer-overlay"></label>

        <aside className="w-72 max-w-[85vw] min-h-full bg-base-100 p-4 sm:p-6 pr-14 overflow-y-auto">
          <label
            htmlFor="filter-drawer"
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          >
            <X size={18} />
          </label>

          <Filters
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </aside>
      </div>

      <aside className="hidden lg:block w-64 shrink-0 border-r border-base-300 bg-base-100 p-5">
        <Filters
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      </aside>
    </>
  );
};

function Filters({ searchParams, setSearchParams }) {
  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    setSearchParams(params);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Filters</h2>

        <button
          className="btn btn-ghost btn-xs text-primary"
          onClick={() => setSearchParams({})}
        >
          Clear All
        </button>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-semibold mb-2">Location</h3>

        <select
          className="select select-sm w-full"
          value={searchParams.get("location") || ""}
          onChange={(e) => updateParam("location", e.target.value)}
        >
          <option value="">Select location</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Pune">Pune</option>
          <option value="Chennai">Chennai</option>
          <option value="Kolkata">Kolkata</option>
          <option value="Coimbatore">Coimbatore</option>
          <option value="Kerala">Kerala</option>
        </select>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-semibold mb-2">Experience</h3>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="experience"
              checked={
                searchParams.get("minExp") === "0" &&
                searchParams.get("maxExp") === "1"
              }
              onChange={() => {
                const params = new URLSearchParams(searchParams);
                params.set("minExp", "0");
                params.set("maxExp", "1");
                params.delete("requiredExp");
                setSearchParams(params);
              }}
            />
            0 - 1 Years
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="experience"
              checked={
                searchParams.get("minExp") === "1" &&
                searchParams.get("maxExp") === "3"
              }
              onChange={() => {
                const params = new URLSearchParams(searchParams);
                params.set("minExp", "1");
                params.set("maxExp", "3");
                params.delete("requiredExp");
                setSearchParams(params);
              }}
            />
            1 - 3 Years
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="experience"
              checked={
                searchParams.get("minExp") === "3" &&
                searchParams.get("maxExp") === "5"
              }
              onChange={() => {
                const params = new URLSearchParams(searchParams);
                params.set("minExp", "3");
                params.set("maxExp", "5");
                params.delete("requiredExp");
                setSearchParams(params);
              }}
            />
            3 - 5 Years
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="experience"
              checked={
                !searchParams.get("minExp") &&
                searchParams.get("requiredExp") === "5"
              }
              onChange={() => {
                const params = new URLSearchParams(searchParams);
                params.set("requiredExp", "5");
                params.delete("minExp");
                params.delete("maxExp");
                setSearchParams(params);
              }}
            />
            5+ Years
          </label>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-semibold mb-2">Salary Range</h3>
        <input
          type="range"
          min="0"
          max="20"
          step="1"
          value={searchParams.get("maxSalary") || 0}
          onChange={(e) => updateParam("maxSalary", e.target.value)}
          className="range range-primary range-xs"
        />

        <div className="flex justify-between mt-2 text-sm">
          <span>₹0</span>
          <span>₹{searchParams.get("maxSalary") || 0} LPA</span>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-semibold mb-2">Employment Type</h3>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="jobType"
              checked={searchParams.get("jobType") === "Full-Time"}
              onChange={() => updateParam("jobType", "Full-Time")}
            />
            Full Time
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="jobType"
              checked={searchParams.get("jobType") === "Part-Time"}
              onChange={() => updateParam("jobType", "Part-Time")}
            />
            Part Time
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="jobType"
              checked={searchParams.get("jobType") === "Contract"}
              onChange={() => updateParam("jobType", "Contract")}
            />
            Contract
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="jobType"
              checked={searchParams.get("jobType") === "Internship"}
              onChange={() => updateParam("jobType", "Internship")}
            />
            Internship
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Remote</h3>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={searchParams.get("isRemote") === "true"}
            onChange={(e) =>
              updateParam("isRemote", e.target.checked ? "true" : "")
            }
          />
          Remote Only
        </label>
      </div>
    </>
  );
}

export default FilterBar;
