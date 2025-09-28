import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/sites";

export default function SitesTable() {
    const [sites, setSites] = useState([]);
    const [editingSite, setEditingSite] = useState(null);
    const [formData, setFormData] = useState({ name: "", url: "", image: "", score: 0 });
    const [newSite, setNewSite] = useState({ name: "", url: "", image: "", score: 0 });

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        try {
            const resp = await fetch(API_URL);
            const data = await resp.json();
            setSites(data);
        } catch (err) {
            console.error("Failed to fetch sites:", err);
        }
    };

    const handleDelete = async (id) => {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchSites();
    };

    const handleEdit = (site) => {
        setEditingSite(site._id);
        setFormData({ name: site.name, url: site.url, image: site.image, score: site.score });
    };

    const handleSave = async () => {
        await fetch(`${API_URL}/${editingSite}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        setEditingSite(null);
        fetchSites();
    };

    const handleAdd = async () => {
        if (
            newSite.name.length < 2 ||
            newSite.url.length < 5 ||
            newSite.image.length < 5 ||
            newSite.score < 0 || newSite.score > 10
        ) {
            alert("Please enter valid data!");
            return;
        }

        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSite)
        });
        setNewSite({ name: "", url: "", image: "", score: 0 });
        fetchSites();
    };

    const handleChange = (e, isNew = false) => {
        const { name, value } = e.target;
        if (isNew) {
            setNewSite(prev => ({ ...prev, [name]: name === "score" ? Number(value) : value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: name === "score" ? Number(value) : value }));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Sites List</h2>

            {/* טופס הוספה */}
            <div className="mb-4 p-3 border rounded">
                <h5>Add New Site</h5>
                <div className="row g-2">
                    <div className="col">
                        <input type="text" className="form-control" placeholder="Name" name="name" value={newSite.name} onChange={(e) => handleChange(e, true)} />
                    </div>
                    <div className="col">
                        <input type="text" className="form-control" placeholder="URL" name="url" value={newSite.url} onChange={(e) => handleChange(e, true)} />
                    </div>
                    <div className="col">
                        <input type="text" className="form-control" placeholder="Image URL" name="image" value={newSite.image} onChange={(e) => handleChange(e, true)} />
                    </div>
                    <div className="col">
                        <input type="number" className="form-control" placeholder="Score" name="score" min="0" max="10" value={newSite.score} onChange={(e) => handleChange(e, true)} />
                    </div>
                    <div className="col">
                        <button className="btn btn-success w-100" onClick={handleAdd}>Add Site</button>
                    </div>
                </div>
            </div>

            {/* טבלה */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>URL</th>
                        <th>Score</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sites.map(site => (
                        <tr key={site._id}>
                            <td><img src={site.image} alt={site.name} width="100" /></td>
                            <td>
                                {editingSite === site._id
                                    ? <input name="name" value={formData.name} onChange={handleChange} />
                                    : site.name}
                            </td>
                            <td>
                                {editingSite === site._id
                                    ? <input name="url" value={formData.url} onChange={handleChange} />
                                    : <a href={site.url} target="_blank" rel="noopener noreferrer">{site.url}</a>}
                            </td>
                            <td>
                                {editingSite === site._id
                                    ? <input type="number" name="score" value={formData.score} onChange={handleChange} min="0" max="10" />
                                    : site.score}
                            </td>
                            <td>
                                {editingSite === site._id ?
                                    <button className="btn btn-success btn-sm" onClick={handleSave}>Save</button> :
                                    <>
                                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(site)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(site._id)}>Delete</button>
                                    </>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
