import { Button, Drawer, Form, Input, message, Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "../hooks/use-admin";
import { Link } from "react-router-dom";

interface LeagueData {
  id: number;
  name: string;
  gamesCount: number;
  status: string;
  players: Record<string, any>[];
  games: Record<string, any>[];
}

const League = () => {
  const [data, setData] = useState<LeagueData[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingData, setEditingData] = useState<LeagueData | null>(null);
  const { isAdmin } = useAdmin();
  const [form] = Form.useForm();

  useEffect(() => {
    fetch("https://72c00dc21b186658.mokky.dev/league", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data: LeagueData[]) => setData(data));
  }, []);

  const handleSubmit = (values: Record<string, any>) => {
    const { name, gamesCount } = values;

    const players: Record<string, any>[] = [
      { id: 1, name: "Abdulloh" },
      { id: 2, name: "Sanjar" },
      { id: 3, name: "Hikmatilla" },
      { id: 4, name: "Kamron" },
    ];

    if (players.length % 2 !== 0) {
      players.push({ id: -1, name: "Bye" });
    }

    const totalRounds = players.length - 1;
    const rounds: Record<string, any>[] = [];

    let rotatingPlayers = players.slice(1);

    for (let round = 0; round < totalRounds; round++) {
      const roundGames = [];

      for (let i = 0; i < players.length / 2; i++) {
        const firstPlayer = i === 0 ? players[0] : rotatingPlayers[i - 1];
        const secondPlayer = rotatingPlayers[rotatingPlayers.length - i - 1];

        if (firstPlayer.id !== -1 && secondPlayer.id !== -1) {
          roundGames.push({
            id: Math.random(),
            firstPlayerId: firstPlayer.id,
            secondPlayerId: secondPlayer.id,
            score: "-",
          });
        }
      }

      rounds.push({
        id: round + 1,
        fixture: round + 1,
        games: roundGames,
      });

      rotatingPlayers = [
        rotatingPlayers[rotatingPlayers.length - 1],
        ...rotatingPlayers.slice(0, rotatingPlayers.length - 1),
      ];
    }

    const games = Array.from(
      { length: Math.ceil(gamesCount / totalRounds) },
      (_, idx) => ({
        id: idx + 1,
        fixture: idx + 1,
        games: rounds.flatMap((round) => round.games),
      })
    );

    fetch("https://72c00dc21b186658.mokky.dev/league", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        gamesCount,
        status: "active",
        players,
        games,
      }),
    })
      .then((res) => res.json())
      .then((data: LeagueData) => {
        setData((prevData) => [...prevData, data]);
        setIsEditing(false);
      });
  };

  const columns = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "index",
        key: "index",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (name: Record<string, any>) => (
          <Link to={`${name.id}`}>{name.name}</Link>
        ),
      },
      {
        title: "Games Count",
        dataIndex: "gamesCount",
        key: "gamesCount",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: string) => (
          <div>
            {status === "active" ? (
              <span className="font-semibold text-green-500">Active</span>
            ) : (
              <span className="font-semibold text-red-500">Inactive</span>
            )}
          </div>
        ),
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
                if (isAdmin === true) {
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
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">League</h1>
        {isAdmin === true && (
          <button
            className="bg-blue-500 px-2 py-1 rounded-md text-white"
            onClick={() => {
              if (isAdmin === true) {
                setIsEditing(true);
              } else {
                message.error("You are not an admin");
              }
            }}
          >
            Create League
          </button>
        )}
      </div>
      <div className="mt-5">
        <Table
          dataSource={data.map((item: LeagueData, index: number) => ({
            ...item,
            name: {
              name: item.name,
              id: item.id,
            },
            index: index + 1,
          }))}
          columns={columns}
          scroll={{ x: true }}
        />
      </div>
      <Drawer
        title="Edit League"
        open={isEditing}
        onClose={() => setIsEditing(false)}
      >
        <Form onFinish={handleSubmit} form={form}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Games count" name="gamesCount">
            <Input type="number" />
          </Form.Item>
        </Form>
        <Button onClick={() => form.submit()}>Create</Button>
      </Drawer>
    </div>
  );
};

export default League;
