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

    const players = [
      {
        id: 1,
        name: "Abdulloh",
        gamesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsScored: 0,
        goalsConceded: 0,
      },
      {
        id: 2,
        name: "Sanjar",
        gamesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsScored: 0,
        goalsConceded: 0,
      },
      {
        id: 3,
        name: "Hikmatilla",
        gamesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsScored: 0,
        goalsConceded: 0,
      },
      {
        id: 4,
        name: "Kamron",
        gamesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsScored: 0,
        goalsConceded: 0,
      },
    ];

    // Generate all rounds of matches
    const rounds = generateRounds(players);

    // Create the specified number of fixtures
    const games = generateFixtures(rounds, gamesCount);

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
        id: data.length + 1,
        createdAt: new Date().toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((responseData: LeagueData) => {
        setData((prevData) => [...prevData, responseData]);
        setIsEditing(false);
        form.resetFields();
        message.success("League created successfully!");
      })
      .catch((error) => {
        console.error("Error creating league:", error);
        message.error("Failed to create league. Please try again.");
      });
  };

  const generateRounds = (players: any[]) => {
    // Fixed pairing pattern for gamesCount = 3
    const fixedPairings = [
      // Round 1: A vs C, B vs D
      [
        { first: 0, second: 2 }, // A vs C
        { first: 1, second: 3 }, // B vs D
      ],
      // Round 2: A vs B, C vs D
      [
        { first: 0, second: 1 }, // A vs B
        { first: 2, second: 3 }, // C vs D
      ],
      // Round 3: A vs D, C vs B
      [
        { first: 0, second: 3 }, // A vs D
        { first: 2, second: 1 }, // C vs B
      ],
    ];

    const rounds: Record<string, any>[] = [];

    fixedPairings.forEach((roundPairs, roundIndex) => {
      const roundMatches = roundPairs.map((pair) => ({
        id: Math.random().toString(36).substr(2, 9),
        roundId: roundIndex + 1,
        firstPlayerId: players[pair.first].id,
        secondPlayerId: players[pair.second].id,
        firstPlayerName: players[pair.first].name,
        secondPlayerName: players[pair.second].name,
        score: "-",
      }));

      rounds.push({
        id: roundIndex + 1,
        fixture: roundIndex + 1,
        games: roundMatches,
      });
    });

    return rounds;
  };

  const generateFixtures = (rounds: any[], gamesCount: number) => {
    if (gamesCount === 3) {
      return rounds; // Return the exact pattern for gamesCount = 3
    }

    // For other gamesCount values, repeat the pattern
    const fixtures: Record<string, any>[] = [];
    const repeatCount = Math.ceil(gamesCount / 3);

    for (let i = 0; i < repeatCount; i++) {
      rounds.forEach((round, index) => {
        if (i * 3 + index + 1 <= gamesCount) {
          fixtures.push({
            ...round,
            id: i * rounds.length + index + 1,
            fixture: i * rounds.length + index + 1,
            games: round.games.map((game: Record<string, any>) => ({
              ...game,
              id: Math.random().toString(36).substr(2, 9),
            })),
          });
        }
      });
    }

    return fixtures;
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
