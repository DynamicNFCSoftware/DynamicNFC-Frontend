import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function CardDashboard() {
    const { user } = useAuth();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await fetch("/api/users/my-cards", {
                    credentials: "include"
                });
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                const data = await response.json();
                setCards(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
    if (error) return <div style={{ padding: 40 }}>Error: {error}</div>;

    return (
        <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
            <h1 style={{ marginBottom: 8 }}>My Cards</h1>
            <p style={{ marginBottom: 24, color: "#666" }}>Account email: {user?.email || "-"}</p>

            <div style={{ display: "flex", justifyContent: "flex-start", gap: 12, marginBottom: 24 }}>
                <Link
                    to="/"
                    className="button analytics w-inline-block"
                    style={{ textDecoration: "none" }}
                >
                    <div className="text-size-intermediate text-color-white btn">
                        Home
                    </div>
                </Link>
                <Link
                    to="/create-card"
                    className="button analytics w-inline-block"
                    style={{ textDecoration: "none" }}
                >
                    <div className="text-size-intermediate text-color-white btn">
                        Create New Card
                    </div>
                </Link>
            </div>

            {cards.length === 0 ? (
                <p>No cards found. Create your first card!</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
                            <th style={{ padding: 12 }}>Name</th>
                            <th style={{ padding: 12 }}>Job Title</th>
                            <th style={{ padding: 12 }}>Department</th>
                            <th style={{ padding: 12 }}>Company</th>
                            <th style={{ padding: 12 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map((card) => (
                            <tr key={card.hashId} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: 12 }}>{card.name || "-"}</td>
                                <td style={{ padding: 12 }}>{card.jobTitle || "-"}</td>
                                <td style={{ padding: 12 }}>{card.department || "-"}</td>
                                <td style={{ padding: 12 }}>{card.companyName || "-"}</td>
                                <td style={{ padding: 12 }}>
                                    <Link
                                        to={`/card/?hashId=${card.hashId}`}
                                        className="button analytics w-inline-block"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <div className="text-size-intermediate text-color-white btn">
                                            View
                                        </div>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
