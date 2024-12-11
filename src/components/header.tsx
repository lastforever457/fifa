import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Drawer, Menu } from "antd";
import { FaBars } from "react-icons/fa";

const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b">
      <div className="flex justify-between items-center mx-auto px-5 md:px-10 py-5 container">
        <Link to={"/"}>
          <h1 className="text-base md:text-3xl">FIFA Tournament</h1>
        </Link>
        <Menu
          mode="horizontal"
          className="md:flex justify-center sm:justify-end hidden"
        >
          <Menu.Item>
            <NavLink to={"/"}>Players</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to={"/league"}>League</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to={"/chl"}>Champions League</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to={"/admin"}>Admin</NavLink>
          </Menu.Item>
        </Menu>
        <Button onClick={() => setOpen(true)} className="md:hidden">
          <FaBars />
        </Button>
      </div>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="top"
        title={"Menu"}
        width={200}
      >
        <Menu mode="vertical" className="">
          <Menu.Item>
            <NavLink to={"/"}>Home</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to={"/league"}>League</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to={"/chl"}>Champions League</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to={"/admin"}>Admin</NavLink>
          </Menu.Item>
        </Menu>
      </Drawer>
    </header>
  );
};

export default Header;
