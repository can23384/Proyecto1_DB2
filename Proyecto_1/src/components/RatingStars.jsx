export default function RatingStars({ value }) {
  const fullStars = Math.round(value);

  return (
    <div className="stars">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index}>{index < fullStars ? '★' : '☆'}</span>
      ))}
      <span className="stars-value">{value.toFixed(1)}</span>
    </div>
  );
}
