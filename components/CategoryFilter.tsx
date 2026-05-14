// 1. Crear nuevo componente reutilizable: components/CategoryFilter.tsx
export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 my-4">
      <button
        onClick={() => onSelectCategory("")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          selectedCategory === ""
            ? "bg-black text-white dark:bg-white dark:text-black" // Se adapta a branding neutral/clásico
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        Todas
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            selectedCategory === category
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}