'use client'

export default function Header({ title }: { title: string }) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search..."
          className="px-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-aws focus:border-transparent"
        />
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <span className="text-2xl">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-10 h-10 bg-aws rounded-full flex items-center justify-center font-bold text-white">
          A
        </div>
      </div>
    </div>
  )
}
