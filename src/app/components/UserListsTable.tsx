"use client";

import { Audios, Others_File, Pictures, Profile, Videos } from "@prisma/client";
import { useState } from "react";

interface User {
  id: number | string;
  name: string;
  email: string;
  videos: Videos[]; // array of Videos
  audios: Audios[]; // array of Audios
  pictures: Pictures[]; // array of Pictures
  othersFile: Others_File[]; // array of Others_File
  profile: Profile | null;
  createdAt: string;
}

interface UserProps {
  users: User[];
}

export default function UserListsTable({ users }: UserProps) {
  const [search, setSearch] = useState("");
  const [usersData, setUsersData] = useState(users);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredUsers = usersData.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleEdit = (id: number | string) => {
    console.log("Edit user", id);
  };

  const handleDelete = (id: number | string) => {
    setUsersData((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="w-full overflow-x-auto md:h-[600px] h-screen mt-12 bg-gray-800 text-white rounded shadow-md p-4">
      {/* Search & Controls */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 p-2 border border-gray-500 rounded bg-gray-700 text-white"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={handleRowsChange}
            className="border border-gray-500 bg-gray-700 text-white p-1 rounded"
          >
            {[5, 10, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="p-2 border border-gray-600">ID</th>
              <th className="p-2 border border-gray-600">Name</th>
              <th className="p-2 border border-gray-600">Email</th>
              <th className="p-2 border border-gray-600">Avatar</th>
              <th className="p-2 border border-gray-600">Videos</th>
              <th className="p-2 border border-gray-600">Audios</th>
              <th className="p-2 border border-gray-600">Pictures</th>
              <th className="p-2 border border-gray-600">Others File</th>
              <th className="p-2 border border-gray-600 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-400">
                  No matching users found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="p-2 border border-gray-600">{user.id}</td>
                  <td className="p-2 border border-gray-600">{user.name}</td>
                  <td className="p-2 border border-gray-600">{user.email}</td>
                  <td className="p-2 border border-gray-600">
                    <div className="text-sm flex items-center gap-2">
                      <img
                        src={user?.profile?.image || "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-2 border border-gray-600">
                    {user.videos?.length}
                  </td>
                  <td className="p-2 border border-gray-600">
                    {user.audios.length}
                  </td>
                  <td className="p-2 border border-gray-600">
                    {user.pictures.length}
                  </td>
                  <td className="p-2 border border-gray-600">
                    {user.othersFile.length}
                  </td>
                  <td className="p-2 border border-gray-600 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded mr-2 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {paginatedUsers.length === 0 ? (
          <p className="text-center text-gray-400">No matching users found.</p>
        ) : (
          paginatedUsers.map((user) => (
            <div
              key={user.id}
              className="border border-gray-600 rounded p-3 bg-gray-700 space-y-2"
            >
              <div className="text-sm">
                <strong>ID:</strong> {user.id}
              </div>
              <div className="text-sm">
                <strong>Name:</strong> {user.name}
              </div>
              <div className="text-sm">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="text-sm">
                <strong>Avatar:</strong> {user?.profile?.image}
              </div>
              <div className="text-sm">
                <strong>Videos:</strong> {user.videos.length}
              </div>
              <div className="text-sm">
                <strong>Audios:</strong> {user.audios.length}
              </div>
              <div className="text-sm">
                <strong>Pictures:</strong> {user.pictures.length}
              </div>
              <div className="text-sm">
                <strong>Others:</strong> {user.othersFile.length}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(user.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center flex-wrap gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
