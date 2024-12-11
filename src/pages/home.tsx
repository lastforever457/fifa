import { Form, Input, message, Table, Drawer } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "../hooks/use-admin";

const Home = () => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { isAdmin } = useAdmin();

  useEffect(() => {
    fetch("https://72c00dc21b186658.mokky.dev/players", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "League Wins",
        dataIndex: "leagueWon",
        key: "leagueWon",
      },
      {
        title: "Champions League Wins",
        dataIndex: "championsWon",
        key: "championsWon",
      },
      {
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        render: () => (
          <div>
            <button
              className="bg-blue-500 px-2 py-1 rounded-md text-white"
              onClick={() => {
                if (isAdmin) {
                  setIsEditing(true);
                } else {
                  message.error("You are not an admin");
                }
              }}
            >
              Edit
            </button>
          </div>
        ),
      },
    ],
    []
  );
  return (
    <div>
      <h1 className="font-bold text-xl">Players</h1>
      <div className="mt-5">
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: "max-content" }}
        />
      </div>
      <Drawer
        title="Edit Player"
        open={isEditing}
        onClose={() => setIsEditing(false)}
      >
        <Form layout={"vertical"}>
          <Form.Item name={"name"} label="Name">
            <Input type="text" />
          </Form.Item>
          <Form.Item name={"leagueWon"} label="League Wins">
            <Input type="number" />
          </Form.Item>
          <Form.Item name={"championsWon"} label="Champions League Wins">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Home;
