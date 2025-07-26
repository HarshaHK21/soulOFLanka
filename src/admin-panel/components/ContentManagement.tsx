import { dummyContent } from './data/dummyData';

export default function ContentManagement() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Content Management</h2>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyContent.map((content) => (
              <tr key={content.id} className="border-t">
                <td className="p-4">{content.title}</td>
                <td className="p-4">{content.type}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      content.status === 'Published'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {content.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}