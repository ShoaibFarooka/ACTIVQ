import React, { useState, useEffect } from "react";
import "./SearchBar.css";

// TODO: implement
// another search since using this for
// larger lists could cause performance 
// issue since this has become expensive

const SearchBar = ({
  items = [],
  onResults,
  excludedItems = [],
}) => {
  const [searchValue, setSearchValue] = useState("");
  const spaceStrings = [
    "\u00A0", // Non-breaking space
    "\u2002", // En space
    "\u2003", // Em space
    "\u2007", // Figure space
    "\u2008", // Punctuation space
    "\u2009", // Thin space
    "\u200A", // Hairspace
  ];

  useEffect(() => {
    onResults(items);
  }, [items]);

  useEffect(() => {
    // if there's no search value..
    if (searchValue.trim() === "") {
      onResults(items);
      return;
    }

    const randomSpace = Math.floor(Math.random() * (spaceStrings.length - 1));
    onResults(
      items.filter((item) => {
        // Remove all the un-necessary items from the dataSet
        const deepClonedItem = JSON.parse(JSON.stringify(item));
        excludedItems.forEach((exclItem) => delete deepClonedItem[exclItem]);
        
        // Stringify each block and include whether the
        // search related item is present in it or not..

        return JSON.stringify(
          Object.values(deepClonedItem)
          .filter(value => !Array.isArray(value) && typeof value !== 'object') // Filter out arrays
          .join(randomSpace)
        )
        .toUpperCase()
        .includes(searchValue.toUpperCase());
      })
    );
  }, [searchValue]);

  return (
    <div className="search-bar-container">
      <input
        type="text"
        onChange={(ev) => setSearchValue(ev.target.value)}
        placeholder="Search.."
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
