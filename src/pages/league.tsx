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
    const totalRounds = players.length - 1;
    const matchesPerRound = Math.floor(players.length / 2);
    const rounds = [];

    // Generate rounds using round-robin algorithm
    for (let round = 0; round < totalRounds; round++) {
      const roundMatches = [];
      const playersCopy = [...players];

      // Keep first player fixed, rotate others
      const firstPlayer = playersCopy.shift()!;

      // Rotate remaining players
      if (round > 0) {
        playersCopy.push(playersCopy.shift()!);
      }

      // Generate matches for this round
      for (let match = 0; match < matchesPerRound; match++) {
        const homePlayer = match === 0 ? firstPlayer : playersCopy[match - 1];
        const awayPlayer = playersCopy[playersCopy.length - 1 - match];

        roundMatches.push({
          id: Math.random().toString(36).substr(2, 9),
          roundId: round + 1,
          firstPlayerId: homePlayer.id,
          secondPlayerId: awayPlayer.id,
          firstPlayerName: homePlayer.name,
          secondPlayerName: awayPlayer.name,
          score: "-",
        });
      }

      rounds.push({
        id: round + 1,
        fixture: round + 1,
        games: roundMatches,
      });
    }

    return rounds;
  };

  const generateFixtures = (rounds: any[], gamesCount: number) => {
    /**
     * fixtures is an array of objects, each representing a round of fixtures.
     * The objects have the following properties:
     * - id: a unique identifier for the round
     * - fixture: a number representing the round number
     * - games: an array of objects, each representing a game in the round
     *   - id: a unique identifier for the game
     *   - roundId: the round number
     *   - firstPlayerId: the player id of the first player
     *   - secondPlayerId: the player id of the second player
     *   - firstPlayerName: the name of the first player
     *   - secondPlayerName: the name of the second player
     *   - score: the score of the game, initially set to "-"
     */
    const fixtures: Record<string, any>[] = [];
    const totalRounds = rounds.length;
    const repeatCount = Math.ceil(
      gamesCount / (totalRounds * Math.floor(rounds[0].games.length))
    );

    for (let i = 0; i < repeatCount; i++) {
      rounds.forEach((round, index) => {
        fixtures.push({
          ...round,
          id: i * totalRounds + index + 1,
          fixture: i * totalRounds + index + 1,
          games: round.games.map((game: any) => ({
            ...game,
            id: Math.random().toString(36).substr(2, 9),
          })),
        });
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
