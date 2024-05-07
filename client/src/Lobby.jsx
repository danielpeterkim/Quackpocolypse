import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Lobby() {
    const [roomCode, setRoomCode] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [members, setMembers] = useState([]);
    const [playerId, setPlayerId] = useState('');
    const navigate = useNavigate();
    const { roomId } = useParams();
    let [error, setError] = useState(''); 
    const { name } = useParams();

    useEffect(() => {
        const handleGetRoomData = async () => {
            try {
                const response = await fetch('http://localhost:3000/room-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ roomId: roomId })
                });
    
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setRoomCode(data.roomCode);
                    setMembers(data.players);
                    const matchingPlayer = Object.values(data.players).find(player => player.name === name);
                    if (matchingPlayer) {
                        setPlayerId(matchingPlayer.playerId);
                    } 
                } else {
                    throw new Error(data.error);
                }
            } catch (error) {
                console.error('Error getting room data:', error.message);
                setError(error.message);
            }
        };

        if (roomId) {
            handleGetRoomData();
        }
    }, []);


        const startGame = async () => {
            try {
                
                const response = await fetch('http://localhost:3000/start-game', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ playerId: playerId, roomId: roomId })
                });
                const data = await response.json();
                if (response.ok) {
                    console.log('Room ID:', data.roomId);
                    navigate(`/board/${name}/${data.roomId}`);
                } else {
                    throw new Error(data.error);
                }
            } catch (error) {
                console.error('Error starting game:', error.message);
                setError(error.message);
            }
        };

    const handleInfo = () => {
        setShowInfo(!showInfo);
    };

    return (
        <div className="min-h-screen bg-gray-800 flex justify-center items-center">
            <div className="lobby border-2 border-red-800 rounded-lg p-20 bg-gray-800 text-white">
                <h1 className='text-3xl text-pink text-center font-bold'>Lobby</h1>
                {error && <p className="text-red-600">{error}</p>}
                <div>
                    <h3>Code: {roomCode}</h3>
                    <h5>Members: </h5>
                    <ul>
                        {Object.keys(members).map(playerId => (
                            <li key={playerId}>{members[playerId].name}</li>
                        ))}
                    </ul>
                    
                    {roomId ? (
                        <button className="bg-red-800 hover:bg-red-600 text-white px-10 py-2 rounded-lg text-lg" onClick={startGame}>Start Game</button>
                    ) : (
                        <p>Waiting for server response...</p>
                    )}
                </div>
                <div>
                    {showInfo && (
                        <div>
                            <h4>Info: </h4>
                            <p>Quackpocalypse is a cooperative, turn-based, online multiplayer game where 2-4 players work together in order to fight a life-threatening zombie plague: the fate of Stevens campus depends on your group of students to contain the horde and find a cure. In order to win, the students have to cure all 4 strains by collecting and sharing the corresponding-colored cards, while taking care not to let too many locations get out of control.</p>
                        </div>
                    )}
                </div>
                <button className="info-button absolute bottom-20 right-20" onClick={handleInfo}>Info</button>
            </div>
        </div>
    );
}

export default Lobby;
