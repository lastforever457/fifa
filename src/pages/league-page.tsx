import {
  Card,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Table,
  message,
} from "antd";
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

  useEffect(() => {
    fetch(`https://72c00dc21b186658.mokky.dev/league/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data || !data.players) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Games Played",
      dataIndex: "gamesPlayed",
      key: "gamesPlayed",
      render: (text: string) => (text ? <p>{text}</p> : 0),
    },
    {
      title: "Wins",
      dataIndex: "wins",
      key: "wins",
      render: (text: string) => (text ? <p>{text}</p> : 0),
    },
    {
      title: "Draws",
      dataIndex: "draws",
      key: "draws",
      render: (text: string) => (text ? <p>{text}</p> : 0),
    },
    {
      title: "Losses",
      dataIndex: "losses",
      key: "losses",
      render: (text: string) => (text ? <p>{text}</p> : 0),
    },
    {
      title: "Goals Scored",
      dataIndex: "goalsScored",
      key: "goalsScored",
      render: (text: string) => (text ? <p>{text}</p> : 0),
    },
    {
      title: "Goals Conceded",
      dataIndex: "goalsConceded",
      key: "goalsConceded",
      render: (text: string) => (text ? <p>{text}</p> : 0),
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      render: (text: string) => (text ? <p>{text}</p> : 0),
    },
  ];

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

  console.log(data);

  return (
    <div>
      <div className="flex">
        <h1 className="font-bold text-3xl">{data.name}</h1>
      </div>
      <Divider />
      <p className="mb-1 font-bold text-2xl text-center">Table</p>
      <Table
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={sortedPlayers.map(
          (player: Record<string, any>, index: number) => ({
            ...player,
            index: index + 1,
          })
        )}
      />
      <Divider />
      <p className="mb-1 font-bold text-2xl text-center">Fixtures</p>
      {data.games.map((turn: Record<string, any>) => (
        <div key={turn.id} className="mb-8">
          <h2 className="mb-4 font-semibold text-xl">Turn {turn.fixture}</h2>
          <Row gutter={[16, 16]}>
            {turn.games.map((game: Record<string, any>) => {
              const firstPlayer = data.players.find(
                (player: Record<string, any>) =>
                  player.id === game.firstPlayerId
              );
              const secondPlayer = data.players.find(
                (player: Record<string, any>) =>
                  player.id === game.secondPlayerId
              );

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={game.id}>
                  <Card className="flex flex-col justify-center items-center shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col justify-between items-center gap-5">
                      <div className="flex justify-center items-center gap-2">
                        <p className="font-bold text-lg">{firstPlayer?.name}</p>
                        <p className="mx-2 font-bold text-gray-500 text-xl tracking-[10px]">
                          {game.score}
                        </p>
                        <p className="font-bold text-lg">
                          {secondPlayer?.name}
                        </p>
                      </div>
                      {isAdmin && (
                        <div className="flex justify-center items-center gap-2">
                          <button
                            className="bg-blue-500 px-2 py-1 rounded-md text-white"
                            onClick={() => handleEdit(game)}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      ))}
      <Modal
        title="Edit score"
        open={isModalOpen}
        onOk={() => form.submit()}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
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
