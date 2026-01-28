import { Area } from "@/hooks/useAreas";
import { Genre } from "@/hooks/useGenres";

interface ShopSearchFilterProps {
    selectedArea: string;
    onAreaChange: (value: string) => void;
    selectedGenre: string;
    onGenreChange: (value: string) => void;
    searchName: string;
    onNameChange: (value: string) => void;
    areas?: Area[];
    genres?: Genre[];
}

export default function ShopSearchFilter({
    selectedArea,
    onAreaChange,
    selectedGenre,
    onGenreChange,
    searchName,
    onNameChange,
    areas = [],
    genres = []
}: ShopSearchFilterProps) {
    return (
        <div className="flex bg-white rounded shadow-md overflow-hidden w-full max-w-xl">
            <select
                className="p-2 border-r border-gray-200 text-gray-700 outline-none cursor-pointer text-sm bg-white"
                value={selectedArea}
                onChange={(e) => onAreaChange(e.target.value)}
            >
                <option value="">All area</option>
                {areas.map(area => (
                    <option key={area.id} value={area.id}>{area.name}</option>
                ))}
            </select>
            <select
                className="p-2 border-r border-gray-200 text-gray-700 outline-none cursor-pointer text-sm bg-white"
                value={selectedGenre}
                onChange={(e) => onGenreChange(e.target.value)}
            >
                <option value="">All genre</option>
                {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
            </select>
            <div className="flex items-center p-2 flex-grow">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 105.197 5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search ..."
                    className="outline-none text-gray-700 text-sm w-full"
                    value={searchName}
                    onChange={(e) => onNameChange(e.target.value)}
                />
            </div>
        </div>
    );
}
