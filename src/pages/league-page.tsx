import { Card, Col, Divider, Form, Input, Modal, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdmin } from "../hooks/use-admin";

const LeaguePage = () => {
  const { id } = useParams();
  const [data, setData] = useState<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Record<string, any>>({});
  const { isAdmin } = useAdmin();

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
    },
    {
      title: "Wins",
      dataIndex: "wins",
      key: "wins",
    },
    {
      title: "Losses",
      dataIndex: "losses",
      key: "losses",
    },
    {
      title: "Draws",
      dataIndex: "draws",
      key: "draws",
    },
    {
      title: "Goals Scored",
      dataIndex: "goalsScored",
      key: "goalsScored",
    },
    {
      title: "Goals Conceded",
      dataIndex: "goalsConceded",
      key: "goalsConceded",
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
    },
  ];

  const handleEdit = (game: Record<string, any>) => {
    setEditingGame(game);
    setIsModalOpen(true);
  };

  const handleModalOk = (score: string) => {
    const newScore = score.split("-");
    const firstPlayerGoals = Number(newScore[0]);
    const secondPlayerGoals = Number(newScore[1]);

    const firstPlayer = data.players.find(
      (player: Record<string, any>) => player.id === editingGame.firstPlayerId
    );
    const secondPlayer = data.players.find(
      (player: Record<string, any>) => player.id === editingGame.secondPlayerId
    );

    if (firstPlayerGoals > secondPlayerGoals) {
      firstPlayer.wins += 1;
      secondPlayer.losses += 1;
    } else if (secondPlayerGoals > firstPlayerGoals) {
      firstPlayer.losses += 1;
      secondPlayer.wins += 1;
    } else {
      firstPlayer.draws += 1;
      secondPlayer.draws += 1;
    }

    firstPlayer.goalsScored += firstPlayerGoals;
    secondPlayer.goalsScored += secondPlayerGoals;
    firstPlayer.goalsConceded += secondPlayerGoals;
    secondPlayer.goalsConceded += firstPlayerGoals;

    setData((prevState) => ({
      ...prevState,
      players: data.players.map((player: Record<string, any>) =>
        player.id === firstPlayer.id ? firstPlayer : player
      ),
    }));

    setIsModalOpen(false);
  };

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
        dataSource={data?.players.map(
          (player: Record<string, any>, index: number) => ({
            ...player,
            index: index + 1,
          })
        )}
      />
      <Divider />
      <p className="mb-1 font-bold text-2xl text-center">Fixtures</p>
      {data.games.map((turn: Record<string, any>, index: number) => (
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
                    <div className="flex justify-between items-center gap-5">
                      <div className="flex justify-center items-center">
                        <p className="font-bold text-lg">{firstPlayer?.name}</p>
                        <p className="mx-2 text-gray-500">{game.score}</p>
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
        onOk={() => handleModalOk(editingGame.score)}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Score">
            <Input
              placeholder="2-1"
              value={editingGame.score}
              onChange={(e: any) =>
                setEditingGame((prevState) => ({
                  ...prevState,
                  score: e.target.value,
                }))
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeaguePage;
