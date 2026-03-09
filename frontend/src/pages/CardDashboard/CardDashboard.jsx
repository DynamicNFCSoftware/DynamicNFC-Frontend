import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
.pd-wrapper { min-height: 100vh; background: #0D0D12; color: #E8E8EC; font-family: 'Outfit', sans-serif; padding-bottom: 5rem; }
.pd-header { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 3rem; background: rgba(13, 13, 18, 0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); position: sticky; top: 0; z-index: 50; }
.pd-logo-text { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 600; color: #fff; }
.pd-container { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; }
.pd-stats { display: flex; gap: 2rem; background: rgba(255,255,255,0.02); padding: 1.25rem 2.5rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); min-width: 250px; justify-content: center; }
.pd-stat-val { font-size: 1.75rem; font-weight: 600; color: #fff; display: block; text-align: center; }
.pd-stat-lbl { font-size: 0.7rem; text-transform: uppercase; color: rgba(255,255,255,0.4); letter-spacing: 1px; }
.pd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem; }
.pd-card { background: linear-gradient(145deg, #1c1c24, #121218); border-radius: 24px; padding: 2px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5); min-height: 340px; transition: 0.3s; }
.pd-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
.pd-card-inner { background: #141419; border-radius: 22px; height: 100%; overflow: hidden; display: flex; flex-direction: column; }
.pd-card-cover { height: 100px; background-size: cover; background-position: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
.pd-card-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; justify-content: center; }
.pd-card-name { font-size: 1.3rem; font-weight: 600; color: #fff; margin-bottom: 0.2rem; }
.pd-card-title { font-size: 0.85rem; color: #e63946; margin-bottom: 1rem; }
.pd-card-actions { display: flex; gap: 0.5rem; padding: 1.2rem; border-top: 1px solid rgba(255,255,255,0.05); }
.pd-btn-action { flex: 1; padding: 0.6rem; border-radius: 10px; font-size: 0.75rem; font-weight: 500; cursor: pointer; text-align: center; text-decoration: none; border: 1px solid rgba(255,255,255,0.1); color: #fff; background: rgba(255,255,255,0.05); transition: 0.2s; display: flex; align-items: center; justify-content: center;}
.pd-btn-action:hover { background: rgba(255,255,255,0.12); }
.pd-card-new { border: 2px dashed rgba(255,255,255,0.1); border-radius: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 340px; text-decoration: none; background: rgba(255,255,255,0.01); color: #fff; transition: 0.3s; }
.pd-card-new:hover { border-color: #e63946; background: rgba(230, 57, 70, 0.05); }
.btn-delete:hover { background: rgba(230,57,70,0.1) !important; border-color: rgba(230,57,70,0.5) !important; color: #e63946 !important; }
`;

export default function CardDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const uid = user?.uid || user?.accountId;
        if (!user || !uid) return;

        const q = query(collection(db, "cards"), where("userId", "==", uid));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCards(data);
        }, (err) => {
            console.error("Firestore Error:", err);
        });

        return () => unsubscribe();
    }, [user]);

    const totalScans = cards.reduce((s, c) => s + (Number(c.scans) || 0), 0);

    return (
        <div className="pd-wrapper">
            <style>{CSS}</style>
            <header className="pd-header">
                <div className="pd-logo-text">DynamicNFC</div>
                <button className="pd-btn-action" style={{maxWidth:'120px'}} onClick={async () => { await logout(); navigate("/login"); }}>Sign Out</button>
            </header>
            
            <main className="pd-container">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'3rem', flexWrap:'wrap', gap:'1rem'}}>
                    <div>
                        <h1 style={{fontFamily:"'Playfair Display'", fontSize:'2.5rem', marginBottom:'0.5rem'}}>Portfolio</h1>
                        <p style={{color:'rgba(255,255,255,0.4)', fontWeight:300}}>Welcome back, {user?.email?.split('@')[0]}</p>
                    </div>
                    <div className="pd-stats">
                        <div><span className="pd-stat-val">{cards.length}</span><span className="pd-stat-lbl">Active Cards</span></div>
                        <div style={{width:'1px', height:'30px', background:'rgba(255,255,255,0.1)'}}></div>
                        <div><span className="pd-stat-val" style={{color:'#e63946'}}>{totalScans}</span><span className="pd-stat-lbl">Real Scans</span></div>
                    </div>
                </div>

                <div className="pd-grid">
                    {cards.map(card => (
                        <div className="pd-card" key={card.id}>
                            <div className="pd-card-inner">
                                <div className="pd-card-cover" style={{
                                    backgroundImage: card.images?.cover ? `url(${card.images.cover})` : 'none',
                                    backgroundColor: !card.images?.cover ? (card.accentColor || '#1c1c24') : 'transparent'
                                }} />
                                <div className="pd-card-body">
                                    <div className="pd-card-name">{card.name || "Untitled Identity"}</div>
                                    <div className="pd-card-title" style={{color: card.accentColor || '#e63946'}}>{card.title || "Card Holder"}</div>
                                    <div style={{fontSize:'0.75rem', opacity:0.4}}>Scans: {card.scans || 0}</div>
                                </div>
                                <div className="pd-card-actions">
                                    <Link to={`/card/?hashId=${card.id}`} target="_blank" className="pd-btn-action">Preview Live</Link>
                                    <button className="pd-btn-action" onClick={() => navigate(`/edit-card?hashId=${card.id}`)}>Edit</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <Link to="/create-card" className="pd-card-new">
                        <span style={{fontSize:'3.5rem', fontWeight:200, marginBottom:'1rem'}}>+</span>
                        <span style={{fontSize:'0.8rem', letterSpacing:'1.5px', textTransform:'uppercase'}}>Create New Card</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}