import { Form, Input, Button, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../hooks/use-admin";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setIsAdmin } = useAdmin();

  const handleSubmit = (values: Record<string, any>) => {
    const { username, password } = values;
    if (username === "admin" && password === "1211") {
      message.success("Login successful");
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      navigate("/");
    } else {
      message.error("Wrong credentials");
    }
  };

  return (
    <Form
      onFinish={handleSubmit}
      className="flex flex-col justify-center items-center"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full"
        />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Admin;
