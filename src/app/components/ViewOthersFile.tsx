import React from "react";

interface OthersFile {
  id: number | string;
  title: string;
  description?: string;
  file: string;
  fileUrl: string;
  userId: number;
  createdAt: string;
}

interface OthersProps {
  otherfiles: OthersFile[];
}

export default function ViewOthersFile({ otherfiles }: OthersProps) {
  if (!otherfiles || otherfiles.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No PDF files to display.
      </p>
    );
  }

  return (
    <div className="max-w-7xl  mt-10 mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {otherfiles.map(({ id, title, description, fileUrl, file }) => (
        <div
          key={id}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-5 flex flex-col"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white truncate">
            {title}
          </h3>
          {description && (
            <p className="mb-4 text-gray-700 dark:text-gray-300 line-clamp-3">
              {description}
            </p>
          )}
          <div className="flex-grow border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
            <iframe
              src={fileUrl || file}
              title={title}
              className="w-full h-64 sm:h-80 md:h-96"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      ))}
    </div>
  );
}
