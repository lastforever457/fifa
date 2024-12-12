import { Card, Col, Row, Button, Modal, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../hooks/use-admin";
import { PlusOutlined } from "@ant-design/icons";

const LeaguesPage = () => {
  const [leagues, setLeagues] = useState<Record<string, any>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAdmin } = useAdmin();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = () => {
    fetch("https://72c00dc21b186658.mokky.dev/league", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setLeagues(data));
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

  const onFinish = (values: Record<string, any>) => {
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
    const games = generateFixtures(rounds, parseInt(gamesCount));

    const newLeague = {
      name,
      gamesCount: parseInt(gamesCount),
      status: "active",
      players,
      games,
      createdAt: new Date().toISOString(),
    };

    fetch("https://72c00dc21b186658.mokky.dev/league", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLeague),
    })
      .then((res) => res.json())
      .then(() => {
        fetchLeagues();
        setIsModalOpen(false);
        form.resetFields();
        message.success("League created successfully!");
      })
      .catch((error) => {
        console.error("Error creating league:", error);
        message.error("Failed to create league. Please try again.");
      });
  };

  if (!leagues) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 min-h-screen">
        <div className="relative">
          <div className="border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
          <div
            className="top-0 left-0 absolute border-green-500 border-b-4 border-solid rounded-full w-16 h-16 animate-spin"
            style={{ animationDirection: "reverse" }}
          ></div>
          <div className="mt-8 font-semibold text-white text-xl">
            Loading Leagues...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-bold text-3xl text-white">FIFA Leagues</h1>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              className="border-0 bg-gradient-to-r from-blue-500 hover:from-blue-600 to-purple-600 hover:to-purple-700"
            >
              Create League
            </Button>
          )}
        </div>

        <Row gutter={[16, 16]}>
          {leagues.map((league) => (
            <Col xs={24} sm={12} md={8} lg={6} key={league.id}>
              <Link to={`/leagues/${league.id}`} className="block h-full">
                <Card
                  hoverable
                  className="border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/70 shadow-lg hover:shadow-xl backdrop-blur-sm border h-full transform transition-all duration-300 hover:scale-105"
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-t-lg"></div>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg h-24"></div>
                    <div className="-bottom-8 left-6 absolute">
                      <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg rounded-xl w-16 h-16">
                        <span className="font-bold text-2xl text-white">
                          {league.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-12">
                    <h3 className="mb-2 font-bold text-white text-xl">
                      {league.name}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>{league.players?.length || 0} Players</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{league.gamesCount} Games</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {new Date(league.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex -space-x-2">
                        {league.players
                          ?.slice(0, 3)
                          .map((player: Record<string, any>) => (
                            <div
                              key={player.id}
                              className="flex justify-center items-center border-2 border-gray-800 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-8 h-8 font-medium text-sm text-white"
                            >
                              {player.name.charAt(0)}
                            </div>
                          ))}
                        {league.players?.length > 3 && (
                          <div className="flex justify-center items-center border-2 border-gray-800 bg-gray-700 rounded-full w-8 h-8 font-medium text-sm text-white">
                            +{league.players.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="inline-flex items-center bg-green-500/10 px-3 py-1 rounded-full font-medium text-green-400 text-sm">
                        {league.status || "Active"}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        <Modal
          title="Create New League"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          className="custom-modal"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="mt-4"
          >
            <Form.Item
              name="name"
              label="League Name"
              rules={[{ required: true, message: "Please enter league name" }]}
            >
              <Input placeholder="Enter league name" />
            </Form.Item>
            <Form.Item
              name="gamesCount"
              label="Number of Games"
              rules={[
                { required: true, message: "Please enter number of games" },
                {
                  type: "number",
                  min: 1,
                  transform: (value) => Number(value),
                  message: "Please enter a valid number greater than 0",
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Enter number of games"
                min={1}
              />
            </Form.Item>
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="border-0 bg-gradient-to-r from-blue-500 to-purple-600 w-full"
              >
                Create League
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default LeaguesPage;
