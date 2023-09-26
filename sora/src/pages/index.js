/** @format */
import { useEffect, useState, useMemo } from "react";

export default function Home() {
  const [list, setList] = useState([]);
  const [value, setValue] = useState("");

  function sortByName(item1, item2) {
    const item1Numeric = parseName(item1.filename);
    const item2Numeric = parseName(item2.filename);

    if (/^\d+$/.test(item1Numeric) && /^\d+$/.test(item2Numeric)) {
      return parseInt(item1Numeric) - parseInt(item2Numeric);
    } else {
      return item1Numeric.localeCompare(item2Numeric);
    }
  }

  function parseName(name) {
    return /\d+/.test(name) ? name.replaceAll(/\D/g, "") : name;
  }

  const memoList = useMemo(() => {
    switch (value) {
      case "created":
        return list.sort((item1, item2) => Date.parse(item1.created) - Date.parse(item2.created));
      case "asc":
        return list.sort((item1, item2) => sortByName(item1, item2));
      case "desc":
        return list.sort((item1, item2) => sortByName(item2, item1));
      default:
        return list;
    }
  }, [list, value]);

  useEffect(() => {
    const fetchFileData = async (url) => {
      const resp = await fetch(url);
      const res = await resp.json();
      setList(res);
    };

    fetchFileData("/api/readdata");
  }, []);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-start p-24`}>
      <div className="flex">
        <label htmlFor="sort">Sort by</label>
        <select
          className="text-black ml-2"
          name="sort"
          id="sort"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="">--</option>
          <option value="created">created at</option>
          <option value="asc">a - z</option>
          <option value="desc">z - a</option>
        </select>
      </div>
      <div className="flex mt-6">
        {memoList.map((item, index) => (
          <div key={index} className="flex flex-col  border justify-around m-2 rounded">
            <div className="flex text-xs justify-center">{item.created}</div>
            <div className="flex p-6">{item.filename}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
