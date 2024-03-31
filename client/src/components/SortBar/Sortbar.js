import React, { useState } from "react";
import { Dropdown, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

const Menus = ({ items, onChange }) => {
  function handleMenuClick(e) {
    onChange(e.key);
  }

  return (
    <Menu onClick={handleMenuClick}>
      {items.map((itemValue, ix) => (
        <Menu.Item key={itemValue.label + " ~ " + itemValue.title}>
          {itemValue.title}
        </Menu.Item>
      ))}
    </Menu>
  );
};

const SortBar = ({ items = [], onChange = () => {} }) => {
  const [sortBy, setSortBy] = useState("");
  return (
    <div style={{ paddingLeft: '12px' }}>
      <Dropdown
        overlay={
          <Menus
            items={items}
            onChange={(key) => {
              onChange(key.split(" ~ ")[0]);
              setSortBy(key.split(" ~ ")[1]);
            }}
          />
        }
      >
        <Button style={{ display: "flex", alignItems: "center" }}>
          Sort by {sortBy} <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};
export default SortBar;
