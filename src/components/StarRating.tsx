import { StarIcon } from "./Icons";

// Shows a rating from 0 to 5 as stars, e.g. <StarRating rating={4.5} />
export default function StarRating({ rating, className = "h-5 w-5" }: { rating: number; className?: string }) {
  const filledStars = Math.round(rating);

  return (
    <div className="flex" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          filled={star <= filledStars}
          className={`${className} ${star <= filledStars ? "text-amber-400" : "text-slate-300"}`}
        />
      ))}
    </div>
  );
}
