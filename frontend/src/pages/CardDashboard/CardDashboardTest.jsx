import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./CardDashboard.css";

export default function CardDashboardTest() {
    const { user } = useAuth();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);

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

    const handleDelete = async (hashId) => {
        if (!window.confirm("Are you sure you want to delete this card?")) {
            return;
        }

        setDeleting(hashId);
        try {
            const response = await fetch(`/api/users/${hashId}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error(`Failed to delete card: ${response.status}`);
            }

            // Remove the card from the list
            setCards(cards.filter(card => card.hashId !== hashId));
        } catch (err) {
            alert(`Error deleting card: ${err.message}`);
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return <div className="dashboard-loading">Loading...</div>;
    if (error) return <div className="dashboard-loading">Error: {error}</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="dashboard-header-info">
                    <h1 className="dashboard-title">My Cards</h1>
                    <p className="dashboard-email">Account email: {user?.email || "-"}</p>
                </div>
                <div className="dashboard-header-buttons">
                    <Link
                        to="/"
                        className="button analytics w-inline-block"
                    >
                        <div className="text-size-intermediate text-color-white btn">
                            Home
                        </div>
                    </Link>
                    <Link
                        to="/create-card"
                        className="button analytics w-inline-block"
                    >
                        <div className="text-size-intermediate text-color-white btn">
                            Create New Card
                        </div>
                    </Link>
                </div>
            </div>

            {cards.length === 0 ? (
                <p>No cards found. Create your first card!</p>
            ) : (
                <>
                    {/* Desktop Table */}
                    <table className="dashboard-table desktop-only">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Job Title</th>
                                <th>Department</th>
                                <th>Company</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cards.map((card) => (
                                <tr key={card.hashId}>
                                    <td>{card.name || "-"}</td>
                                    <td>{card.jobTitle || "-"}</td>
                                    <td>{card.department || "-"}</td>
                                    <td>{card.companyName || "-"}</td>
                                    <td className="dashboard-actions">
                                        <Link
                                            to={`/card/?hashId=${card.hashId}`}
                                            className="button analytics w-inline-block"
                                        >
                                            <div className="text-size-intermediate text-color-white btn">
                                                View
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(card.hashId)}
                                            disabled={deleting === card.hashId}
                                            className="button analytics w-inline-block dashboard-delete-btn"
                                            style={{
                                                opacity: deleting === card.hashId ? 0.6 : 1,
                                                cursor: deleting === card.hashId ? "not-allowed" : "pointer"
                                            }}
                                        >
                                            <div className="text-size-intermediate text-color-white btn">
                                                {deleting === card.hashId ? "Deleting..." : "Delete"}
                                            </div>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Cards */}
                    <div className="dashboard-cards mobile-only">
                        {cards.map((card) => (
                            <div key={card.hashId} className="dashboard-card">
                                <div className="dashboard-card-info">
                                    <h3 className="dashboard-card-name">{card.name || "-"}</h3>
                                    <p className="dashboard-card-detail"><strong>Job:</strong> {card.jobTitle || "-"}</p>
                                    <p className="dashboard-card-detail"><strong>Dept:</strong> {card.department || "-"}</p>
                                    <p className="dashboard-card-detail"><strong>Company:</strong> {card.companyName || "-"}</p>
                                </div>
                                <div className="dashboard-card-actions">
                                    <Link
                                        to={`/card/?hashId=${card.hashId}`}
                                        className="button analytics w-inline-block"
                                    >
                                        <div className="text-size-intermediate text-color-white btn">
                                            View
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(card.hashId)}
                                        disabled={deleting === card.hashId}
                                        className="button analytics w-inline-block dashboard-delete-btn"
                                        style={{
                                            opacity: deleting === card.hashId ? 0.6 : 1,
                                            cursor: deleting === card.hashId ? "not-allowed" : "pointer"
                                        }}
                                    >
                                        <div className="text-size-intermediate text-color-white btn">
                                            {deleting === card.hashId ? "Deleting..." : "Delete"}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
