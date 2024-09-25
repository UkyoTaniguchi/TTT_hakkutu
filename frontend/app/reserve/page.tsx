"use client";

import { useState, useEffect } from "react";

interface Info {
  id: number;
  availability: number;
  reserver: number;
}

export default function Reserve() {
  const [infos, setInfo] = useState<Info[]>([]);
  const [reserver, setReserver] = useState<string>("");
  const [ID, setID] = useState<number | null>(null);

  useEffect(() => {
    const fetchFaceStatus = async () => {
      try {
        const response = await fetch("http://localhost:5001/json_data", {
          cache: "no-cache",
        });
        const data: Info[] = await response.json();
        setInfo(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFaceStatus();

    const interval = setInterval(fetchFaceStatus, 1000); // 定期的にフェッチ
    return () => clearInterval(interval); // クリーンアップ
  }, []);

  // 予約ボタンのハンドラー
  const handleReserve = async () => {
    if (ID === null) {
      alert("座席番号を選択してください。");
      return;
    }
    if (reserver.trim() === "") {
      alert("名前を入力してください。");
      return;
    }

    try {
      // 予約処理をバックエンドに送信
      const response = await fetch("http://localhost:5000/external_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          availability: 2,
          reserver: reserver,
          id: ID,
        }),
      });

      alert("予約が完了しました。");
      setReserver("");
      setID(null);

      if (!response.ok) {
        throw new Error("予約に失敗しました。");
      }
    } catch (error) {
      console.error(error);
      alert("予約に失敗しました。再度お試しください。");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="flex flex-col items-center w-[80%] h-[500px] border border-gray-700 rounded-2xl p-5 z-50 justify-center">
        <div className="flex w-full justify-evenly">
          <div className="p-10 border shadow-white rounded-2xl mb-5 pt-5">
            <h1 className="text-center text-3xl font-bold mb-5 text-[#d88758]">
              予約可能
            </h1>
            <ul className="flex flex-col items-center">
              {infos.map((info) =>
                info.availability === 0 ? (
                  <li key={info.id} className="mb-3">
                    <button
                      className={`p-2 rounded-lg bg-slate-800 hover:bg-gray-900 ${
                        ID === info.id ? "bg-emerald-500" : ""
                      }`}
                      onClick={() => {
                        setID(info.id);
                      }}
                    >
                      席番号: <span className="font-bold">{info.id}</span>
                    </button>
                  </li>
                ) : null
              )}
            </ul>
          </div>
          <div className="p-10 border shadow-white rounded-2xl mb-5 pt-5">
            <h1 className="text-center text-3xl font-bold text-gray-400 opacity-50 mb-5">
              予約不可
            </h1>
            <ul className="flex flex-col items-center">
              {infos.map((info) =>
                info.availability === 1 || info.availability === 2 ? (
                  <li key={info.id} className="mb-4">
                    <button
                      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-900 cursor-not-allowed"
                      disabled
                    >
                      席番号: <span className="font-bold">{info.id}</span>
                    </button>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>

        {/* 選択された座席番号の表示 */}
        <div className="mb-5">
          <p className="text-xl">
            選択座席番号:{" "}
            <span className="font-bold text-[#c09933]">
              {ID !== null ? ID : ""}
            </span>
          </p>
        </div>

        {/* 名前入力フィールド */}
        <div className="mb-5 w-full flex justify-center">
          <input
            type="text"
            className="text-black text-center p-2 w-1/3 rounded-lg bg-gray-400 placeholder-gray-800 outline-black"
            placeholder="ロッカー番号を入力"
            value={reserver}
            onChange={(e) => setReserver(e.target.value)}
          />
        </div>
        <div>
          <button
            className="w-32 p-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-semibold"
            onClick={handleReserve}
          >
            予約
          </button>
        </div>
      </div>
    </div>
  );
}
