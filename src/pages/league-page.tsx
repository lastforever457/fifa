import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdmin } from "../hooks/use-admin";

const LeaguePage = () => {
  const { id } = useParams();
  const [data, setData] = useState<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Record<string, any>>({});
  const { isAdmin } = useAdmin();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("table");

  useEffect(() => {
    fetch(`https://72c00dc21b186658.mokky.dev/league/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data || !data.players) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 min-h-screen">
        <div className="relative">
          <div className="border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
          <div
            className="top-0 left-0 absolute border-green-500 border-b-4 border-solid rounded-full w-16 h-16 animate-spin"
            style={{ animationDirection: "reverse" }}
          ></div>
          <div className="mt-8 font-semibold text-white text-xl">
            Loading League Data...
          </div>
        </div>
      </div>
    );
  }
  const handleEdit = (game: Record<string, any>) => {
    setEditingGame(game);
    setIsModalOpen(true);
  };

  const onFinish = (values: Record<string, any>) => {
    const { firstScore, secondScore } = values;
    const firstPlayerGoals = parseInt(firstScore);
    const secondPlayerGoals = parseInt(secondScore);

    const updatedPlayers = data.players.map((player: Record<string, any>) => {
      const playerCopy = { ...player };

      if (player.id === editingGame.firstPlayerId) {
        if (firstPlayerGoals > secondPlayerGoals) {
          playerCopy.wins = (playerCopy.wins || 0) + 1;
        } else if (firstPlayerGoals < secondPlayerGoals) {
          playerCopy.losses = (playerCopy.losses || 0) + 1;
        } else {
          playerCopy.draws = (playerCopy.draws || 0) + 1;
        }
        playerCopy.goalsScored =
          (playerCopy.goalsScored || 0) + firstPlayerGoals;
        playerCopy.goalsConceded =
          (playerCopy.goalsConceded || 0) + secondPlayerGoals;
        playerCopy.gamesPlayed = (playerCopy.gamesPlayed || 0) + 1;
      }

      if (player.id === editingGame.secondPlayerId) {
        if (secondPlayerGoals > firstPlayerGoals) {
          playerCopy.wins = (playerCopy.wins || 0) + 1;
        } else if (secondPlayerGoals < firstPlayerGoals) {
          playerCopy.losses = (playerCopy.losses || 0) + 1;
        } else {
          playerCopy.draws = (playerCopy.draws || 0) + 1;
        }
        playerCopy.goalsScored =
          (playerCopy.goalsScored || 0) + secondPlayerGoals;
        playerCopy.goalsConceded =
          (playerCopy.goalsConceded || 0) + firstPlayerGoals;
        playerCopy.gamesPlayed = (playerCopy.gamesPlayed || 0) + 1;
      }

      return playerCopy;
    });

    const updatedGames = data.games.map((round: Record<string, any>) => ({
      ...round,
      games: round.games.map((game: Record<string, any>) =>
        game.id === editingGame.id
          ? {
              ...game,
              score: `${firstPlayerGoals}-${secondPlayerGoals}`,
            }
          : game
      ),
    }));

    const updatedData = {
      ...data,
      players: updatedPlayers,
      games: updatedGames,
    };

    fetch(`https://72c00dc21b186658.mokky.dev/league/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((responseData) => {
        setData(responseData);
        setIsModalOpen(false);
        form.resetFields();
        message.success("Game result updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating game result:", error);
        message.error("Failed to update game result. Please try again.");
      });
  };

  const calculatePoints = (player: Record<string, any>) => {
    const wins = player.wins || 0;
    const draws = player.draws || 0;
    return wins * 3 + draws;
  };

  const sortedPlayers = [...(data.players || [])].sort((a, b) => {
    const pointsA = calculatePoints(a);
    const pointsB = calculatePoints(b);

    if (pointsB !== pointsA) {
      return pointsB - pointsA;
    }

    const goalDiffA = (a.goalsScored || 0) - (a.goalsConceded || 0);
    const goalDiffB = (b.goalsScored || 0) - (b.goalsConceded || 0);

    if (goalDiffB !== goalDiffA) {
      return goalDiffB - goalDiffA;
    }

    return (b.goalsScored || 0) - (a.goalsScored || 0);
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 min-h-screen text-white">
      {/* Hero Section with Dynamic Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.fifa.com/assets/img/tournaments/17/2018/common/grass_bg.png')] opacity-10"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-8 text-center">
              <div className="inline-block">
                <h1 className="bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 font-extrabold text-5xl text-transparent md:text-7xl animate-gradient-x">
                  {data.name}
                </h1>
                <div className="flex justify-center items-center space-x-4 mt-4">
                  <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full">
                    <span className="font-medium text-sm">
                      Season {data.season || "2024"}
                    </span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full">
                    <span className="font-medium text-sm">
                      {data.players.length} Players
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mx-auto -mt-10 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative h-[160px] group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-blue-600 opacity-50 group-hover:opacity-100 blur rounded-lg transition animate-tilt duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gray-900 p-6 rounded-lg h-full">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-400 text-sm">
                  Matches Played
                </span>
                <span className="text-2xl text-blue-400">
                  {data.games?.length || 0}
                </span>
              </div>
              <div className="flex items-center mt-4">
                <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 rounded-full h-full"
                    style={{
                      width: `${((data.games?.length || 0) / 100) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[160px] group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 opacity-50 group-hover:opacity-100 blur rounded-lg transition animate-tilt duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gray-900 p-6 rounded-lg h-full">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-400 text-sm">
                  Total Goals
                </span>
                <span className="text-2xl text-purple-400">
                  {data.games?.reduce(
                    (acc: number, game: any) =>
                      acc +
                      (parseInt(game.score?.split("-")[0] || 0) +
                        parseInt(game.score?.split("-")[1] || 0)),
                    0
                  ) || 0}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-gray-400 text-sm">
                  Average Goals per Game
                </div>
                <div className="font-semibold text-lg text-purple-400">
                  {(
                    (data.games?.reduce(
                      (acc: number, game: any) =>
                        acc +
                        (parseInt(game.score?.split("-")[0] || 0) +
                          parseInt(game.score?.split("-")[1] || 0)),
                      0
                    ) || 0) / (data.games?.length || 1)
                  ).toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[160px] group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-red-600 opacity-50 group-hover:opacity-100 blur rounded-lg transition animate-tilt duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gray-900 p-6 rounded-lg h-full">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-400 text-sm">
                  Top Scorer
                </span>
                <span className="text-2xl text-yellow-400">
                  {sortedPlayers[0]?.goalsScored || 0}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-gray-400 text-sm">Player</div>
                <div className="font-semibold text-lg text-yellow-400">
                  {sortedPlayers[0]?.name || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[160px] group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 opacity-50 group-hover:opacity-100 blur rounded-lg transition animate-tilt duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gray-900 p-6 rounded-lg h-full">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-400 text-sm">
                  League Status
                </span>
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full w-3 h-3 animate-pulse"></div>
                  <span className="ml-2 text-green-400 text-sm">Active</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-gray-400 text-sm">Current Round</div>
                <div className="font-semibold text-green-400 text-lg">
                  Round{" "}
                  {Math.max(...data.games.map((g: any) => g.fixture)) || 1}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mx-auto mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("table")}
            className={`flex-1 py-3 px-6 text-sm font-medium rounded-lg transition ${
              activeTab === "table"
                ? "bg-white/10 text-white shadow-lg backdrop-blur-lg"
                : "text-gray-400 hover:bg-white/5"
            }`}
          >
            League Table
          </button>
          <button
            onClick={() => setActiveTab("fixtures")}
            className={`flex-1 py-3 px-6 text-sm font-medium rounded-lg transition ${
              activeTab === "fixtures"
                ? "bg-white/10 text-white shadow-lg backdrop-blur-lg"
                : "text-gray-400 hover:bg-white/5"
            }`}
          >
            Fixtures
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {activeTab === "table" ? (
          <div className="bg-gray-800/50 shadow-xl backdrop-blur-md rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="divide-y divide-gray-700 min-w-full">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="px-6 py-4 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-4 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                      MP
                    </th>
                    <th className="px-6 py-4 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                      W
                    </th>
                    <th className="px-6 py-4 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                      D
                    </th>
                    <th className="px-6 py-4 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                      L
                    </th>
                    <th className="px-6 py-4 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                      GF
                    </th>
                    <th className="px-6 py-4 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                      GA
                    </th>
                    <th className="px-6 py-4 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                      GD
                    </th>
                    <th className="px-6 py-4 font-medium text-gray-300 text-left text-xs uppercase tracking-wider">
                      PTS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sortedPlayers.map((player: any, index: number) => (
                    <tr
                      key={player.id}
                      className="hover:bg-white/5 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-sm
                            ${
                              index === 0
                                ? "bg-yellow-500 text-black"
                                : index === 1
                                ? "bg-gray-300 text-black"
                                : index === 2
                                ? "bg-yellow-700 text-white"
                                : "bg-gray-700 text-gray-300"
                            }
                          `}
                          >
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-10 h-10 font-bold text-white">
                            {player.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-white">
                              {player.name}
                            </div>
                            <div className="text-gray-400 text-xs">
                              Rating:{" "}
                              {(
                                ((player.goalsScored || 0) /
                                  (player.gamesPlayed || 1)) *
                                5
                              ).toFixed(1)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm whitespace-nowrap">
                        {player.gamesPlayed || 0}
                      </td>
                      <td className="px-6 py-4 text-green-400 text-sm whitespace-nowrap">
                        {player.wins || 0}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap">
                        {player.draws || 0}
                      </td>
                      <td className="px-6 py-4 text-red-400 text-sm whitespace-nowrap">
                        {player.losses || 0}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm whitespace-nowrap">
                        {player.goalsScored || 0}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm whitespace-nowrap">
                        {player.goalsConceded || 0}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span
                          className={`${
                            (player.goalsScored || 0) -
                              (player.goalsConceded || 0) >
                            0
                              ? "text-green-400"
                              : (player.goalsScored || 0) -
                                  (player.goalsConceded || 0) <
                                0
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {(player.goalsScored || 0) -
                            (player.goalsConceded || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-lg text-white">
                          {calculatePoints(player)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-12 lg:space-y-16">
            {data.games.map((turn: Record<string, any>) => (
              <div
                key={turn.id}
                className="bg-gray-800/50 shadow-xl backdrop-blur-md rounded-xl md:w-1/2 lg:w-1/3 xl:w-1/4 overflow-hidden"
              >
                <div className="bg-gray-900/50 px-6 py-4">
                  <h2 className="font-semibold text-xl sm:text-base">
                    Round {turn.fixture}
                  </h2>
                </div>
                <div className="p-6">
                  <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {turn.games.map((game: Record<string, any>) => {
                      const firstPlayer = data.players.find(
                        (player: Record<string, any>) =>
                          player.id === game.firstPlayerId
                      );
                      const secondPlayer = data.players.find(
                        (player: Record<string, any>) =>
                          player.id === game.secondPlayerId
                      );
                      const [score1, score2] = game.score
                        ? game.score.split("-").map(Number)
                        : [0, 0];

                      return (
                        <div key={game.id} className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 opacity-25 group-hover:opacity-100 blur rounded-lg transition duration-1000 group-hover:duration-200"></div>
                          <div className="relative bg-gray-900 p-6 rounded-lg">
                            <div className="flex justify-between items-center space-x-4">
                              <div className="flex flex-1 items-center space-x-3">
                                <span className="font-medium sm:text-sm truncate">
                                  {firstPlayer?.name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="font-bold text-2xl sm:text-base">
                                  {score1}
                                </span>
                                <span className="text-gray-400">-</span>
                                <span className="font-bold text-2xl sm:text-base">
                                  {score2}
                                </span>
                              </div>
                              <div className="flex flex-1 justify-end items-center space-x-3">
                                <span className="font-medium sm:text-sm truncate">
                                  {secondPlayer?.name}
                                </span>
                              </div>
                            </div>
                            {isAdmin && (
                              <div className="flex justify-center mt-4">
                                <button
                                  onClick={() => handleEdit(game)}
                                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-sm sm:text-xs transition-colors duration-200"
                                >
                                  Edit Result
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        title="Edit Match Result"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => setIsModalOpen(false)}
        className="backdrop-blur-lg"
      >
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Form.Item name={"firstScore"} label={editingGame.firstPlayerName}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name={"secondScore"} label={editingGame.secondPlayerName}>
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <button className="bg-blue-500 px-2 py-1 rounded-md text-white">
              Save
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeaguePage;
